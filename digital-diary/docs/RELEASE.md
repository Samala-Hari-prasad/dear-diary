# Release Checklist

## Quality

- [ ] `npm install`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] No TypeScript errors

## Manual Testing

- [ ] OAuth login & logout
- [ ] CRUD operations (Create, Edit)
- [ ] Autosave triggers correctly
- [ ] Search functions correctly
- [ ] Image upload works and renders
- [ ] Delete / Restore flows
- [ ] Mobile layout is responsive
- [ ] Dark mode persists

## Repository

- [ ] `index.json` is perfectly synchronized
- [ ] No orphaned images in `content/images/`
- [ ] No duplicate slugs in `content/pages/`

## Documentation

- [ ] `CHANGELOG.md` updated
- [ ] `docs/ROADMAP.md` reviewed
- [ ] `docs/ADR/` updated (if architecture changed)

## Deployment

- [ ] Environment variables verified locally
- [ ] Deploy to Vercel
- [ ] Smoke test production URL

## Release

- [ ] Create Git tag (`git tag vX.Y.Z`)
- [ ] Publish release notes to GitHub
