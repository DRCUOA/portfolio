
## Change Log Template

## Purpose

This document tracks all notable changes to this project, providing a chronological record of features, fixes, and improvements. It serves as a reference for developers to understand what changed, when, and why. The changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (MAJOR.MINOR.PATCH).

The document content is captured in two different formats, one optimized for human consumption and the other for LLM consumption. This refers to structure and format only; it is very important to maintain the same content in both formats.

**Usage Note:** When this template is referenced as a dependency (e.g., `@changelog.md`), use the structure and format shown in the examples below. Replace example data with actual project changes, ensuring both the tabular (human-readable) and JSON (LLM-readable) formats contain identical information.

**Legend:**
- **Added** = New features
- **Changed** = Modifications to existing functionality
- **Fixed** = Bug fixes
- **Technical Details** = Implementation notes and architecture decisions

**Quick Navigation:**
- **[LLM Version](#llm-version)** - Structured JSON data optimized for agent/LLM ingestion
- **[Human Reader Focused Version](#version-history)** - Tabular format optimized for human scanning

## Version History

**Human Reader Format, tabular for optimized human scanning**

***Example Data:***

| Version | Date | Type | Component | Description |
|---------|------|------|------------|-------------|
| 3.2.1 | 11/11/25 | Changed | structure | Reorganized documentation structure: moved DEVELOPMENT.md and guardrails to documentation/ directory |
| 3.2.1 | 11/11/25 | Added | setup-guide | Added PROJECT_SETUP_GUIDE-v1-ROUTINE-BUILDER.md setup guide |

**Stack:**
- **Backend:** Node.js, Express, SQLite (better-sqlite3)
- **Frontend:** Vue 3, Vite, Pinia, Vue Router

**Compliance:**
- **ENV_SETUP_GUIDE:** verified
- **PROJECT_SETUP_GUIDE:** 100% compliant (v1.1.1+)
---

## LLM Version

**Optimized for agent/LLM ingestion - structured data format**

***Example Data:***
```json
{
  "project": "this-project",
  "versioning": "semantic",
  "format": "keepachangelog",
  "versions": [
    {
      "version": "3.2.1",
      "date": "11/11/25",
      "changes": [
        {
          "type": "changed",
          "category": "documentation",
          "component": "structure",
          "description": "Reorganized documentation structure: moved DEVELOPMENT.md and guardrails to documentation/ directory",
          "files": ["documentation/DEVELOPMENT.md", "documentation/setup-prompt-guides/"],
          "dependencies": []
        },
        {
          "type": "added",
          "category": "documentation",
          "component": "setup-guide",
          "description": "Added PROJECT_SETUP_GUIDE-v1-ROUTINE-BUILDER.md setup guide",
          "files": ["documentation/setup-prompt-guides/PROJECT_SETUP_GUIDE-v1-ROUTINE-BUILDER.md"],
          "dependencies": []
        }
      ]
    }
  ],
  "stack": {
    "backend": ["Node.js", "Express", "SQLite (better-sqlite3)"],
    "frontend": ["Vue 3", "Vite", "Pinia", "Vue Router"]
  },
  "compliance": {
    "ENV_SETUP_GUIDE": "verified",
    "PROJECT_SETUP_GUIDE": "100% compliant (v1.1.1+)"
  }
}
```
**Key metadata for LLM processing:**
- Version number (semantic versioning)
- Change type (added/changed/fixed/technical)
- Component/category affected
- Files modified
- Dependencies impacted
- Compliance status

---
