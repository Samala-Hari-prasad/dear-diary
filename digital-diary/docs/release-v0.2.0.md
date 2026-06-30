# Release v0.2.0

## Goal

Connect the application to the user's private GitHub repository using a Personal Access Token (PAT).

## Scope

- **Environment Configuration**: Set up validation for required environment variables (e.g., GitHub PAT, Repository Owner, Repository Name).
- **Octokit Client**: Implement a server-side Octokit client helper.
- **Repository Health Check**: Validate that the repository exists, is accessible, and contains a default branch.
- **Manifest Reader**: Attempt to read a `manifest.json` if it exists in the repository.
- **Connection Status UI**: Display repository connection details and status dynamically in the UI.

## Definition of Done

- [ ] Repository connection status UI displays dynamically.
- [ ] Health check for GitHub repository credentials succeeds.
- [ ] Environment variables validation is active and robust.
- [ ] `manifest.json` is read/logged correctly if present.
- [ ] No authentication page or login UI is introduced yet (system reads credentials from env/config).
- [ ] No markdown editor or diary writing features are implemented yet.
- [ ] Linter checks pass (`npm run lint`).
- [ ] Build compiles successfully without errors (`npm run build`).
