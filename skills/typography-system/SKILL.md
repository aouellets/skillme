---
name: Typography System
description: Chooses and pairs typefaces and defines a type scale for a brand. Use when establishing typographic voice, building a design system type layer, or auditing inconsistent type usage.
---

# Typography System

Typography carries more of a brand's personality than any other design element because it is always present. A well-designed type system is invisible when it works and painful when it doesn't.

## Choose Roles Before Choosing Fonts

Define roles first: Display (hero headlines, campaign type), Heading (page titles, section headers), Body (long-form reading), UI (labels, captions, buttons), Mono (code, data). A brand typically needs two typefaces at most — one for Display/Heading, one for Body/UI. Adding a third is a tax on every future designer. A strong pairing is usually one serif and one sans-serif, or a distinctive display face with a neutral workhorse for body.

## Evaluate Typefaces on Functional Criteria

Beyond personality, a typeface must pass functional tests: sufficient weight range (at least Regular, Medium, Bold, and their italics), legibility at small sizes, language/glyph coverage for target markets, web and app licensing, and acceptable file size for web delivery. Variable fonts are preferred for web use — they reduce HTTP requests and allow fine-grained weight control.

## Build a Modular Type Scale

Use a modular scale based on a ratio. Common ratios: 1.25 (Major Third) for tight UI-heavy products, 1.333 (Perfect Fourth) for editorial products, 1.5 (Perfect Fifth) for display-heavy layouts. Start from a base of 16px (1rem). Name steps by role, not pixel size: 'body-sm', 'body-base', 'heading-md', 'display-lg'. Pixel sizes will change; role names stay stable.

## Specify Line Height and Measure

For every text style, define line height and maximum measure (line length). Body text: line height 1.5 to 1.6, measure 60 to 75 characters. Headings: line height 1.1 to 1.3. UI labels: line height 1.2 to 1.4. These are not aesthetic choices — they are readability standards backed by decades of research. Measure is the most commonly neglected spec; lines that are too long destroy reading comprehension.

## Document Do/Don't Pairs

For each type role, write one sentence on what it is for and one on what it is not for. Then document at least three anti-patterns to avoid: all-caps body text, centered body paragraphs, justified text without hyphenation, mixing more than two weights in a single component. Anti-patterns turn abstract rules into concrete guidance.

## Specify Responsive Behavior

Define how the scale shifts across breakpoints. Display sizes often drop significantly on mobile (a 72px desktop hero might become 40px on mobile). Document the mobile value for every heading and display step. For body and UI, one scale typically works across breakpoints with minor adjustments.
