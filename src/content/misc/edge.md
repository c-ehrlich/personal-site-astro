---
title: "Deploying to the edge"
---
## How did we get here?

### Servers
- simple mental model
- downsides: scaling (EVERY service is bursty), need to do devops

### CDNs
- Akamai, Fastly, AWS CloudFront, Cloudflare
- Fastly had an outage in 2021, it broke Twitter, npm, GitHub, Stack Overflow, etc for 
- Locations - Fastly: 79 cities, Cloudflare ~300 cities, Akamai: 150 countries, CloudFront: 500+ locations in 100+ cities
- CloudFront mostly in tier 1/2 telecom carrier data centers, a few of their own. Akamai & Cloudflare primarily use their own datacenters, but still colocate. Fastly is entirely own infra. 
- Edge caching for requests ... eg CloudFront has ~20 edge cache regions

### Lambda
- can sometime be in a few more regions (but Vercel defaults to 1... TKTK check if you can get more)

### ...what else could we use these data centers for?
- instead of picking a region, put your compute everywhere
  - sometimes you still want to be in one reason bc db roundtrips
- but it's not good for main application logic because you want to be closer to your db, right?

### ...but it's still amazing if you're using just one region or a few 
- cf worker cold starts are about the same as lambda warm starts

### Worker vs Lambda - https://www.youtube.com/watch?v=vzWiSF0y4Wo
- Lambda
    - designed for single-region (Lambda@Edge exists, but kinda slow and hilariously expensive)
    - Isolated as Firecracker VMs (LOOK UP WHAT THIS IS / HOW IT WORKS)
      - it's brilliant, but it's VMs in a hypervisor
    - Long running - up to 15min
    - Big - 10,240 MB memory, up to six vCPUs, up to 10GB code with container image packaging format

## What is it?
- 250+ regions!
- no cold starts thanks to edge storage
- you can write JS/TS and WASM
- functions... essentially fetch handlers
- CF also offers KV, storage, R2 (interfaced through workers), durable objects (long lived, globally consistent, javascript objects - partykit!), durable object alarms - basically cron,
- "limited, but good"

- if you've ever deployed a next.js app with middleware to vercel, you've used it
- that's why for example next-auth doesn't work in middleware
- same with routing... imagine if we had cold starts for redirecting to a different URL

- similar to service worker ... go "inbetween" a request, 

## V8 Isolates
- containers need to pull in language runtime
- lambda keeps running / charging you money while you hit the db
- V8... The JS engine of Chromium
- Vercel: $2 / 1M units, ~20 regions => but still a great choice because of how easy it is
- Cloudflare: $0.50 / 1M units, ~300 regions

## WinterCG - https://www.youtube.com/watch?v=fih5Yt3UiNg
- A w3c community group (that's what CG means)
- Cloudflare, Netlify, Fastly, Deno, Shopify, Vercel, ByteDance, Alibaba, etc
- The goal is interoperability
  - landing `fetch` in Node was super difficult re interoperability etc. And before you had to use `request`, `axios`, `node-fetch` works different from browser, various polyfills, etc
- across ALL JavaScript environments
  - deno, cloudflare workerd, vercel/netlify serverless functions, etc
  - there's no "Node standard", there's just Node
  - WinterCG: no new APIs, instead merge gaps between runtimes
  - we want to be compatible with the browser APIs
- Node on Lambda, WinterCG is portable
- It's not a runtime, it's a standard that others implement in their own runtime
  - also test suites for testing that a runtime conforms to wintercg
  - but also give back to the ecosystem
- Propose improvements to existing specifications => example: fetch is defined by whatwg rather than w3g
  - don't "make a new fetch", instead contribute to the existing fetch
  - "everyone should use fetch, but let's also improve it"
- bit less permanent than ecma (can undo things)
- "Minimum common API"
  - a collection of other web platform APIs ... readable streams, web crypto, fetch, etc... every WinterCG compatible runtime should implement these
    - "common key" - like ES2020 etc... you can know that your runtime has at least x ... `engines: { wintercg: ">=2023" }`
- Why is this different than last time? Undici implements whatwg etc... => because of who's behind it
- WinterCG also works with TC39

## Why now?
- It's getting easier
  - lib compatibility
  - vercel
  - one line in next.js
  - similar in nuxt
  - new libraries
    - lucia for auth
    - kysely and drizzle for ORMs
  - new services to get around ephemerality & runtime limitations
    - "Serverless problems require serverless solutions"
    - use Durable Objects as a message broker (or hosted kafka, rabbitmq, etc)
    - Vercel/Cloudflare KV, Neon, PlanetScale, Turso, Upstash, MongoDB Atlas, DynamoDB
    - Clerk, Auth0, or roll your own with Lucia/NextAuth
    - sentry with toucan-js
    - axiom-js works everywhere

## BFF Pattern - Workers a great fit - https://youtu.be/1tM_d3CH0N0?si=8Uo6o3bAQIdg49qB
- Empower FE devs with lightning fast edge functions to call your deeper BE services (own or external)
  - Who here has had a BFF that's just a wrapper around some API keys?
- Have a Fargate box for long running tasks, but handle user interaction fast
- Axiom uses Servers, Lambda, and Edge. Exploring WASM on workers for ingest pipeline.

## Using CF Workers as your only backend - https://www.youtube.com/watch?v=1tM_d3CH0N0
- you'll probably need services

## Limitations

### Library compatibility
- ...but we're reaching a point where there's solutions for every task

#### PlanetScale + CF Workers

## Cool stuff

### CF Workers local dev
- `wrangler dev`
- deploys dev changes into edge network, you're developing on edge with HRM. really slick
- hit `d` to get a debugger in chrome - browser debugger, see logs, etc
- can also run the whole thing locally (cicd, offline dev, etc)

## Shortcomings
- You probably can't use JUST workers for everything
- Not Node (maybe this is good?) - but can get some node builtins back via workerd
- Documentation/Examples/Education still lacking

## Final Word
- CF Workers (and edge in general) are great
- Performance!
- Dev is fast
- Limitations can be frustrating
- DBs are getting there
- It's excellent for BFF