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
    server: { port: 5432 },
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

## Phase 3: v4 → v5 Changes

### 3.1 Rename `ViewTransitions` → `ClientRouter`

**File:** `src/components/BaseHead.astro`

```diff
- import { ViewTransitions } from "astro:transitions";
+ import { ClientRouter } from "astro:transitions";

  ...

- <ViewTransitions />
+ <ClientRouter />
```

### 3.2 Update tsconfig.json structure

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

### 3.3 Content Collections changes (if needed)

v5 changes how content collections work. The current `config.ts` should mostly work, but verify after upgrade.

Key changes:
- `astro:content` cannot be used on client
- Collection schema syntax may need updates for complex cases

### 3.4 `src/env.d.ts` changes

v5 uses `.astro/types.d.ts` instead. The current `env.d.ts` can be simplified or removed.

**Current:** `src/env.d.ts`
```typescript
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

This is already v5-compatible format.

---

## Dependency Updates

### package.json changes

```diff
  "dependencies": {
-   "@astrojs/image": "^0.13.0",
-   "@astrojs/mdx": "^0.17.2",
-   "@astrojs/solid-js": "^1.2.3",
+   "@astrojs/mdx": "^4.0.0",
+   "@astrojs/solid-js": "^5.0.0",
    "@motionone/solid": "^10.15.4",
    "lucide-astro": "^0.292.0",
    "reading-time": "^1.5.0",
    "solid-js": "^1.4.3"
  },
  "devDependencies": {
-   "@astrojs/rss": "^2.0.0",
-   "@astrojs/tailwind": "^3.0.0",
-   "@types/sharp": "^0.31.1",
+   "@astrojs/rss": "^4.0.0",
+   "@astrojs/tailwind": "^6.0.0",
    "@typescript-eslint/parser": "^5.47.1",
-   "astro": "^2.10.7",
+   "astro": "^5.0.0",
    "eslint": "^8.30.0",
    "eslint-plugin-astro": "^0.21.1",
    "eslint-plugin-jsx-a11y": "^6.6.1",
    "prettier": "^2.8.1",
    "prettier-plugin-astro": "^0.7.0",
    "prettier-plugin-tailwindcss": "^0.2.1",
-   "sharp": "^0.31.3",
    "tailwindcss": "^3.2.4"
  }
```

Note: `sharp` is now optional (Astro uses it automatically if installed, but it's not required).

---

## Execution Order

### Checkpoint A: Upgrade to v3

1. **Update dependencies** to v3-compatible versions
2. **Run `pnpm install`**
3. **Fix astro.config.mjs** (remove image integration, remove experimental.viewTransitions)
4. **Fix tsconfig.json** (remove @astrojs/image/client type)
5. **Fix Image imports** in Layout.astro and projects.astro (use astro:assets)
6. **Run `pnpm build` and `pnpm dev`** to verify

### Checkpoint B: Upgrade to v5

7. **Update dependencies** to v5-compatible versions
8. **Run `pnpm install`**
9. **Fix tsconfig.json** (add include/exclude)
10. **Rename ViewTransitions → ClientRouter** in BaseHead.astro
11. **Run `pnpm build` and `pnpm dev`** to verify

---

## Files to Modify (Summary)

| File | Changes |
|------|---------|
| `package.json` | Update deps, remove @astrojs/image, @types/sharp |
| `astro.config.mjs` | Remove image integration, remove experimental block |
| `tsconfig.json` | Remove types array, add include/exclude |
| `src/layouts/Layout.astro` | Change Image import, remove quality prop |
| `src/pages/projects.astro` | Change Image import, remove quality prop, handle remote images |
| `src/components/BaseHead.astro` | Rename ViewTransitions → ClientRouter |

---

## Potential Issues

1. **Remote images in projects.astro** - Currently using string paths from frontmatter. May need to configure `image.domains` or use `inferSize` prop.

2. **Sharp dependency** - Can keep or remove. If removed, Astro will warn but work with Squoosh fallback.

3. **lucide-astro** - Third-party package, verify compatibility with Astro v5.

4. **@motionone/solid** - Third-party, verify compatibility.

---

## Verification Steps

After migration:

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
- [ ] No console errors
