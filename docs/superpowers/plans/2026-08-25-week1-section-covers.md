# Week 1 Section Covers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Add five independent chapter covers, keep Points 01–04 as Week 1 content, and reduce Point 05 negotiation to a Week 2 teaser.

**Architecture:** Preserve the existing single-file build pipeline. `slides.html` owns content, `deck.css` owns the visual system, `build.mjs` embeds the sources, and the static/browser QA scripts verify the output.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js, Playwright, fontTools.

---

### Task 1: Failing structure test

- [ ] Update `work/html-deck/validate-deck.mjs` to expect 32 slides/notes, five `archetype-chapter` slides, Week 1/Week 2 labels, and no removed negotiation lesson titles.
- [ ] Run the validator and confirm it fails against the current 30-slide output.

### Task 2: Chapter-cover visual system

- [ ] Add shared chapter-cover layout and progress-rail rules to `work/html-deck-redesign/deck.css`.
- [ ] Give Point 05 a visually distinct `WEEK 02 / NEXT` state.

### Task 3: Week 1 slide sequence

- [ ] Insert five chapter covers in `work/html-deck-redesign/slides.html`.
- [ ] Remove the three negotiation theory slides.
- [ ] Replace negotiation workshops with fact/story/next-move and father/mother role-switch drills.
- [ ] Change the rubric to four scored Week 1 rows plus a locked Week 2 row.
- [ ] Label the map and recap as Points 01–04 Week 1 and Point 05 Week 2.
- [ ] Renumber section IDs, folios, and speaker notes to 32.

### Task 4: Build metadata and font

- [ ] Update `work/html-deck-redesign/build.mjs` from 30 to 32.
- [ ] Regenerate `font-subset.woff2`, build the HTML, and make static QA pass.

### Task 5: Browser and print verification

- [ ] Update any hard-coded browser-QA totals to 32.
- [ ] Verify three viewports, 32-page print output, navigation, notes, overview, fullscreen, and zero external requests.
- [ ] Inspect screenshots of all five chapter covers and the revised exercise slides.

### Task 6: Delivery

- [ ] Deliver `outputs/5points_macro_strategy_lecture.html` and tell the user to refresh the open file.

## Review

- All spec requirements map to a task.
- No placeholders remain.
- All counts consistently target 32 slides and 32 notes.
- This workspace is not a Git repository, so commit steps are omitted.
