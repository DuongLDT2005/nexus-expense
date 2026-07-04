---
name: Stitch UI Redesign
description: Trigger this skill when the user asks to redesign or sync a codebase screen on the shared Stitch project (ID 3176465779063770102).
---

# Stitch UI Redesign & Premium Sync Guide

Use this skill to sync, redesign, and update React Native codebase screens using the shared **Stitch UI Project** (ID: `3176465779063770102`).

## Step-by-Step Workflow

### Step 1: Scan the Source Code
- Read the React Native screen files in `zero` (the sibling directory `../zero`) and `nexus-expense/src/screens/<ScreenName>/` to understand:
  - Form inputs, validation, and interaction states.
  - Buttons, action menus, lists, charts, and header elements.
  - Layout hierarchies and user flows.

### Step 2: Formulate the Design Prompt
Construct a detailed prompt for Stitch that describes:
- **Layout & Structure:** Detail the headers, forms, list cards, etc., matching the codebase items.
- **Premium Aesthetics:** Mention the project's signature style:
  - Slate Dark Mode theme (`#0b1326` background).
  - Outfit (for headlines) and Inter (for body and data labels) typography.
  - Glassmorphic panels (`backdrop-filter: blur`, semi-transparent borders `border-white/10`).
  - Pill-shaped roundedness (`rounded-xl` / `rounded-full` buttons).

### Step 3: Trigger the Stitch MCP Generator
Call the `StitchMCP` tool `generate_screen_from_text` with the following parameters:
- **`projectId`:** `"3176465779063770102"`
- **`prompt`:** Your constructed premium layout prompt.
- **`deviceType`:** `"MOBILE"`

### Step 4: Redesign Local React Native Code
Once the design is updated on Stitch:
- Align the local screens in `nexus-expense/src/screens/` with the visual design.
- Apply high-fidelity Tailwind utility classes following `docs/LAYOUT_PATTERNS.md` to match the exact look.
