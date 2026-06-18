---
name: Document Template System
description: Create reusable document templates and style conventions for a team — structure, variables, naming, and maintenance protocols. Use when establishing shared documentation standards or building a repeatable library of business document formats.
---

# Document Template System

A template is not a filled-out document with blanks. It is a decision made once so the team does not have to make it again. The best template systems are lightweight, self-explanatory, and maintained by one person.

## Before building templates

Audit what documents the team actually produces. List the top 10 by frequency. Build templates only for the top 5. Attempting to template everything produces a system nobody uses.

For each candidate template, answer:
- Who authors this document, and how often?
- Who reads it, and what do they do with it?
- What varies between instances, and what should stay constant?

## Template anatomy

Every template should contain four elements:

1. Purpose block — a single paragraph (for the author's eyes) stating what the template is for, when to use it, and what it is not for. This block is deleted before sending the document.
2. Required sections — sections that must appear in every instance; label them 'REQUIRED'
3. Optional sections — sections relevant only in some cases; label them 'OPTIONAL — include if [condition]' and remove the label when used
4. Variables — clearly marked placeholders for instance-specific content, written as [VARIABLE NAME IN CAPS] so they are visually distinct and easy to find with text search

## Style conventions

Documentation style is a team-level decision, not a document-level decision. Establish once and enforce everywhere:
- Date format: YYYY-MM-DD for machine-readable contexts, 'June 17, 2026' for documents intended for executives or external parties
- Version numbering: v1.0 for first publish, v1.1 for minor updates, v2.0 for structural changes
- Owner field: every document has exactly one owner; ownership is a person, not a team
- Status values: use a fixed set (Draft / In Review / Approved / Archived) and apply them consistently

## Naming conventions

A file name should answer three questions without opening the file: what is it, who owns it, and how current is it.

Default format: [DocumentType]-[Subject]-[Owner]-[Date or Version]
Example: Report-Q2-Revenue-Ouellet-2026-06

Avoid descriptors like 'final', 'final-v2', or 'latest' in file names — they are lies waiting to happen.

## Template maintenance

Assign one maintainer per template library. Schedule a quarterly review. At each review: retire templates unused in the past year, update style conventions, and collect one piece of author feedback per active template. A system that cannot be maintained will be abandoned.
