---
name: field/guide
description: An annotated technical field guide for learning Linux and SQL by moving from mental model to runnable-looking example.
colors:
  ink: "#1b2432"
  ink-soft: "#4e5968"
  paper: "#f5f2eb"
  surface: "#fffdfa"
  line: "#dfddd6"
  sidebar: "#172231"
  sidebar-2: "#202d3d"
  coral: "#f06f54"
  coral-soft: "#fff0e9"
  lime: "#d9f276"
  lime-soft: "#f4f9d8"
  blue: "#6e8fff"
  blue-soft: "#edf1ff"
  violet: "#b7a0ff"
  violet-soft: "#f2efff"
typography:
  display:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "58px"
    fontWeight: 780
    lineHeight: 1.02
    letterSpacing: "-0.055em"
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.6
rounded:
  sm: "8px"
  md: "13px"
  lg: "16px"
spacing:
  xs: "6px"
  sm: "11px"
  md: "18px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "40px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "22px"
---

# Design System: field/guide

## Overview

**Creative North Star: “The Fold-out Field Guide.”**

field/guide treats technical learning like a well-made annotated manual: the left rail is the index, the active concept is a marked page, and every page pairs a mental model with a visible demonstration. The surface is modern and precise without looking like a generic developer dashboard.

The experience has two distinct but related modes. Linux uses coral as its current signal and draws filesystem paths as crisp geometry. SQL uses blue as its current signal and draws relations as linked table shapes. Both modes share a dark ink sidebar, a warm paper canvas, a small lime completion state, and code-only monospace.

## Colors

- **Ink Navy** (#1b2432): primary copy and diagram anchors.
- **Ink Soft** (#4e5968): readable supporting copy.
- **Warm Paper** (#f5f2eb): page canvas and the manual atmosphere.
- **Surface White** (#fffdfa): lesson surfaces.
- **Rule Gray** (#dfddd6): quiet structure and section separation.
- **Sidebar Navy** (#172231) and **Sidebar Slate** (#202d3d): persistent navigation.
- **Coral** (#f06f54): Linux selection, primary action, and active lesson signal.
- **Blue** (#6e8fff): SQL selection, relation diagram, and active lesson signal.
- **Lime** (#d9f276): completion, successful state, and the field-guide marker.
- **Violet** (#b7a0ff): advanced or deeper concept accent.

Signal colors stay sparse. They identify the current mode, a meaningful state, or a direct action; they do not fill every surface.

## Typography

The display and body voice is IBM Plex Sans with a system fallback: compact, technical, and warm enough for a beginner. Monospace is reserved for commands, SQL, terminal chrome, paths, and measured metadata. Hierarchy comes from weight, line length, and spacing rather than decorative font changes.

## Layout

The desktop shell uses a 276px sticky sidebar and a fluid reading workspace. The content column is capped at roughly 1320px. The first viewport is a two-part field guide: a clear learning thesis on the left and a code-native diagram on the right. The curriculum follows below as a two-column lesson surface: the active explanation and lab on the left, the path and pitfall on the right.

At 980px the sidebar becomes an off-canvas menu. At 680px the learning layout becomes one column, quick facts become a vertical sequence, and lesson controls stack. At 460px the search field collapses to its icon and the lab editor wraps without hiding the command.

## Surfaces and depth

Warm paper is the base. White lesson surfaces are separated by a one-pixel rule and one soft ambient shadow; shadows are reserved for panels and the toast. The dark lab window is a functional surface, not decoration. There are no gradients, glass effects, or hard-offset shadows.

## Shapes and controls

Panels use 13–16px radii. Buttons and compact controls use 8–9px radii. Pills are limited to small difficulty and metadata states. The Linux/SQL switcher is a stacked pair of explicit buttons with icon, title, description, and a visible active state. Lesson rows are real buttons and preserve the same order: number, icon, title, duration, level.

## Illustrations

Diagrams are authored inline as geometry and HTML: tree lines for Linux paths, table blocks plus an SVG relation line for SQL. They are explanatory objects, not stock illustrations. The result is always paired with a caption in plain language.

## Motion and states

Interaction uses restrained movement: the mobile sidebar slides in, primary controls lift one pixel, and the toast rises into view. Reduced motion removes the transitions. Focus rings use blue-tinted outlines and every action has a readable text or aria label. The lab exposes an input, an explicit Exécuter action, a result state, and a teaching caption.

## Do's and don'ts

### Do

- Keep the current Linux or SQL mode visible in the sidebar and breadcrumb.
- Show a concept, a diagram, and a practical result in the same reading flow.
- Use monospace only when the visitor is reading code, data, or measured metadata.
- Keep synthetic data clearly framed as a local demonstration.
- Use color with labels, icons, and structure so meaning is not color-only.

### Don't

- Turn the learning path into a grid of identical feature cards.
- Hide the important action inside a decorative terminal mockup.
- Use a glowing neon developer aesthetic or a generic dark dashboard.
- Add a second display face that competes with the field-guide voice.
- Use an accent as decoration when it does not explain state or interaction.
