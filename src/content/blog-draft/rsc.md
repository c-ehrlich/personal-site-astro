---
---

!!! this is my personal learning journey, so if you're expecting a fully formed well crafted simple explanation that clicks, then this will probably not be it. But I've done some deep dives in the last couple of weeks, so maybe there' something useful in here for you :)

DAN TWEET ABOUT BLUE/GREEN
https://twitter.com/dan_abramov/status/1633574036767662080/photo/1
GSSP, Loaders, etc is one blue component with a bunch of green ones inside
so if you SSR, you have to hydrate everything inside. with RSC you only have to hydrate the client bits
connect to red/blue functions https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/

Ryan Carniato said "client components" is a misnomer - there are now two types of components: "server" and "isomorphic"

RSCs dont ship JS

"so each time you need to put something in database or validate, fetch on the backend, backed will need to render that thing and send it back to you?"
=> you don't make the isomorphic parts of your app RSCs

streaming in RSCs - how does this fit into "RSCs ship html"?
https://twitter.com/t6adev/status/1632968577132417029

---

# Ryan Stream Notes

"back to the monolith"
rails=>spa=>ssr=>back to the roots kinda
server components are the island architecture... with routing, data loading, state preservation, etc
two sides: dx, perf/ux

rich harris talk https://www.youtube.com/watch?v=860d8usGC0o

- no js: the experience of navigating and doing updates is... anchor tags (GET) and forms (POST and refresh)
- SPAs... lots of benefits (fast nav, client side state, persistent elements, single codebase) but you lose that simplicity => lack of resilience, too much js, bad perf
- MPAs are fast, resilient (no js), consistent/accessible, any tech stack BUT bad nav, just doesn't fit user expectations anymore
- MPA with React components ... you're actually building two apps ... initial render php/rails, updates JS ... web is the only platform where writing a frontend in TWO languages was ever considered normal
  - Hydration is a huge cost
  - the only other option is making requests clientside => spinners and waterfalls
- Server Components: "like html over the wire, but vastly more sophisticated"
- other ideas: Marko-partial hydration, Qwik-aggressive lazy loading, Astro-island architecture, Svelte-compiler

- SSR as we know it today in SPAs is still an SPA - first page is server rendered and hydrated, second page is client rendered

- server components arent an optimization trick, they're an architecture => we'll get to understanding this later => need to understand the evolution first

Stages => data fetching IS the architecture

1. Declarative app - fetch and set state
2. Cache in a global store (use Redux)
3. GraphQL (most optimal client side solution but dx for updating cache is rough)
4. React Query ("screw it, let's simplify the cache and just refetch aggressively - invalidate on mutation, done...") => invalidating on mutation means TWO trips!! ... this is worse but nobody really cared
5. Remix (invalidate whole route, ephemeral optimistic updates => dont need client side cache)
   ---- up to now we've not made the JS payload smaller... you need all the code to hydrate the page
   (tRPC is 4 with a bit of 6)
6. Server functions + Server Components

- when i go to twitter.com, i load the sidebar bundle, the tweets bundle, and the trending bar bundle. when i go to another page, which bundles do i need to get again? how do you split the js? what do you load initially, what do you load later?
- people think RSC is a "lakes" mental model (opposite of islands)... can just make a request to the server and get html for some bits - BUT that would actually be a terrible idea
- the "how do we get new bits of the page" problem is specific to declarative frameworks!

  - marko (and wiz etc) solved this a decade ago... "async fragments"
  - "async fragments" article... explains suspense 10 years ago https://tech.ebayinc.com/engineering/async-fragments-rediscovering-progressive-html-rendering-with-marko/

- m rawlings "maybe you don't need that spa" https://medium.com/@mlrawlings/maybe-you-dont-need-that-spa-f2c659bc7fec

RSC architecture ... it's islands (...but better?)

RSC Rules:

1. the root is on the server
2. client components can't import server components
3. Only Client Components can access Client Context

- RSC has "router" component on the outside of the app, unlike Astro/Qwik

- Client Components aren't actually Client Components... they run on both sides
  - not rendering them on the server but leaving white, then rendering them in on the client would be BAD!

"lakes" architecture comes from a client side mentality

1. Client Root (false... sort of... all websites start on the server)
2. Pass props to server proponent

server components at the leaves is not where the win is ... because of data serialization
client->server->client->server ... you don't know what possible data the client could send back to the server

"with RSC model, the only thing you need to serialize is props of client components"
because its all rendered on the server, you don't need to hydrate

sharing state between two distant client components... you need context... connect all islands with the context api (providers can have SCs as children!)
Client component props are the boundaries... the props need to be serializable

dan server components diagram... the black is when they become html
https://twitter.com/dan_abramov/status/1633574036767662080/

1. turn the server components into html and keep the client components in place
2. turn the client components into the remaining html ... either during ssr or later on the client

With islands: how do you find the anchor points to do replacement?
=> rails had turbolinks

the solution to swapping out islands is "nested routing"... just leave the remainder of the page alone... ryan points out frameworks always come down to routing
MPA: you don't want to render the whole new page on the server on each navigation... you're not gonna serialize all the client state back to the server to let it preserve that on the render (counter etc). so how do you do it?
THATS why you cant make new client components on the server... because the server doesn't know about context
Load vs Refresh ... these are different
=> initially: render everything
=> afterwards: only render server components
how do you share state on refetch?

if you pass a promise from a SC to a CC, the SC will never know if the CC has a suspense boundary

you don't want to have to wait for the bundle before you can fetch! load data and code at the same time => this is why we hoisted it into loaders
loaders get rid of waterfalls!
before loaders pattern, ryan just made each route a hoc that fetches data and has the actual component as a lazy loaded child... this is kinda all a loader is

server components is similar (fetch all data at the top of the route) BUT "what if we don't want the whole thing to be a client component?"

- fetch later: waterfall
- await at top: block

server components basically replicate loader pattern

- ryan's prediction: everyone will create server waterfalls for a year or two

pretty much all apps have in common that ideally you want to fetch the data as high up as possible

QUESTION FOR RYAN: what if you don't want to fetch everything at once, but also you don't want to waterfall

- example: twitter
  - high priority: timeline
  - low priority but still shouldn't waterfall: the user profile from the hover card

the problem with ryan's HOC lazy loading router: you're not rendering anything on the server. you're just getting props, serializing, and sending down the wire
=> you've just created a json api. we've gone back to nested loaders

how will next do mutations?

1. do the mutation
   - REST or RPC (RPC wins)
   - no correlation between url and action
   - GraphQL made this obvious
     - you design a tree on the query side... stuff is connected, nesting, you get what data you want => BUT on the mutations side it's just a bunch of flat mutations => GET is graph, POST is RPC
   - React has added `use server`... separate fetching from mutation
2. optimistic updates
   - remix nailed it (but you don't need forms for this - forms make sense for the MPA mentality though)
   - like solid start's actions
   - push any mutation while in flight into ephemeral state
   - How do you optimistic update the server part of the page? You can't... the answer:
3. invalidation
   - my theory:
     - if the data only exists in client components, do key invalidation similar to r-q
     - if the data also exists in server components: full page refresh
   - 1. client sends mutation
   - 2. Optimistic ephemeral state until response
   - 3. Handle mutation + redirect/invalidate (on server)
   - 4. Server render
   - 5. Send the server rendered response back "render this page"

IF YOU HAVE A LONG LIVED CACHE, YOU CAN SAVE MOST OF THE WORK OF RERENDERING THE PAGE
"oh, only this data changed, so we can use all this other stuff from last time"

Sizes (ryan is making these up, to make a point)
React Preact
Lib Size 70kb 5kb
Cost of SCs 10kb 5kb
Island size 120kb 120kb
Total SC 200kb 130kb
SPA Size 500kb 430kb

- the less of your own code you ship (because SCs), the more of your bundle is the framework, so size difference in frameworks becomes more meaningful
- BUT maybe RSCs is good enough so people won't care that other stuff is smaller

an mpa with islands will still be a bit smaller than server components because of certain interactive points you dont care about in an mpa - because you know it will come back from the server
BUT the difference is so much smaller than between MPA and "SSR"

this isn't just "hey lets go back to forms that POST because we suddenly care about performance"
its everything we've learned about clientside caching, mutation, optimistic rendering, waterfall reduction, etc. is getting wrapped into the architecture itself to produce something thats a bit different - its not an SPA and not an MPA
...and the routing is the foundational piece of defining what the architecture is - "hybrid"?

caching (my conjecture + ryans response)

- no optimistic ui in RSCs
- anything that can mutate just won't be an RSC
- INP will be worse because its basically sending html as json that has to be diffed on the client
- If each route transition has a budget of 200ms and you have to hit the server, render html as json, send it back to the client, then serialise it and diff the dom to insert it, it's not gonna go well.
  => regardless of if its cached or not, the browser needs to do some work
- if the cache ends up being server/cdn/etc then it might be a bit of work to ensure that there is no cache poisoning, leaking of data, etc
  RYAN THINKS:
- people are looking for edge caching
- probably view level caching because we're basically looking to replace browser http cache
- INP will be problem for client routing and for "serving json and re-rendering the page, then diffing the vdom"
  => navigation is basically "render (server) the part that changes, and innerHTML and hydrate the parts you need to

the years of fighting against js bundle size are over... you can still get yourself in trouble, but "random guy builds blog site" is good by default now, almost astro-like .. the base case is more performant and simpler

this is harder to adopt than hooks... because its an architecture change

rsc is improving dx in cases where you're already optimizing for performance. and in other cases it doesn't matter

this model puts tanstack query and state libraries into question. their impact will drop.

mutations again

- it's basically the form reload mentality, but with caching
- invalidation, optimistic update, server gives reload or redirect, client gets rendered html or jsx and diffs that
- conceptually we're thinking in pages
- ryan is thinking if server components should be .astro files because it makes even clearer what's going on

learning => a lot of the SPA concepts become stuff that you don't need to learn initially... state is chapter 5, not chapter 1

the adoption will be slow... it will take some public/blogged about wins until people realize the power - this also gives react team time to figure out the last couple of pieces

Mental model: Container componenents vs Presentation components => RSCs move container components to the server so you can pass server data as props to presentation components

New Chrome navigation APIs (page element moves on transition etc) will be a big part in making RSC even better
