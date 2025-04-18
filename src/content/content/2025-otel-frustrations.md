---
title: OTel Frustrations
type: "article"
description: "..."
published: 2025/04/12
updated: 2025/04/12
tags:
  - opinion
  - OpenTelemetry
---

its sad how much time and money has been funnelled into opentelemetry, how much its being shilled by companies, and its still so wildly immature

<span style="font:monospace">David Cramer (@zeeg) - [4:50 AM · Apr 18, 2025](https://x.com/zeeg/status/1913062466507956593)</span>

<br />

How would you improve it?

Matt Pocock (@mattpocockuk) - [10:16 AM · Apr 18, 2025](https://x.com/mattpocockuk/status/1913144580322525407)

<br />

move faster

how are we 4 months into 2025 and genai semantic conventions are still incubating?

outcome is that everyone just does their own thing instead (example: vercel ai sdk `experimentalTelemetry` is very nonstandard)

Christopher Ehrlich (@ccccjjjjeeee) - [10:27 AM · Apr 18, 2025](https://x.com/ccccjjjjeeee/status/1913147336873693527)

<br />

"you have to put prompts and responses as events instead of attributes, but beware this will change again after complex attributes land, but also there has been no perceivable progress on them since the issue was opened"

Christopher Ehrlich (@ccccjjjjeeee) - [10:33 AM · Apr 18, 2025](https://x.com/ccccjjjjeeee/status/1913148754779156649)

<br />

i appreciate that its a project built by volunteers, prs welcome etc

but the experience of building tooling for it is an exercise in frustration

and so the tooling is bad and its also frustrating for users

Christopher Ehrlich (@ccccjjjjeeee) - [10:33 AM · Apr 18, 2025](https://x.com/ccccjjjjeeee/status/1913148919443345853)

<br />

the promise of otel is that if there is a common agreed upon schema then multiple vendors can build tooling for that schema

but that promise isn't really true and so it's hard to build any kind of ui/ux that makes assumptions about schema beyond the most basic things

Christopher Ehrlich (@ccccjjjjeeee) - [10:37 AM · Apr 18, 2025](https://x.com/ccccjjjjeeee/status/1913149948264095872)

<br />

in their defense we're still better off than we were 10 years ago. just it could be so much better if there wasn't so much design by committee.

Christopher Ehrlich (@ccccjjjjeeee) - [10:39 AM · Apr 18, 2025](https://x.com/ccccjjjjeeee/status/1913150279945511263)

<br />

btw the best otel tooling i've come across is the one in 
@EffectTS_ 😭

which i think is because they own the whole thing so they can be opinionated

and no opinions = bad ux

Christopher Ehrlich (@ccccjjjjeeee) - [10:46 AM · Apr 18, 2025](https://x.com/ccccjjjjeeee/status/1913152259480756246)
