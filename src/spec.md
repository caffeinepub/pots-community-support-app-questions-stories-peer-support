# Specification

## Summary
**Goal:** Build a POTS-focused community support app where users can sign in, create Questions/Stories, and support each other via comments and reactions, with basic discovery and safety features.

**Planned changes:**
- Add Internet Identity sign-in/sign-out and associate created content with the authenticated principal.
- Implement backend models and APIs for posts (Question/Story) with stable storage and reverse-chronological listing.
- Implement backend APIs for comments (single-level replies) and per-user reactions, gated to authenticated users.
- Build a home feed UI with type labeling, excerpts, author display, timestamps, reaction/comment counts, and loading/empty/error states (React Query).
- Build post creation UI for authenticated users (type, title, body, optional tags) with validation and navigation to the created post.
- Build post detail UI to view full content, load/add comments and replies, and toggle reactions with live count updates (React Query).
- Add feed filtering (All/Questions/Stories) and keyword search over title/body via backend-supported queries.
- Add Community Guidelines page and a report flow for posts/comments with backend storage (reason + reporter) and duplicate-report prevention.
- Apply a coherent accessible visual theme (avoiding blue/purple as primary) across navigation, cards, forms, and detail views.
- Add generated static branding/onboarding-style images under `frontend/public/assets/generated` and render them in the UI (hero + app mark).

**User-visible outcome:** Users can sign in with Internet Identity, browse and search/filter community Questions and Stories, create new posts, react and comment (with replies) when signed in, read Community Guidelines, and report problematic posts/comments, all within a cohesive themed interface with branded static imagery.
