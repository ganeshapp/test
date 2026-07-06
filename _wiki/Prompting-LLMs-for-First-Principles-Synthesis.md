---
permalink: /wiki/Prompting-LLMs-for-First-Principles-Synthesis/
title: "Prompting LLMs for First-Principles Synthesis"
date: 2026-05-22
tags: [web, ai, prompting]
---

A specific frustration with language models: when asked to *synthesize* a body of source material — say, an article plus its Hacker News discussion — into a unified mental model, the default output is usually one of four failure modes:

- **Summarizer mode:** "Here are the key points."
- **Explainer mode:** "Let me teach you what this is about."
- **Essayist mode:** "Let me sound insightful and quotable."
- **Consultant mode:** Frameworks without grounding, salad-bowl writing.

None of these is real synthesis. Real synthesis reconciles all the strong ideas into a single causal model, grounds every claim in a constraint, and resolves conflicts explicitly. It looks more like a research notebook than a polished essay.

To get there reliably, you have to prompt the model into a mode it doesn't default to.

## What "real synthesis" looks like

The mental mode you actually want the model in:

- A systems thinker, not an essayist
- Working from **economic, technical, or operational constraints**, not abstract ideas
- Treating ideas as dependent variables — they exist for a reason
- Explicitly forbidden from lecturing, summarizing, philosophising, or smoothing over conceptual gaps

The hardest part is the last one. By default the model will paper over conflicts to keep the prose flowing. That's exactly what produces salad-bowl writing — twenty grammatically correct sentences that don't add up.

## The base prompt

This is a reusable prompt. The wording is deliberate — every constraint is doing real work.

> Read the article and the full Hacker News discussion carefully.
>
> Your task is **not** to summarize, explain, or teach.
>
> Your task is to **reconcile all the strongest ideas into a single first-principles model**, written as a quiet personal essay someone might write for themselves in the mid-2000s.
>
> Constraints:
>
> - Do not address an audience.
> - Do not say "this article argues" or "the comments say."
> - Do not stack unrelated observations.
> - Every claim must be grounded in technical, economic, or operational constraints.
> - If two ideas conflict, resolve the conflict explicitly or explain why the tension exists.
> - Prefer causal chains over abstractions.
> - Avoid moral language and philosophy padding.
>
> Goal:
>
> - Produce a coherent mental model that explains why we ended up here, what improved, what was lost, and what cannot be undone.
>
> Write it as if the author is thinking on paper, not persuading anyone.

That alone eliminates most failure modes.

## Optional add-ons

Use selectively, depending on the topic.

### Economic grounding (recommended for most topics)

> Anchor the entire essay around **who pays for what**, and how that constraint reshapes openness, distribution, and incentives.

### Technical evolution clarity

> Explicitly track what changed at each layer: storage, bandwidth, identity, discovery, moderation, and monetization.

### Anti-bullshit enforcement

> If you introduce a term (e.g., "identity," "centralization," "protocol"), define it operationally before using it.

## Early-warning signals the model is drifting

Abort and re-prompt as soon as you see:

- "This article highlights…"
- "We can see that…"
- "This shows us…"
- "Ultimately, this teaches us…"
- A paragraph that could be shuffled with the next without changing meaning
- A claim without a *because*

These are the audible giveaways that the model has slipped back into essayist, summarizer, or consultant mode.

## The one-line emergency version

For when patience is short:

> Synthesize the article and HN comments into a single first-principles mental model, grounded in technical and economic constraints, written as a private reflective essay with no audience, no summaries, and no unsupported abstractions.

That alone is already better than 95% of synthesis prompts people actually use.

## A final pattern

After several rounds of this, you start to notice that the work the model is doing isn't really *writing*. It's **first-principles reconciliation under constraint** — which is closer to research note-making than content generation.

Most language models are optimized against this kind of thinking by default. They're trained on essays, articles, and other audience-facing prose, which all have a "lecturer voice" baked in. With the right prompt you can get past it, but you do have to be explicit about every constraint and aggressive about correcting drift.

## See also

- [Why the Web Got Walled](/wiki/Why-the-Web-Got-Walled/)
- [Why LLMs Default to Shallow Lists](/wiki/Why-LLMs-Default-to-Shallow-Lists/)
