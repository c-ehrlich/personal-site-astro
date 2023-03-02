---
title: "The case for teaching in TypeScript"
description: "Thinking back on my AgentConf appearance"
published: 2023/03/01
updated: 2023/03/01
tags:
  - "TypeScript"
---

I recently had the immense privilege of taking part in a panel about TypeScript together with [Tejas Kumar](https://twitter.com/TejasKumar_), [Sara Vieira](https://twitter.com/NikkitaFTW), and [Kent C Dodds](https://twitter.com/kentcdodds/) at [AgentConf](https://www.alpine-conferences.com/agent-conf-2023/). The entire conference was wonderful and deserves an article of its own, but I wanted to start with an article about this panel.

![Look mom, I'm on stage!](/img/blog/typescript/panel.jpg)

<p class="caption">Look mom, I'm on stage!</p>

There wasn't much of a debate on how applications should be written: they should be written in TypeScript. This is the overall consensus at this point, and not having to talk about this anymore meant that we were able to focus on more interesting topics, like education. The starting point for me was this Tweet from Kent:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Unless I&#39;m teaching you JavaScript fundamentals, everything I teach will be taught with TypeScript going forward.<br><br>TypeScript has won, and it&#39;s only a matter of time you&#39;re using it whether you like it or not.</p>&mdash; Kent C. Dodds 🌌 (@kentcdodds) <a href="https://twitter.com/kentcdodds/status/1624595023659667456?ref_src=twsrc%5Etfw">February 12, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Even as a TypeScript maximalist, I was not sure how to feel about this opinion initially. But after the panel, and having thought about it more, I think Kent is right.

## On gatekeeping

A common argument against teaching in TypeScript is that it's gatekeeping. JavaScript is easier, and therefore we should teach in JavaScript. As a self-taught developer who learned online because I didn't have the money for a boot camp, this hits close to home. I don't like gatekeeping, and I certainly don't want to engage in it.

But I don't think the gatekeeping argument holds up.

TypeScript is table stakes for modern applications. Every year the percentage of vanilla JavaScript codebases gets smaller, and it is likely to hit an asymptote of basically zero in the not too distant future.

Nobody in their right mind would argue that teaching React or another framework is gatekeeping, and that we should just teach `document.querySelector()` instead because it is more accessible. That's because nobody writes frontends like that anymore, and no company would hire a frontend developer who doesn't know a framework.

The same is increasingly true for TypeScript.

Teaching in TypeScript isn't gatekeeping, it's empowering people to make it through a gate that they will inevitably be confronted with.

## On mental overhead

Another common argument TypeScript requires additional mental overhead compared to JavaScript. This is somewhat true in the most literal sense, but it also misses the point entirely. The mental overhead of learning and using TypeScript is lower than that of learning and using JavaScript.

The truth is that **using JavaScript doesn't mean you don't have to think about types**.

It only changes _when_ you have to. TypeScript developers think about types before things go wrong. JavaScript developers think about types after things go wrong.

In many cases, TypeScript allows you to spend _less_ time thinking about types. Think about this component:

```js
function SomeComponent(props) {
  // 200 lines of stuff
}
```

What props should you pass to this component, and what types should they be? In JavaScript, you will need to read the component to find out, and hope you don't make any false assumptions. In TypeScript, you can read the type definition or even just let autocomplete tell you.

What requires more overhead: a language [with endless illogical edge cases](https://www.youtube.com/watch?v=et8xNAc2ic8), or one that uses types to mitigate most of these?

I have taught TypeScript to several JavaScript developers on my team. They are productive in it within an hour or two, and it doesn't take long until they work significantly faster than they did in JavaScript.

## Learning TypeScript keeps getting easier

But what about all of the weird esoteric stuff that TypeScript has? Generics, Mapped Types, and whatever else [Matt Pocock](https://twitter.com/mattpocockuk/) is teaching these days? Those are quite difficult, and they don't exist in JavaScript, right?

**These things are not necessary for a Junior Developer writing modern web application code.**

If you know all of the primitives and can type objects and functions, you're ready to jump into a modern TypeScript codebase. Look at this example of a route handler and a page that calls it, implemented using tRPC.

```ts
// src/server/api/routers/example.ts
export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});

// src/pages/index.tsx
function HomePage() {
  const hello = api.post.byId.useQuery({ id: "1" });

  return (
    <div>
      <h1>Welcome to this page</h1>
      <pre>{JSON.stringify(hello.data, null, 2)}</pre>
    </div>
  );
}
```

Do you notice anything about this code snippet? **There is not a single explicit type to be found**! And yet it gives end-to-end typesafety and autocomplete. It looks identical to how it would look in JavaScript, but you get all of the tooling benefits that TypeScript provides.

Library authors work hard to provide this level of developer experience, and it makes working in a modern TypeScript project a blast!

Also the resources for learning TypeScript keep getting bettter. Two free resources I would recommend are:

- Matt Pocock's [Beginner's TypeScript](https://www.totaltypescript.com/tutorials/beginners-typescript)
- Jack Herrington's [No BS TS playlist](https://www.youtube.com/watch?v=LKVHFHJsiO0&list=PLNqp92_EXZBJYFrpEzdO2EapvU0GOJ09n)
- But most importantly, just starting to use TypeScript in projects.

## There are still growing pains

There are still moments where TypeScript frustrates me and makes me feel like a hypocrite for recommending it. These fall into two categories: bad library types, and the TypeScript server going crazy.

Unfortunately some libraries still have issues with their built-in types. One offender here is Next.js. Take this example:

```ts
export default function GsspPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
  // ^? (parameter) props: { [key: string]: any; }
) {
  const { data: session } = useSession();
  return <pre>{JSON.stringify(props, null, 2)}</pre>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      session: await getServerAuthSession(ctx),
      foo: "bar",
    },
  };
};
```

We are using the `GetServerSideProps` and `InferGetServerSidePropsType` types, so it seems resonable to believe that our props would be typed correctly, right? **Wrong**. The props are typed as any. The solution? Don't use the `GetServerSideProps` type, and instead type `ctx` as `GetServerSidePropsContext`. _Obviously_.

```ts
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getServerAuthSession(ctx),
      foo: "bar",
    },
  };
};
```

<p class="caption">Duh.</p>

Snark aside, things like this still occur much more often than they should.

Things are rapidly improving in this regard though. On the backend, [Fastify](https://www.fastify.io/) and [Nitro](https://nitro.unjs.io/) are typed much better than Express was, and [tRPC](https://trpc.io/) sets a new standard for typesafety over the wire. The same is true for the frontend, for example [MapleLeaf](https://twitter.com/heyImMapleLeaf) has been doing a lot for the type safety in [Remix](http://remix.run/)

The other issue is the TypeScript server. Occasionally, and especially in projects that are use a lot of inference through libraries like Zod, it will slow down to a crawl or even incorrectly report type errors where there aren't any.

The solution is simple: hit CMD + Shift + P, and restart the TypeScript server. But beginners might not know about this, and either way it doesn't detract from the main point: **The TypeScript server should not show false positives under any circumstances**.

## How we teach things determines how people will use them

The patterns you show in your documentation are the patterns that people using your library will implement. A large part of programming is pattern recognition, and the first pattern people see is often the one they will remember and keep using.

If you want people to use your library with TypeScript, you should teach it with TypeScript. Writing the documentation in JavaScript leads to bad documentation for TypeScript users, who are the overwhelming majority at this point.

Writing docs in both TypeScript and JavaScript is of course an option, but most projects are already perpetually behind with their docs, without having to write each code snippet twice.

## The goal is to help people build stuff

Let's not forget why we are educating developers in first place: to help them build stuff. The simple truth is that TypeScript has become the language of full-stack web development, and teaching anything other than JavaScript fundamentals in JavaScript feels dishonest at this point. Not many new projects are being started in JavaScript, and rightfully so, so why are we still insisting on using it for docs and courses? By teaching TypeScript early, you are empowering new developers to move faster, be less frustrated, and build better things.

That being said, **this entire post is big time bikeshedding**. I learned JavaScript first and only learned TypeScript much later. I ended up ok. And the number one resource I recommend to people who want to learn programming is [freeCodeCamp](https://www.freecodecamp.org/), which still teaches entirely in JavaScript.

So why do I recommend it even though it's in JavaScript? Based on my experience as a teacher and university lecturer, I believe that the most important things a course can have are:

- **Project-based** - Students should be spending most of their time self-directed building projects, running into problems, and figuring out how to fix them. Not following a video of someone explaining something.
- **Has a community of people supporting each other** - I believe in the power of self-directed learning, but it can be hard to stay motivated sometimes when you're alone. Being around other motivated people is infectious. Another nice thing about freeCodeCamp in this regard is that the more experienced learners often stick around and help the newbies who are following in their footsteps.
- **Nonlinear** - A big factor of being motivated is interest. A nonlinear program allows learners to pursue the things that they are interested in.

While I strongly believe that teaching TypeScript-first is better, It's not even in the top 3 factors that I use to evaluate material for beginners.

## Wrapping up

So what's the conclusion then?

1. If you are creating educational materials, make them TypeScript first
2. If you are a learner, TypeScript-first materials are better but it's not the most important factor

## Thanks for reading!

What do you think? Please feel free to [contact me](/contact) and share your thoughts on this topic.
