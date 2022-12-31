---
title: Chaining Middleware in Next.js
description: How to write a Next.js backend with (almost) all the freedom of Express
published: 2022/04/14 TODO: finish
tags:
  - Next.js
  - Free Code Camp
  - Fav
---

The first time I deployed a Next.js application to Vercel, my mind was blown. My previous method of deploying projects had been to put the frontend on GitHub Pages, and the backend on Heroku. Anyone who has used Heroku's free tier knows how slow it can be, especially if the application has not received any requests in a while and your dyno needs to be spun up again.

Vercel, on the other hand, is always lightning fast.

I had been wanting to create a full stack app completely in Next.js (plus a database) for a while now. Not just so I could deploy it to Vercel, but also because I was interested in trying out Next.js's backend powers - I love Next.js as a frontend framework, and I had heard that Next.js comes with a backend that's "just like Express".

Spoiler: Next.js's build-in backend is not at all "just like Express". But there are some things you can do to make it somewhat close.

## How to create a maintainable Express backend

At this point I need to give an example of how I like to structure my Express backends to ensure readability and maintainability.

```text
project/
├── src/
│   ├── product/
│   │   ├── product.routes.ts
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   └── product.schema.ts
│   ├── user/
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.schema.ts
│   ├── utils/
│   │   ├── db.ts
│   │   └── logger.ts
│   ├── routes.ts
│   └── app.ts
└── package.json
```

`app.ts` imports `routes.ts`, which is the gateway to all other routes. Here's what the `routes.ts` file for the sample project above might look like:

```typescript
import express from "express";
import user from "./user.routes";
import auth from "./auth.routes";

const router = express.Router();

router.get("/healthcheck", (_, res) => res.sendStatus(200));

router.use(user);
router.use(auth);

export default router;
```

From there on out, each resource is split into several files to promote a separation of concerns:

`product.routes.ts` contains routes that relate to the `product` resource. It calls any necessary non-global middleware, and then the actual handler for the route:

```typescript
const router = express.Router();

const base = "/api/products";

router
  .route(base)
  .post(
    [requireUser, validateResource(createProductSchema)],
    createProductHandler,
  );

router
  .route(base + "/:productId")
  .get(validateResource(getProductSchema), getProductHandler);

export default router;
```

You can see that the first route calls two pieces of middleware, and the second route calls one piece of middleware. Then, each route calls its main handler.

The `*.service.ts` files contain functions that perform database operations, and the `*.controller.ts` run the business logic with these abstracted functions. This means that if we for example want to change our database/ORM from MongoDB/mongoose to Postgres/Prisma, the only files that need any changes are `*.service.ts` files. Likewise, if we want to build another handler that uses the same type of database query, we can just import it from the controller without having to worry about introducting bugs.

Finally, the `*.schema.ts` files contain schema (usually made with Zod due to its excellent TypeScript support, but the more popular Yup is a fine option also) that are used for:

- Ensuring request contains the correct data, and automatically sending an appropriate response if it does not (that's what the `validateResource` middleware above is for).
- Typing the Request in our handlers so that TypeScript doesn't complain when we assume that something exists in the request (which we know it does, because we already validated it in the last step), and does complain when we try to access something that is not meant to be in the request.
- Making sure our database queries contain the correct data, and throwing a TypeScript error if they do not.
- Creating swagger docs.

TKTK add a diagram of how this works

## Building this structure in Next.js

Here's the big picture summary: **The only difference is how we implement our routes**, everything else stays the same. To achieve this, we use the wonderful package `next-connect`.

TKTK the way Next.js wants you to do stuff: File based routing (boo!), global middleware only (boo!), route handlers as functions, right there in the route file (boo!)

TKTK how to do it

- sticking everything except routes in root/api
- File based routing (ugh)
  - Point out that you can use api/product/index.ts or api/product.ts, they are the same
- install next-connect
- implementing next-connect

TKTK remaining issues

- passing data around - we don't have res.locals, and extending the request or response is a bad idea https://nextjs.org/docs/api-routes/api-middlewares#extending-the-reqres-objects-with-typescript

Next.js also supports catchall routing instead of the file-based routing, but I would _strongly_ warn against it, especially if you run other things such as `next-auth` in your API routes.

## Conclusion, and what I would want from Next.js in the future

Am I stubborn for wanting Next.js to be just like Express? I don't think I am - file based routing, while I love it for the front end, just isn't great for the back end.

Next.js is by far the best framework for front-end IMO, but their back-end just isn't quite there yet. And yes, I can bring my own back-end, but at that point why bother?

There are a couple of other nice benefits:

- Vercel is an awesome place to deploy things
- Easily share environment variables between backend and frontend
- Use types created by Zod schema, Prisma, etc. in the frontend
- Easily use the amazing [Next-Auth](https://next-auth.js.org/) in the backend. It's also possible to do this on a standalone backend, but quite a bit more work
- Learn about how Next.js's backend works under the hood

There are some significant reasons not to do this

- It means you can't deploy front and backend independently
  - Theoretically you can still send requests to the API endpoints with for example a mobile app, but at that point it probably makes more sense to build separate APIs and frontends
  - HOWEVER if you build your separations of concern the way I outlined above, many projects will have to change only their route files, and maybe the way some things are typed, but can otherwise transfer their controllers/services/schema to Express without any changes, and to other JS/TS-based backends like Fastify with only small changes.

The main benefit: You can write a "real" backend in stock Next.js, with good design patterns and separation of concerns, and easily port it to something else like Express in the future.

So here's what I want:

- An alternative routing system that lets me build a more maintainable API
  - could look into this: https://github.com/hoangvvo/next-connect#catch-all to just create an empty catchall handler and then add stuff to it this way
- The ability to chain middleware by default without having to rely on next-connect
- A better way to pass data around, without having to lose type safety on req/res
