# When the site is served from a subpath (e.g. gapp.in/test), prefix all
# root-relative hrefs/srcs in rendered output with the baseurl.
# Skips links that already carry the baseurl (i.e. those built with
# Liquid's relative_url filter) to avoid double-prefixing.
# No-op in production where baseurl is "".
Jekyll::Hooks.register [:documents, :pages], :post_render do |item|
  base = item.site.config["baseurl"].to_s
  next if base.empty? || item.output.nil?
  next unless item.output_ext == ".html" || item.url.end_with?("/")

  bare = Regexp.escape(base.sub(%r{\A/}, ""))
  item.output = item.output.gsub(%r{(href|src)="/(?!/|#{bare}(?:/|"))}) do
    "#{Regexp.last_match(1)}=\"#{base}/"
  end
end
