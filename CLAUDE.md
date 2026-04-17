# restaurant-app — CLAUDE.md

> This file is read by Claude Code at the start of every session.
> Keep it updated. Every correction → a CLAUDE.md update.

## Tech Stack
ReactJS, TypeScript, NestJS, Postgres, Tailwind

## Architecture
App structure will be monolythic architecture. And structure will be like for React frontend code, there will be src folder.
In that, components in components, pages in pages, common functions in utils/helper

## File Structure
```
src/components -> shared UI
src/pages -> pages
src/utils/helper.ts -> common functions
src/constants.ts -> constants
```

## Do NOT
- Never use console.log in production
- Never commit .env files

---
*Generated with the Claude Code Workshop CLAUDE.md Builder*