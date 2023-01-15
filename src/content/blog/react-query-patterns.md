---
title: Writing clean React Query code
description: Two easy patterns that you can implement
published: 2022/05/28
tags:
  - React Query
  - Clean Code
---

> ⚠️ **This article is outdated!** I wrote this for React Query v2/v3. Some of the patterns here are no longer good practice, and the code snippets will break entirely in v5. I'll leave this article up because I don't like when content online disappears, but please be aware that you probably shouldn't take it as advice.

React Query is by far my favourite library for dealing with server state. But after spending some time reading both code posted by people on support channels such as Stack Overflow and the React Query Discord, and some Open Source projects that use React Query, I've noticed that there are two very easy to implement patterns that make React Query code easier to read and less prone to bugs.

## 1. Use variables as Query Keys

React Query uses Query Keys to store and later invalidate queries. This is very userful, but they are just arbitrary strings, which means they are not checked by TypeScript in any way. An easy way around this is to use variables. There are two levels to this:

1. Keep your Query Keys in an enum
2. Assign a variable to the entire Query Key at the start of the function

Imagine this very simple query:

```ts
function useGroup(id: number) {
  return useQuery(["group", id], () => fetchGroup(id));
}
```

You are probably also using the `group` Query Key in some other places. What if you misspell it in one place? That can lead to a frustrating debugging session, or even worse, not noticing at all and losing all the benefits of React Query by not using the cache at all due to mismatching Query Keys. The solution is simple: Keep your keys in an enum, and refer to that instead.

```ts
// QueryKeys.ts
export enum QueryKeys {
  user = "user",
  group = "group",
  post = "post",
}

// useGroup.ts
function useGroup(id: number) {
  return useQuery([QueryKeys.group, id], () => fetchGroup(id));
}
```

By referring to a key of the enum, you are making sure that you will always use the correct value. It also gives you an easy way to keep track of all the different Query Keys that you have in your app.

The second level to this is that if you use the same complex Query Key more than once in the same mutation, it's probably worth assigning it to a variable at the start of each function and just referring to that throughout the function. This is for the same reason as the previous tip - it helps to prevent bugs.

Here's an example of how this might look:

```ts
const useUpdateGroup = ({
  groupId,
}: {
  groupId: string;
}) => {
  const queryClient = useQueryClient();
  const queryKey = [QueryKeys.group, surveyId]; // Create Query Key

  return useMutation(
    queryKey, // Usage #1
    (data) => axios.patch(`/api/group/${groupId}`, data),
    {
      onError: (e) => {
        console.error(e);
        queryClient.invalidateQueries(queryKey); // Usage #2
      }
      onMutate: (data) => {
        queryClient.cancelQueries(queryKey); // Usage #3
        let optimisticUpdate = queryClient.getQueryData(queryKey); // Usage #4
        if (optimisticUpdate) {
          /* create the updated object */
          queryClient.setQueryData(queryKey, optimisticUpdate); // Usage #5
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKey); // Usage #6
      },
    }
  );
};
```

We use the `queryKey` variable **six** times in the function above, and I've seen mutations that use it even more times than that. Imagine you don't do this, and later realize that you need to change the Query Key. In a function that is much more complicated than the one above, what are the odds of missing one instance and introducing a bug? With this system, you just need to change one thing in the future.

## 2. You don't have to spread arrays or objects to create optimistic updates

The second easy to fix thing is an antipattern that I see people using all the time in mutations. It comes from being used to dealing with immutable state so frequently that spreading becomes the default behaviour.

Here is one example of how this antipattern might manifest itself.

```ts
onMutate: (data) => {
  queryClient.cancelQueries(queryKey);
  const optimisticUpdate = queryClient.getQueryData(queryKey);
  if (optimisticUpdate) {
    queryClient.setQueryData(queryKey, {
      ...optimisticUpdate, foo: {
        ...optimistic.foo, bar: {
          ...optimisticUpdate.foo.bar, baz: {
            /* etc, imagine how ugly it gets when dealing with nested arrays */
          }
        }
      }
    });
  }
},
```

**You don't have to do this!**

One 'solution' I see sometimes is people reaching for libraries such as [Immer](https://immerjs.github.io/immer/). Immer is a lovely library, but there is an even easier way.

The simplest solution is to just use a mutable variable for your optimistic update. In this particular situation, there is absolutely no advantage to using immutable data.

```ts
onMutate: (data) => {
  queryClient.cancelQueries(queryKey);
  let optimisticUpdate = queryClient.getQueryData(queryKey);
  if (optimisticUpdate) {
    optimisticUpdate.foo.bar.baz = 'new value'; // modify a deeply nested oject
    queryClient.setQueryData(queryKey, optimisticUpdate);
  }
},
```

Look at how easy to read this is compared to above. Not only that, but it's also much more difficult to introduce bugs (raise your hand if you've ever made an off-by-one error while using `Array.slice()`).

I hope these tips were helpful. Thanks for reading and please don't hesitate to contact me if you have any questions or comments.
