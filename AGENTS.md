# AGENTS.md

## Rules

- Auth-derived access flags (such as team membership) must be derived during render from context state, never computed inside a `useEffect`. A render that reports "no team" before the profile lookup resolves redirects the user away from the page they actually opened.
- Pages read and write application data through `src/services/supabase.ts`, which resolves the current team from the signed-in user's profile. Pages must not hardcode a team id or write rows without one.
- Every table the app touches needs explicit `GRANT`s plus RLS policies; team-scoped reads go through `security definer` helper functions so policies never query the table they guard.
