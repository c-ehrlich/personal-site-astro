# Astro v2 → v5 Migration Plan

## Overview

Migrating from Astro v2.10.7 to v5.x. This requires going through three major version upgrades (v2→v3→v4→v5), each with breaking changes.

## Current State

- Astro: ^2.10.7
- Uses `@astrojs/image` (deprecated, removed in v3)
- Uses `experimental.viewTransitions` (stable in v3)
- Uses content collections (API changes in v5)

---

## Phase 1: v2 → v3 Changes

### 1.1 Remove `@astrojs/image` → Use `astro:assets`

**Files to update:**

- [ ] `astro.config.mjs` - Remove image integration import and config
- [ ] `src/layouts/Layout.astro` - Change import from `@astrojs/image/components` to `astro:assets`
- [ ] `src/pages/projects.astro` - Change import, handle remote images differently
- [ ] `tsconfig.json` - Remove `@astrojs/image/client` from types
- [ ] `package.json` - Remove `@astrojs/image` and `@types/sharp` dependencies

**Image component changes:**
```diff
- import { Image } from "@astrojs/image/components";
+ import { Image } from "astro:assets";
```

**Props removed:**
- `quality` - No longer a direct prop (use format options or sharp config)
- `aspectRatio` - Now auto-inferred from width/height

**Local images:**
```diff
- import avatar from "../media/avatar.jpg";
- <Image src={avatar} width={200} height={200} quality={70} />
+ import avatar from "../media/avatar.jpg";
+ <Image src={avatar} width={200} height={200} />
```

**Remote/public images (projects.astro):**
Remote images need width/height specified. Public folder images can use string paths but need dimensions.

### 1.2 Remove `experimental.viewTransitions`

**File:** `astro.config.mjs`

```diff
  export default defineConfig({
-   experimental: {
-     viewTransitions: true,
-   },
    integrations: [...]
  });
```

View transitions are now stable and enabled by default when you import `ViewTransitions`.

### 1.3 Update tsconfig.json types

**File:** `tsconfig.json`

```diff
  {
    "extends": "astro/tsconfigs/strictest",
    "compilerOptions": {
      "jsx": "preserve",
-     "jsxImportSource": "solid-js",
-     "types": ["@astrojs/image/client"]
+     "jsxImportSource": "solid-js"
    }
  }
```

### 1.4 Node.js requirement

v3 requires Node 18.14.1+. Verify your environment.

---

## Phase 2: v3 → v4 Changes

### 2.1 Vite 4 → Vite 5

Automatic with dependency update. No code changes expected for this project.

### 2.2 unified v10 → v11

Affects remark/rehype plugins. This project uses default Shiki config only - should be fine.

### 2.3 Removed features (verify not used)

- [ ] `Astro.request.params` → use `Astro.params`
- [ ] `markdown.drafts` config option
- [ ] Lowercase HTTP method names in endpoints

---

## Phase 3: v3 → v5 Changes

**Status: TODO**

### 3.1 Update package.json dependencies

```diff
  "dependencies": {
-   "@astrojs/mdx": "^1.0.0",
-   "@astrojs/solid-js": "^3.0.0",
+   "@astrojs/mdx": "^4.3.12",
+   "@astrojs/solid-js": "^5.1.3",
-   "lucide-astro": "^0.292.0",
+   "@lucide/astro": "^0.460.0",
    "reading-time": "^1.5.0",
-   "solid-js": "^1.9.0",
+   "solid-js": "^1.9.0",
    "solid-motionone": "^1.0.4"
  },
  "devDependencies": {
-   "@astrojs/check": "^0.9.6",
+   "@astrojs/check": "^0.9.6",
-   "@astrojs/rss": "^3.0.0",
+   "@astrojs/rss": "^4.0.14",
-   "@astrojs/tailwind": "^5.0.0",
+   "@astrojs/tailwind": "^5.1.5",
-   "astro": "^3.0.0",
+   "astro": "^5.0.0",
    ...
  }
```

**Note:** `@astrojs/tailwind` is deprecated but still works with Tailwind 3. Keep it for now; migrate to Tailwind 4 Vite plugin separately.

### 3.2 Update tsconfig.json

**File:** `tsconfig.json`

```diff
  {
    "extends": "astro/tsconfigs/strictest",
+   "include": [".astro/types.d.ts", "src/**/*"],
+   "exclude": ["dist"],
    "compilerOptions": {
      "jsx": "preserve",
      "jsxImportSource": "solid-js"
    }
  }
```

### 3.3 Rename `ViewTransitions` → `ClientRouter`

**File:** `src/components/BaseHead.astro`

```diff
- import { ViewTransitions } from "astro:transitions";
+ import { ClientRouter } from "astro:transitions";

  ...

- <ViewTransitions />
+ <ClientRouter />
```

### 3.4 Migrate lucide-astro → @lucide/astro

**All files using lucide icons:**

```diff
- import { IconName } from "lucide-astro";
+ import { IconName } from "@lucide/astro";
```

### 3.5 Content Collections (verify after upgrade)

v5 changes how content collections work. The current `config.ts` should mostly work via backwards compatibility, but verify after upgrade.

Key changes:
- `astro:content` cannot be used on client
- Collections should be defined in `src/content.config.ts` (backwards compat exists for `src/content/config.ts`)

### 3.6 `src/env.d.ts` 

v5 uses `.astro/types.d.ts` instead. Current format is already compatible:
```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

---

## Phase 4: Tailwind 4 Migration (SEPARATE)

**Status: TODO - Do after v5 migration is stable**

`@astrojs/tailwind` is deprecated. Tailwind 4 has a native Vite plugin.

### 4.1 Remove @astrojs/tailwind integration

**File:** `astro.config.mjs`
```diff
- import tailwind from "@astrojs/tailwind";

  export default defineConfig({
    integrations: [
-     tailwind(),
      mdx(),
      solidJs(),
    ],
  });
```

### 4.2 Update dependencies

```diff
- "@astrojs/tailwind": "^5.1.5",
- "tailwindcss": "^3.2.4",
+ "tailwindcss": "^4.0.0",
+ "@tailwindcss/vite": "^4.0.0",
```

### 4.3 Add Tailwind Vite plugin

**File:** `astro.config.mjs`
```diff
+ import tailwindcss from "@tailwindcss/vite";

  export default defineConfig({
+   vite: {
+     plugins: [tailwindcss()],
+   },
    integrations: [mdx(), solidJs()],
  });
```

### 4.4 Update CSS imports

Tailwind 4 uses CSS-based config. Update main CSS file:
```diff
- @tailwind base;
- @tailwind components;
- @tailwind utilities;
+ @import "tailwindcss";
```

### 4.5 Migrate tailwind.config.cjs → CSS

Tailwind 4 config is done in CSS. Move customizations from `tailwind.config.cjs` to CSS `@theme` rules.

---

## Execution Order

### ✅ Checkpoint A: Upgrade to v3 (DONE)

1. ✅ Update dependencies to v3-compatible versions
2. ✅ Run `pnpm install`
3. ✅ Fix astro.config.mjs (remove image integration, remove experimental.viewTransitions)
4. ✅ Fix tsconfig.json (remove @astrojs/image/client type)
5. ✅ Fix Image imports in Layout.astro and projects.astro (use astro:assets)
6. ✅ Verify with `pnpm build` and `pnpm dev`

### ✅ Checkpoint B: Upgrade to v5 (DONE)

1. ✅ Update package.json dependencies
2. ✅ Run `pnpm install`
3. ✅ Update tsconfig.json (add include/exclude)
4. ✅ Rename ViewTransitions → ClientRouter in BaseHead.astro
5. ✅ Migrate lucide-astro → @lucide/astro
6. ✅ Fix content collection API changes (entry.slug → entry.id, entry.render() → render(entry))
7. ✅ Run `pnpm build` and fix any issues
8. ✅ Verify with `pnpm dev`

### Checkpoint C: Tailwind 4 Migration (TODO - SEPARATE)

1. [ ] Remove @astrojs/tailwind from astro.config.mjs
2. [ ] Update tailwindcss to v4, add @tailwindcss/vite
3. [ ] Add Tailwind Vite plugin to astro.config.mjs
4. [ ] Update CSS imports
5. [ ] Migrate tailwind.config.cjs to CSS @theme rules
6. [ ] Delete tailwind.config.cjs
7. [ ] Verify with `pnpm build` and `pnpm dev`

---

## Files to Modify (v5 Migration)

| File | Changes |
|------|---------|
| `package.json` | Update deps to v5-compatible versions |
| `tsconfig.json` | Add include/exclude |
| `src/components/BaseHead.astro` | Rename ViewTransitions → ClientRouter |
| All files with lucide imports | Change lucide-astro → @lucide/astro |

---

## Verification Steps

After v5 migration:

```bash
pnpm install
pnpm build
pnpm dev
```

Check:
- [ ] Homepage loads
- [ ] Blog pages render
- [ ] Projects page images display
- [ ] View transitions work
- [ ] Theme toggle works
- [ ] Icons display correctly
- [ ] No console errors
