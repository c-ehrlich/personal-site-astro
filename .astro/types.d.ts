declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';

	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;
	export type CollectionEntry<C extends keyof AnyEntryMap> = Flatten<AnyEntryMap[C]>;

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

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

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog-draft": {
"rsc.md": {
	id: "rsc.md";
  slug: "rsc";
  body: string;
  collection: "blog-draft";
  data: any
} & { render(): Render[".md"] };
};
"bookNotes": {
"confessions-of-a-public-speaker.md": {
	id: "confessions-of-a-public-speaker.md";
  slug: "confessions-of-a-public-speaker";
  body: string;
  collection: "bookNotes";
  data: InferEntrySchema<"bookNotes">
} & { render(): Render[".md"] };
"how-to-write-and-deliver-talks.md": {
	id: "how-to-write-and-deliver-talks.md";
  slug: "how-to-write-and-deliver-talks";
  body: string;
  collection: "bookNotes";
  data: InferEntrySchema<"bookNotes">
} & { render(): Render[".md"] };
"thinking-in-bets.md": {
	id: "thinking-in-bets.md";
  slug: "thinking-in-bets";
  body: string;
  collection: "bookNotes";
  data: InferEntrySchema<"bookNotes">
} & { render(): Render[".md"] };
"人は聞き方が９割.md": {
	id: "人は聞き方が９割.md";
  slug: "人は聞き方が９割";
  body: string;
  collection: "bookNotes";
  data: InferEntrySchema<"bookNotes">
} & { render(): Render[".md"] };
};
"content": {
"2023-edge-react-vienna.md": {
	id: "2023-edge-react-vienna.md";
  slug: "2023-edge-react-vienna";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"2023-new-tools.md": {
	id: "2023-new-tools.md";
  slug: "2023-new-tools";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"2024-how-to-show-10m.md": {
	id: "2024-how-to-show-10m.md";
  slug: "2024-how-to-show-10m";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"2025-otel-frustrations.md": {
	id: "2025-otel-frustrations.md";
  slug: "2025-otel-frustrations";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"2025-support-your-feature.md": {
	id: "2025-support-your-feature.md";
  slug: "2025-support-your-feature";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"advanced-trpc.md": {
	id: "advanced-trpc.md";
  slug: "advanced-trpc";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"contributing-to-oss.md": {
	id: "contributing-to-oss.md";
  slug: "contributing-to-oss";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"jutanium-stream.md": {
	id: "jutanium-stream.md";
  slug: "jutanium-stream";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"next-hydration-error.md": {
	id: "next-hydration-error.md";
  slug: "next-hydration-error";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"next-is-an-spa.md": {
	id: "next-is-an-spa.md";
  slug: "next-is-an-spa";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"react-query-patterns.md": {
	id: "react-query-patterns.md";
  slug: "react-query-patterns";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"ryan-carniato-stream.md": {
	id: "ryan-carniato-stream.md";
  slug: "ryan-carniato-stream";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"trpc-data-flows.md": {
	id: "trpc-data-flows.md";
  slug: "trpc-data-flows";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"typescript.md": {
	id: "typescript.md";
  slug: "typescript";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
"viennajs-trpc.md": {
	id: "viennajs-trpc.md";
  slug: "viennajs-trpc";
  body: string;
  collection: "content";
  data: InferEntrySchema<"content">
} & { render(): Render[".md"] };
};
"misc": {
"edge.md": {
	id: "edge.md";
  slug: "edge";
  body: string;
  collection: "misc";
  data: InferEntrySchema<"misc">
} & { render(): Render[".md"] };
"javascript-toys.md": {
	id: "javascript-toys.md";
  slug: "javascript-toys";
  body: string;
  collection: "misc";
  data: InferEntrySchema<"misc">
} & { render(): Render[".md"] };
"trpc-viennajs.md": {
	id: "trpc-viennajs.md";
  slug: "trpc-viennajs";
  body: string;
  collection: "misc";
  data: InferEntrySchema<"misc">
} & { render(): Render[".md"] };
};
"projects": {
"Anket.md": {
	id: "Anket.md";
  slug: "anket";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"CreateT3App.md": {
	id: "CreateT3App.md";
  slug: "createt3app";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"UI.md": {
	id: "UI.md";
  slug: "ui";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
"Vocab.md": {
	id: "Vocab.md";
  slug: "vocab";
  body: string;
  collection: "projects";
  data: InferEntrySchema<"projects">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
