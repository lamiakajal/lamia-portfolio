# Latest changes

## From your own zip (kept as you made them)
- `nextjs-toploader` pink loading bar at the top while pages change (layout.tsx, package.json)
- `src/app/icon.svg` favicon (the old favicon.ico was removed)
- `src/app/loading.tsx` glowing loader shown while a page loads
- Default theme is LIGHT in your layout.tsx (to make dark the default again: set `data-theme="dark"`
  on the <html> tag and change the two "light" words in `themeInitScript` to "dark")

## New in this version
1. `public/resume.pdf`: new one-page, ATS-friendly resume (your old resume.pdf and README-resume.txt were removed).
   Edit `docs/resume/build_resume.py` (phone, new project ...) and run `python docs/resume/build_resume.py`.
2. Logout fixed: `src/app/api/logout/route.ts` ends the session on the server and deletes the httpOnly cookies
   (browser JavaScript cannot delete those, so the earlier client-side cookie code could not log you out).
3. Login page: original GitHub and Google logos, and only the configured login methods are shown.
4. "Admins only" page explains why (email not in ADMIN_EMAILS / not verified) and has a Sign out button.
5. Toast notifications (`src/components/ui/ToastProvider.tsx`): login, logout, publish, upload, delete,
   copy link, contact form.
6. `trustedOrigins` in `src/lib/auth.ts` (needed for login/logout on https://lamiakajal.com).

## Round 3 (this version)
- Top loading bar removed. Light mode stays the default.
- Phones: the pink glow stays hidden until you touch or scroll (then it appears and fades), like the mouse effect on desktop.
- Speed: no blur filters in scroll animations, smaller blur radius on big glows, Hero/About photos resized by Next.js (quality 90),
  heavy blur removed from the footer, project screenshots use small versions on cards.
- Polish pack: custom 404 (`not-found.tsx`), error page (`error.tsx`), `robots.ts`, `sitemap.ts` (home, projects, blog posts),
  share-preview picture (`opengraph-image.tsx`), Google "Person" data (JSON-LD), skip-to-content link, theme colour.
- Blog phase 2: 5 reactions, save/bookmark (`/saved`), comments (author or admin can delete), "Message me" box under every post,
  admin inbox (`/admin/inbox`, unread badge in the menu). The contact form also saves its messages in the inbox.
  New database collections (created automatically): reactions, saves, comments, messages.
