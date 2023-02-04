declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (data: CollectionEntry<C>) => boolean
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"blog": {
"advanced-trpc.md": {
  id: "advanced-trpc.md",
  slug: "advanced-trpc",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
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
"ryan-carniato-stream.md": {
  id: "ryan-carniato-stream.md",
  slug: "ryan-carniato-stream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"trpc-data-flows.md": {
  id: "trpc-data-flows.md",
  slug: "trpc-data-flows",
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
  slug: "anket",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"CreateT3App.md": {
  id: "CreateT3App.md",
  slug: "createt3app",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"UI.md": {
  id: "UI.md",
  slug: "ui",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
"Vocab.md": {
  id: "Vocab.md",
  slug: "vocab",
  body: string,
  collection: "projects",
  data: InferEntrySchema<"projects">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
