<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Stack

| Pkg           | Ver                | Note                                                                                                                                                                 |
| ------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js       | ^16.2              | `reactCompiler: true`, `typedRoutes: true`                                                                                                                           |
| React         | ^19.2              |                                                                                                                                                                      |
| TypeScript    | ^5.9               | strict, ESNext module, bundler resolution                                                                                                                            |
| Prisma        | ^7.9               | Uses `prisma-client` generator (not `prisma-client-js`). Output: `generated/prisma`. Driver adapter: `@prisma/adapter-libsql` for SQLite. Config: `prisma.config.ts` |
| shadcn/ui     | base-vega style    | Components in `src/components/shadcnui/`. Aliased as `@/components/shadcnui`                                                                                         |
| Base UI React | ^1.6               | Primitive provider for shadcn components (e.g., `@base-ui/react/button`)                                                                                             |
| Tailwind CSS  | ^4.3               | `@tailwindcss/postcss` plugin, `tw-animate-css`, `shadcn/tailwind.css`                                                                                               |
| Zod           | ^4.4               | Schema validation                                                                                                                                                    |
| env           | @t3-oss/env-nextjs | Server-only: `src/lib/env/serverEnv.ts` (clientEnv.ts was removed — do not recreate)                                                                                 |

Path aliases: `@/*` → `./src/*`, `@generated/*` → `./generated/*`.

## Agent behavior

- **Ask questions** when ambiguous or before destructive actions. Prefer one batched question.
- **Update this file** when you discover non-obvious gotchas, fixes, or conventions.
- **Use skills + MCPs** before writing code matching `prisma-*`, `next-*`, `better-auth-*`, `zod`, etc. Use `shadcn` MCP for component add/search/audit. Use `better-auth` MCP for auth docs.

## Verification

- **Primary**: `bun lint` — runs `next typegen && tsc --noEmit && eslint`
- **Build gate**: `bun run build` — `prisma generate && next build`
- **Full prod**: `bun prod` — `prisma generate && next build && next start` (before schema/env changes)

## Project structure

```
src/
  app/              # App Router (layout.tsx, page.tsx, globals.css)
    api/            # Route handlers — ALL data access lives here (no server actions)
  components/
    Layout/         # Header, ThemeToggleButton
    Providers/      # ThemeProvider (next-themes)
    shadcnui/       # shadcn primitives (button.tsx, toast.tsx)
  hooks/            # Custom hooks (useImageUpload)
  lib/
    api.ts          # apiFetch<T>() helper for client → API calls
    auth/           # Better Auth: index, auth-client, permissions, session
    dbClient/       # Prisma singleton with libSQL adapter
    env/            # serverEnv.ts (t3-env)
    fonts.ts        # next/font (Geist, Inter)
    types.ts        # LayoutProps
    utils.ts        # cn() helper (clsx + tailwind-merge)
generated/prisma/   # Prisma client output (gitignored)
public/uploads/     # User uploads (all files ignored except .gitkeep)
```

## Gitignore pattern: uploads

`public/uploads/*` + `!public/uploads/.gitkeep` — ignores all uploaded files but keeps empty dir tracked via `.gitkeep`. Do not add `public/uploads/` itself to gitignore.

## Key restrictions

- **ESLint**: Locked at eslint@9.x until `eslint-plugin-react` ships v10 support. Do NOT bump.
- **TypeScript**: Currently ^5.9. TS 7.0 (Go-native compiler) blocked until typescript-eslint API stabilizes (~Oct 2026). Do not migrate.

## Auth (Better Auth) gotchas

- **Next 16**: no `middleware.ts` — use `src/proxy.ts` (`proxy` export). Cookie-only check there; full session check in route handlers via `getSession` from `src/lib/auth/session.ts` (`auth.api.getSession`).
- **No server actions, no server components with data access**: all pages under `src/app/` are client components; data flows through route handlers in `src/app/api/*` (401/403 semantics: `getSession()` → 401, role check `session.user.role !== "admin"` → 403). Clients call them via `apiFetch` from `src/lib/api.ts`.
- **Prisma 7**: import client from `@generated/prisma/client` (custom output), adapter `prismaAdapter(prisma, { provider: "sqlite" })` from `@better-auth/prisma-adapter`. Auth instance: `src/lib/auth/index.ts`, client: `src/lib/auth/auth-client.ts`, roles/AC: `src/lib/auth/permissions.ts`.
- Schema regeneration: `bun x auth@latest generate --adapter prisma --dialect sqlite -y` (overwrites `schema.prisma`; re-add custom models after). Migrations via `prisma migrate dev` (CLI migrate unsupported for Prisma).
- Roles: exactly 2 AC roles — `admin` and `user` — in `permissions.ts`. Public email/password signup enabled (`disableSignUp: false`), new users get default role `user` (admin plugin). Admins create users via `auth.api.createUser`. Seeded admin via `bun run db:seed` (needs `OWNER_EMAIL/PASSWORD/NAME` env).
- **No `username` field anywhere** — user model, zod schemas, forms, and UI use name + email only.
- Base UI `Select` `onValueChange` passes `string | null` — guard with `if (value)` before RHF `field.onChange`.

## Form patterns

Schemas in `src/lib/zodSchema.ts` — export both schema and `type X = z.infer<typeof xSchema>`.

Components use `"use client"`, `react-hook-form` + `@hookform/resolvers/zod`, and shadcn primitives:

```typescript
const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
  mode: "all",
});
```

Each field goes through `Controller`:

```typescript
<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Label</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="..." />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

Submit: `<form onSubmit={handleSubmit(handler)} noValidate>`. Button disabled while submitting with icon toggle.

## Git commits

Use PowerShell here-strings:

```powershell
git commit -m @"
<commit message here>
"@
```
