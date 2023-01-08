declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		typeof entryMap[C][keyof typeof entryMap[C]] & Render;

	type BaseCollectionConfig<S extends import('astro/zod').ZodRawShape> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<import('astro/zod').ZodObject<S>>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends import('astro/zod').ZodRawShape>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	export function getEntry<C extends keyof typeof entryMap, E extends keyof typeof entryMap[C]>(
		collection: C,
		entryKey: E
	): Promise<typeof entryMap[C][E] & Render>;
	export function getCollection<
		C extends keyof typeof entryMap,
		E extends keyof typeof entryMap[C]
	>(
		collection: C,
		filter?: (data: typeof entryMap[C][E]) => boolean
	): Promise<(typeof entryMap[C][E] & Render)[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		import('astro/zod').ZodObject<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			injectedFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"blog": {
"contributing-to-oss.md": {
  id: "contributing-to-oss.md",
  slug: "contributing-to-oss",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"next-hydration-error.md": {
  id: "next-hydration-error.md",
  slug: "next-hydration-error",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"react-query-patterns.md": {
  id: "react-query-patterns.md",
  slug: "react-query-patterns",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
},
"blog-draft": {
"treat-next-like-express.md": {
  id: "treat-next-like-express.md",
  slug: "treat-next-like-express",
  body: string,
  collection: "blog-draft",
  data: any
},
},
"projects": {
"Anket.md": {
  id: "Anket.md",
  slug: "Anket",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"CreateT3App.md": {
  id: "CreateT3App.md",
  slug: "CreateT3App",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"UI.md": {
  id: "UI.md",
  slug: "UI",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"Vocab.md": {
  id: "Vocab.md",
  slug: "Vocab",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
},

	};

	type ContentConfig = typeof import("./config");
}
