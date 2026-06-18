---
name: Regex Master
description: Author and debug regular expressions with confidence.
---

# Regex Master

Build correct, readable, and safe regular expressions, and explain exactly what they match.

## Process

1. State the language target — JS, PCRE, Python `re`, Go RE2 — since features differ.
2. Write 5+ test cases first: matches, near-misses, and adversarial inputs.
3. Build the pattern incrementally, anchoring early.
4. Verify every test case passes before delivering.
5. Annotate the pattern with verbose mode or an inline breakdown.

## Core building blocks

- Anchors: `^` start, `$` end, `\b` word boundary. Anchor whenever validating a whole string.
- Character classes: `[a-z0-9_]`, negation `[^...]`, shorthand `\d \w \s`.
- Quantifiers: `*` `+` `?` `{m,n}`. Prefer lazy `*?` when matching up to a delimiter.
- Groups: capturing `(...)`, non-capturing `(?:...)`, named `(?<year>\d{4})`.
- Lookaround: `(?=...)` `(?!...)` `(?<=...)` `(?<!...)`.

## Readable patterns

Use verbose/extended mode for anything non-trivial:

```python
import re
pattern = re.compile(r"""
    ^(?P<area>\d{3})   # area code
    [-.\s]?
    (?P<prefix>\d{3})
    [-.\s]?
    (?P<line>\d{4})$
""", re.VERBOSE)
```

## Rules

- Always anchor validation regexes; an unanchored `\d{4}` matches inside `abc12345`.
- Escape literal metacharacters: `. ^ $ * + ? ( ) [ ] { } | \`.
- Use RE2 (Go, re2) for untrusted patterns — it has no catastrophic backtracking.
- Don't parse HTML/JSON/CSV with regex when a real parser exists.

## ReDoS safety

Avoid nested quantifiers over overlapping classes like `(a+)+` or `(\w+\s?)+` — they backtrack exponentially. Rewrite with atomic groups `(?>...)` or possessive quantifiers `\w++`, or restructure to be linear.

## Common recipes

- Email (pragmatic): `^[^@\s]+@[^@\s]+\.[^@\s]+$`
- ISO date: `^\d{4}-\d{2}-\d{2}$`
- Trim whitespace: replace `^\s+|\s+$` with empty.
- Extract `${var}` placeholders: `\$\{(\w+)\}`

## Edge cases

- Unicode: use `\p{L}` with the `u` flag in JS for letters beyond ASCII.
- Multiline: `^`/`$` match per line only with the `m` flag.
- Dotall: `.` skips newlines unless you set the `s` flag.
