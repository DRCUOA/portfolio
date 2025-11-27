# PROJECT Globals: Frequently Used Prompts
## Version 1.1

---

## Purpose

This document contains prompt suggestions for the frequent development tasks against a portfolio of coding projects currently active.  The intent is encourage small, repeating steps that are simple in concept generically but may or may not cover significant depth or breath in terms of the contemporanuos data and code involved.  An example would be, a prompt to guide setting up a new feature branch on an existing project. The prompts are tailored for LLM agents and or models, and specicifity is important to reduce variablity in the responses from the same or different models when the prompt is reused.  It is hope this will lend itself to acceralate delivery times and simultansley increased quality, repeatability and usability across the portfolio.

All prompts in this document are to be captured in the following format and structure:

```
## When [ INSERT SHORT DESCRIPTION OF THE TASK FOR HUMAN TO RECOGNISE NEED TO USE], use:

**Prompt:**

``` 

Respecting all @documentation/myprojectglobals/guardrails*
Using the current staged commits and explicit diffs against the remote branch (or main if this branch is unpublished), increment the package.json version and update:

  1. changelog.md and
  2. reasonlog.md. 

If changelog.md and/or reasonlog.md are not found in the project root, create them using the following example versions (REPLACE ANY SAMPLE DATA IN THE TEMPLATES WITH REAL PROJECT DATA):

  - @documentation/myprojectglobals/_child_templates/change/_child_templates_changlog_example.md
  - @documentation/myprojectglobals/_child_templates/decisions/_child_templates_changlog_example.md

Place both files in the project root.

Follow the purpose statements in those docs exactly.

Keep updates strictly limited to what the diffs justify. Do not invent changes or expand scope.

In this UI, provide:
1. A basic commit message (≤100 words).
2. A basic PR draft (≤100 words).

Be specific and brief. Do not hallucinate. Do not add content beyond what is required to meet these tasks.

```
