# Album generator.
#
# Two sources, same conventions (0.* = cover, album.md = blurb, folder name = title):
#
#   1. Local: assets/albums/<folder>/  (images live in this repo)
#   2. Remote: a separate GitHub repo (site.config["album_repo"], e.g. "ganeshapp/album")
#      fetched at build time and served through jsDelivr's free CDN, so photos
#      never count against GitHub Pages storage/bandwidth limits.
#
# Remote URLs are pinned to the latest commit SHA so jsDelivr's aggressive
# caching can never serve stale images after a re-upload.
require "net/http"
require "json"
require "uri"

module Albums
  IMAGE_EXT = %w[.jpg .jpeg .png .gif .webp .avif].freeze

  class AlbumPage < Jekyll::PageWithoutAFile
    def initialize(site, slug, title, blurb_md, cover, images)
      super(site, site.source, File.join("albums", slug), "index.md")
      @site = site
      self.content = blurb_md
      self.data = {
        "layout" => "album",
        "title" => title,
        "blurb" => first_lines(blurb_md),
        "cover" => cover,
        "images" => images,
        "search" => true
      }
    end

    def first_lines(md)
      text = md.to_s.gsub(/^#.*$/, "").gsub(/[*_`\[\]()>#]/, "").strip
      text.split(/\n+/).first(2).join(" ").strip
    end
  end

  module Helpers
    def self.titleize(folder)
      folder.tr("_-", "  ").split.map(&:capitalize).join(" ")
    end

    def self.pick_cover(images)
      images.find { |f| File.basename(f, ".*") == "0" }
    end

    def self.strip_front_matter(text)
      text.sub(/\A---\s*\n.*?\n---\s*\n/m, "")
    end

    def self.http_get(url, headers = {})
      uri = URI(url)
      res = Net::HTTP.start(uri.host, uri.port, use_ssl: true, open_timeout: 10, read_timeout: 20) do |http|
        req = Net::HTTP::Get.new(uri)
        headers.each { |k, v| req[k] = v }
        http.request(req)
      end
      res.is_a?(Net::HTTPSuccess) ? res.body : nil
    rescue StandardError => e
      Jekyll.logger.warn "Albums:", "fetch failed #{url}: #{e.message}"
      nil
    end
  end

  class Generator < Jekyll::Generator
    safe false
    priority :low

    def generate(site)
      slugs = generate_local(site)
      generate_remote(site, slugs)
    end

    # ---------- local albums (assets/albums/*) ----------
    def generate_local(site)
      slugs = []
      albums_dir = File.join(site.source, "assets", "albums")
      return slugs unless Dir.exist?(albums_dir)

      Dir.children(albums_dir).sort.each do |folder|
        dir = File.join(albums_dir, folder)
        next unless File.directory?(dir)

        files = Dir.children(dir).sort
        images = files.select { |f| IMAGE_EXT.include?(File.extname(f).downcase) }
        next if images.empty?

        cover_file = Helpers.pick_cover(images)
        gallery = images.reject { |f| f == cover_file }
        gallery = images if gallery.empty?

        slug = Jekyll::Utils.slugify(folder)
        blurb_path = File.join(dir, "album.md")
        blurb = File.exist?(blurb_path) ? Helpers.strip_front_matter(File.read(blurb_path)) : ""

        base = "/assets/albums/#{folder}"
        cover = "#{base}/#{cover_file || images.first}"
        site.pages << AlbumPage.new(site, slug, Helpers.titleize(folder), blurb,
                                    cover, gallery.map { |f| "#{base}/#{f}" })
        slugs << slug
      end
      slugs
    end

    # ---------- remote albums (separate repo via jsDelivr) ----------
    def generate_remote(site, existing_slugs)
      repo = site.config["album_repo"]
      return if repo.to_s.empty?

      branch = site.config["album_branch"] || "main"
      ref = resolve_sha(repo, branch) || branch
      files = remote_file_list(repo, ref, branch)
      if files.nil?
        Jekyll.logger.warn "Albums:", "could not list #{repo} — remote albums skipped this build"
        return
      end

      cdn = "https://cdn.jsdelivr.net/gh/#{repo}@#{ref}"
      folders = {}
      files.each do |path|
        parts = path.sub(%r{\A/}, "").split("/")
        next unless parts.size == 2
        (folders[parts[0]] ||= []) << parts[1]
      end

      folders.sort.each do |folder, names|
        images = names.select { |f| IMAGE_EXT.include?(File.extname(f).downcase) }.sort
        next if images.empty?

        slug = Jekyll::Utils.slugify(folder)
        next if existing_slugs.include?(slug)

        cover_file = Helpers.pick_cover(images)
        gallery = images.reject { |f| f == cover_file }
        gallery = images if gallery.empty?

        blurb = ""
        if names.include?("album.md")
          raw = Helpers.http_get("https://raw.githubusercontent.com/#{repo}/#{ref}/#{folder}/album.md") ||
                Helpers.http_get("#{cdn}/#{folder}/album.md")
          blurb = Helpers.strip_front_matter(raw) if raw
        end

        enc = ->(f) { "#{cdn}/#{folder}/#{URI::DEFAULT_PARSER.escape(f)}" }
        cover = enc.call(cover_file || images.first)
        site.pages << AlbumPage.new(site, slug, Helpers.titleize(folder), blurb,
                                    cover, gallery.map(&enc))
        Jekyll.logger.info "Albums:", "remote album '#{folder}' (#{gallery.size} photos)"
      end
    end

    def resolve_sha(repo, branch)
      headers = { "Accept" => "application/vnd.github+json", "User-Agent" => "jekyll-albums" }
      token = ENV["GITHUB_TOKEN"]
      headers["Authorization"] = "Bearer #{token}" if token && !token.empty?
      body = Helpers.http_get("https://api.github.com/repos/#{repo}/commits/#{branch}", headers)
      body ? JSON.parse(body)["sha"] : nil
    rescue StandardError
      nil
    end

    def remote_file_list(repo, ref, branch)
      # Prefer the GitHub tree API (always fresh); fall back to jsDelivr's data API.
      headers = { "Accept" => "application/vnd.github+json", "User-Agent" => "jekyll-albums" }
      token = ENV["GITHUB_TOKEN"]
      headers["Authorization"] = "Bearer #{token}" if token && !token.empty?
      body = Helpers.http_get("https://api.github.com/repos/#{repo}/git/trees/#{ref}?recursive=1", headers)
      if body
        tree = JSON.parse(body)["tree"] || []
        return tree.select { |n| n["type"] == "blob" }.map { |n| n["path"] }
      end
      body = Helpers.http_get("https://data.jsdelivr.com/v1/packages/gh/#{repo}@#{branch}?structure=flat")
      return nil unless body
      (JSON.parse(body)["files"] || []).map { |f| f["name"] }
    rescue StandardError => e
      Jekyll.logger.warn "Albums:", "file list error: #{e.message}"
      nil
    end
  end
end
