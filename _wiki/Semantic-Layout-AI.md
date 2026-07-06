---
permalink: /wiki/Semantic-Layout-AI/
title: "Semantic Layout AI"
date: 2026-05-22
tags: [AI]
---

When a teacher draws on a blackboard, they think in concepts: "I'll draw a right triangle here, label the sides x, y, z, and write the Pythagorean theorem nearby." They don't think in pixel coordinates ("place the triangle vertex at (340, 220) with hypotenuse of 180 px"). The spatial layout is intuited from available space, intended emphasis, and learned visual conventions.

Replicating that intuition computationally — taking high-level semantic instructions and producing pleasing low-level geometric layouts — is a genuinely hard AI problem. It comes up whenever you want to drive a robotic arm, a plotter, a tablet-based teaching app, or any system that has to *render* concepts rather than just store them.

## The problem, restated cleanly

The input is **semantic**:

```
Draw a right triangle.
Label sides x, y, z where z is the hypotenuse.
Write the formula x² + y² = z² near the triangle.
```

The desired output is **geometric**:

```
- Triangle at appropriate scale, centered or off-center based on remaining canvas
- Side labels placed at midpoints with small offsets, oriented outward
- Formula placed in the largest available empty region adjacent to the triangle
- All elements at readable sizes, no overlaps, legible composition
```

The challenge is **not drawing** — that's mechanical once you know where to put things. The challenge is the semantic-to-geometric mapping.

## The four-stage pipeline

A working system separates concerns into four stages:

### 1. Semantic scene description

A symbolic representation of *what* must be drawn. Domain-specific languages (DSLs) work well here:

```
Scene:
  Objects:
    - Triangle(type=right, sides=[x, y, z], hypotenuse=z)
    - Text("x") attached to side x
    - Text("y") attached to side y
    - Text("z") attached to side z
    - Formula("x² + y² = z²") placed near triangle
```

This is the level of abstraction the user (or a teacher-AI) operates at.

### 2. Layout engine

Decides approximate sizes, placements, and spatial relationships. Two viable approaches:

**Rule-based:** Hard-coded heuristics. "Right triangles default to canonical orientation, 60% of canvas." "Side labels are at midpoints with small perpendicular offset." Predictable, easy to debug, limited flexibility. Works well for mathematical figures.

**Model-based:** Train or prompt a vision-language model with the semantic scene description; it generates a layout plan as JSON:

```json
{
  "triangle": { "scale": 0.65, "position": "center_left" },
  "label_x": { "attach_to": "side_x", "offset": "small" },
  "formula": { "position": "right_of_triangle", "align": "top", "margin": 40 }
}
```

More flexible, more human-like results, but less predictable. Best with few-shot prompting against examples of teacher-drawn diagrams.

In practice, a hybrid (rule-based core with a model-based override for novel cases) works better than either alone.

### 3. Rendering engine

Once the layout engine outputs approximate geometry, convert to actual primitives: vector strokes, SVG paths, smooth Bezier curves. Mechanical step, but if the final output is meant to feel hand-drawn (as a teacher would), this stage needs to incorporate slight imperfection — rough.js for SVG, jittered control points, hand-style strokes. The same library Excalidraw uses for its signature look. See [Excalidraw as a Drawing Engine](/wiki/Excalidraw-as-a-Drawing-Engine/).

### 4. Motion planner (if hardware involved)

For a robotic arm or plotter:

- Stroke ordering (don't lift the pen unnecessarily)
- Pen-up vs pen-down sequences
- Kinematic feasibility checks
- Speed and acceleration profiles

This is well-trodden robotics territory (ROS, MoveIt). The hard part above this stage is layout, not motion.

## Why this matches what teachers do

The pipeline maps neatly onto a teacher's cognitive sequence:

| Teacher's thought | Pipeline stage |
| --- | --- |
| "I need a right triangle." | Semantic description |
| "Let me draw it reasonably large." | Layout engine (scale) |
| "Label hypotenuse z." | Attachment constraint |
| "Write the formula nearby." | Spatial reasoner |
| "Now I'll draw it." | Rendering engine |
| "Move my hand." | Motion planner |

The reason teachers can do this effortlessly while computers struggle is that humans absorb layout conventions through years of exposure — both as students and through their own practice. Computers either need explicit rules or a lot of training data.

## Useful adjacent tools

- **rough.js** — JavaScript library for hand-drawn-style rendering. Tiny and easy to integrate.
- **JSXGraph** — Web framework for interactive mathematics. Already understands geometric primitives.
- **TikZ / LaTeX** — Solved this problem for typeset mathematical figures decades ago. Worth studying its layout conventions.
- **Peggy / pest** — Parser generators for building DSLs cleanly.

## The bigger pattern

This problem — high-level semantic intent → low-level spatial layout — is not specific to math diagrams. It's the same pattern as:

- Auto-laying-out flowcharts
- Generating slides from outlines
- Driving a robotic art system from natural-language prompts
- Building a generic "describe what you want drawn" tool

Once you have the four-stage pipeline cleanly separated, the same architecture transfers across domains with different vocabularies and rule sets.

## See also

- [Excalidraw as a Drawing Engine](/wiki/Excalidraw-as-a-Drawing-Engine/)
- [Spatial Intelligence as Next Arbitrage](/wiki/Spatial-Intelligence-as-Next-Arbitrage/)
