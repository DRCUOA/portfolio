
## Reason Log Template

## Purpose

This document records the intent and reasoning behind each change made to this project. It provides context for why decisions were made, what problems were solved, and what goals were achieved. Each entry includes the version considered, the change made, the intent behind it, and the detailed reasoning. This log serves as a decision audit trail, helping developers understand not just what changed, but why it changed and what was considered at the time.

The document content is captured in two different formats, one optimized for human consumption and the other for LLM consumption. This refers to structure and format only; it is very important to maintain the same content in both formats.

**Usage Note:** When this template is referenced as a dependency (e.g., `@reasonlog.md`), use the structure and format shown in the examples below. Replace example data with actual project reasoning, ensuring both the tabular (human-readable) and JSON (LLM-readable) formats contain identical information.

**Legend:**
- **Intent** = The goal or objective behind the change
- **Reasoning** = Detailed explanation of why this approach was chosen
- **Problems Solved** = Specific issues addressed by this change
- **Goals Achieved** = Outcomes or benefits realized

**Quick Navigation:**
- **[LLM Version](#llm-version)** - Structured JSON data optimized for agent/LLM ingestion
- **[Human Reader Focused Version](#version-history)** - Tabular format optimized for human scanning

## Version History

**Human Reader Format, tabular for optimized human scanning**

***Example Data:***

| Version | Date | Component | Intent | Reasoning | Problems Solved | Goals Achieved |
|---------|------|-----------|--------|-----------|-----------------|----------------|
| 3.2.1 | 11/11/25 | structure | Improve documentation organization and discoverability | Reorganized documentation to follow a clearer hierarchical structure. Moving DEVELOPMENT.md and guardrails to a dedicated documentation/ directory makes it easier for new developers to find setup and development guidelines. This separation also aligns with common project structure conventions. | Scattered documentation files made onboarding difficult; no clear location for development guidelines | Centralized documentation location; improved developer onboarding experience |
| 3.2.1 | 11/11/25 | setup-guide | Standardize project setup process across portfolio | Created a comprehensive setup guide template to ensure consistency across all projects in the portfolio. This reduces variability in setup procedures and provides a clear reference for LLM agents when setting up new project instances. The guide follows established patterns and can be referenced via @PROJECT_SETUP_GUIDE.md in prompts. | Inconsistent setup procedures across projects; lack of standardized templates for LLM agents | Consistent setup process; reusable template for portfolio projects |

---

## LLM Version

**Optimized for agent/LLM ingestion - structured data format**

***Example Data:***
```json
{
  "project": "this-project",
  "versioning": "semantic",
  "format": "reasonlog",
  "versions": [
    {
      "version": "3.2.1",
      "date": "11/11/25",
      "reasons": [
        {
          "component": "structure",
          "intent": "Improve documentation organization and discoverability",
          "reasoning": "Reorganized documentation to follow a clearer hierarchical structure. Moving DEVELOPMENT.md and guardrails to a dedicated documentation/ directory makes it easier for new developers to find setup and development guidelines. This separation also aligns with common project structure conventions.",
          "problemsSolved": [
            "Scattered documentation files made onboarding difficult",
            "No clear location for development guidelines"
          ],
          "goalsAchieved": [
            "Centralized documentation location",
            "Improved developer onboarding experience"
          ],
          "files": ["documentation/DEVELOPMENT.md", "documentation/setup-prompt-guides/"],
          "alternativesConsidered": [],
          "dependencies": []
        },
        {
          "component": "setup-guide",
          "intent": "Standardize project setup process across portfolio",
          "reasoning": "Created a comprehensive setup guide template to ensure consistency across all projects in the portfolio. This reduces variability in setup procedures and provides a clear reference for LLM agents when setting up new project instances. The guide follows established patterns and can be referenced via @PROJECT_SETUP_GUIDE.md in prompts.",
          "problemsSolved": [
            "Inconsistent setup procedures across projects",
            "Lack of standardized templates for LLM agents"
          ],
          "goalsAchieved": [
            "Consistent setup process",
            "Reusable template for portfolio projects"
          ],
          "files": ["documentation/setup-prompt-guides/PROJECT_SETUP_GUIDE-v1-ROUTINE-BUILDER.md"],
          "alternativesConsidered": [],
          "dependencies": []
        }
      ]
    }
  ]
}
```
**Key metadata for LLM processing:**
- Version number (semantic versioning)
- Component/category affected
- Intent behind the change
- Detailed reasoning explanation
- Problems solved by this change
- Goals achieved
- Files modified
- Alternatives considered (if any)
- Dependencies impacted

---
