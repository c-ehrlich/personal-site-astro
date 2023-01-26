---
title: How To Start Contributing to Open Source
published: 2022/05/25
updated: 2022/06/20
tags:
  - Open Source
  - Free Code Camp
  - Fav
---

TLDR:

1. Use open source projects
2. Find issues
3. Fix them

There's a bit more to it than that, but that's the basic idea.

## Background

When I started taking this programming thing seriously, I heard one thing over and over: "The best way to learn is to build projects yourself, and to contribute to open source".

The first part didn't seem so difficult: Learn a new technology and build something with it. Then learn another new technology and build something that uses both of those technologies. Keep going, maybe swapping out some parts of your stack here and there, until you can build a real app that people use. Of course it took a lot of time and effort to get to that point, but the route to get there seemed very clear.

Contributing to Open Source, on the other hand, was not as easy. I several times to find projects to contribute to, but everytime I felt like my skill level was not yet there.

It got better when I stopped looking for things to contribute, and instead just used open source projects until I found bugs, and then tried fixing them, or at least opening issues.

## My first PR

My first open source contributions were to FreeCodeCamp, while I was still a student myself. Throughout the API certification I was using Heroku to deploy and submit the lessons and projects. But for the first section of the Quality Assurance certification, the boilerplate failed to deploy to Heroku. The error message said something about the port, so I checked the server code and compared it to previous ones I had used, and found that unlike previous ones which had checked for an environment variable called `PORT`, this one just had `3000` hardcoded.

Thus, my first PR was created:

https://github.com/freeCodeCamp/boilerplate-mochachai/pull/51

```diff
- app.listen(3000, function () {
-   console.log("Listening on port " + 3000);
+ const port = process.env.PORT || 3000;
+ app.listen(port, function () {
+   console.log("Listening on port " + port);
```

-2 lines, +3 lines. Not exactly grandiose. But it got merged, and I'm sure it will save someone else a bit of frustration in the future.

## My smallest PR

I'm giving some other examples, specifically to show how small a PR can be while still being useful. You don't need to save the world with your first contributions.

To make this point, here is my smallest PR, at 1 character changed.

While working my way through the Node/Exress projects on FreeCodeCamp, my process was to explore the demo projects, and try to reproduce their functionality, including error handling. This meant sending the demo projects a bunch of bad requests to see how they would handle them.

Common junk values I would try to send for a value that can take an integer would include:

- a string
- a boolean
- a decimal value
- an object
- nothing
- zero, if it's not meant to accept that
- a negative value, if it's not meant to accept that
- if there is a defined upper bound, that number + 1
- a very large value
- etc.

As legitimate Sudoku values are 1-9, I tried sending 0 as an input, and the API sent back a different response than when inputting other incorrect numbers such as '-5', '2.5', or '999'. So I checked the code, and indeed the check for valid digits had a mistake in it. Thus, I created this change:

https://github.com/freeCodeCamp/demo-projects/pull/152/commits/b2e33a331d07111963c55ac91cc455f458570f71

```js
- if(!Number.isInteger(value) || value < 0 || value > 9) {
+ if(!Number.isInteger(value) || value < 1 || value > 9) {
```

## A bad PR

Another example from the FreeCodeCamp testable projects. This time while working on the project I managed to create a project that passed the test suite despite not functioning properly. So I thought I'd create a test that catches this bug for people submitting the same project in the future.

But my test had one issue: I fetched a misformed URL.

https://github.com/freeCodeCamp/freeCodeCamp/pull/44862

```diff
  const filterDateBeforeLimitRes = await fetch(
-   url + `/api/users/${_id}/logs/from=1990-01-02&to=1990-01-04&limit=1`
+   url + `/api/users/${_id}/logs?from=1990-01-02&to=1990-01-04&limit=1`
  )
```

I created a new test to improve the submission process, but I didn't properly test the test, and I had made a type so the test didn't actually test anything (it passes for all possible values). Oh dear!

**How embarrassing!!!**

Or so I thought, until I realized: of course it's good to want to avoid bugs, but there's no point in feeling guilty over them. And having someone else discover them before they cause any actual issues is the best thing that could possibly happen.

When a PR you make, maybe even your first PR, gets rejected, the thing to keep in mind is: **this is the system working as intended**. It's nothing to be ashamed of if your PR doesn't get merged, and it happens to much more experienced programmers all the time.

## Conclusion

If you use software, you'll sooner or later run into an issue that you can fix. So fix it. If your skills are not yet at a point where you can fix it, just move on. BUT: If you give it a try, you might be surprised by how much you can get done with some google searches and some trial and error.

Give it a try, it feels great.

## A freebie

If you follow this guide, you should easily be able to find projects that could use a bit of help. But if you're looking for advice on where to look, as of May 2022, here's a good place to start: **The tests for the API and Quality Control Projects on freeCodeCamp are missing a lot of edge cases.** I already added some, but there is a ton more to do. If you were able to complete the testing cert, and can read the existing tests to see how they should be written, you are ready to work on these.
