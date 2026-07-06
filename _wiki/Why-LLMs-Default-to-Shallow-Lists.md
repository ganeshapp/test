---
permalink: /wiki/Why-LLMs-Default-to-Shallow-Lists/
title: "Why LLMs Default to Shallow Lists"
date: 2026-05-22
tags: [AI, prompting]
---

A recurring complaint about language models: when you ask a question that requires *depth* — actually thinking about the underlying structure of something, then applying that as a filter before answering — the default response is a wide, shallow list.

Ask "what are the best TV shows about male friendship?" and you get a 30-item list spanning sitcoms, dramas, animations, and "shows that have friendship in them." Ask "what's the best place to retire in Asia?" and you get a country-by-country survey, each section starting the same way, none reconciling against the others. The output is grammatically correct and contains useful pieces, but it doesn't *think*.

This failure mode is consistent enough that it's worth understanding.

## The four default modes

Most LLMs default to one of:

- **Summarizer mode:** "Here are the key points." Lists, bullets, broad coverage.
- **Explainer mode:** "Let me teach you." Audience-facing prose with definitions and framing.
- **Essayist mode:** "Let me sound insightful." Polished writing with rhetorical structure.
- **Consultant mode:** Frameworks plugged in without grounding — 2x2 matrices, executive summaries.

None of these is what you want when you're asking the model to *reconcile* a hard question. They produce *coverage* instead of *thinking*.

## Why this happens

Three structural reasons stack:

1. **Training distribution.** LLMs are trained on essays, articles, Wikipedia, textbook explanations — virtually all audience-facing content. The lecturer voice is baked in.
2. **RLHF rewards.** Human raters often prefer broader, well-organised answers over deep, opinionated ones, because broader answers are harder to mark wrong. The training process therefore reinforces breadth over depth.
3. **Question matching.** The model matches the surface form of your question, not its deeper intent. "What are good TV shows about male friendship?" looks like a recommendation request, so it generates a recommendation list — even when the deeper question is "what specifically makes a depiction of male friendship feel *real* on TV?"

## A useful framing: texture vs thesis

When the model defaults to lists, it's treating its subject as **texture**: things that have the requested quality somewhere in them. In Scrubs, the friendship between JD and Turk is texture — it makes the show likeable but isn't the show's thesis. In *House MD* or *Boston Legal*, the friendship is the show's thesis — every other plot mechanic exists to set up moments between the central characters.

A question phrased as "what are TV shows about X" gets a *texture* answer by default. The shows that genuinely have X as their *thesis* — earned over many seasons, supported by absurd-but-believable gestures — are a much smaller list, and the model rarely volunteers that distinction without being pushed.

The same pattern repeats across domains: best programming language for X (texture vs thesis), best place to live (texture vs thesis), best framework for Y. The model defaults to surface-level matching unless explicitly redirected.

## How to force depth

The fix is to make the depth criterion explicit before the model answers. Useful tactics:

- **Name the failure mode in the prompt.** "Do not give me a list. Give me the underlying structure first, then 2–3 examples that earn that structure."
- **Force a filter.** "What's the structural distinction between [X] and [things that look like X]? Use that distinction to filter your answer."
- **Demand the unifying principle.** "Resolve all the strong ideas into a single causal model. If two ideas conflict, resolve the conflict explicitly."
- **Forbid coverage.** "I do not want breadth. I want depth. Pick one or two cases and go deep."

See [Prompting LLMs for First-Principles Synthesis](/wiki/Prompting-LLMs-for-First-Principles-Synthesis/) for a fuller prompt template specifically aimed at synthesis tasks.

## Why this is worth knowing

When the model returns a salad-bowl list and you accept it, you reinforce its training to do this. When you push back specifically — "no, that's coverage, give me the underlying structure" — you get answers that are often genuinely insightful, and you train yourself to recognise the failure mode quickly.

The pattern that helps: **before reading the model's first answer, ask yourself what the *shallow* version of the answer would be. If the model gives you that, push back. If it gives you something deeper, the answer is at least working.**

The user-side discipline matters because models don't auto-correct toward depth. They have to be pushed there question by question.

## See also

- [Prompting LLMs for First-Principles Synthesis](/wiki/Prompting-LLMs-for-First-Principles-Synthesis/)
- [Arbitrage Decay](/wiki/Arbitrage-Decay/)
- [Training Data](/wiki/Training-Data/)
