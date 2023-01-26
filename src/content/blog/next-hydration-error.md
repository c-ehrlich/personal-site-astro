---
title: LocalStorage and Hydration errors in Next.js
published: 2022/03/20
tags:
  - Next.js
  - LocalStorage
  - Debugging
---

## What is a Hydration Error

Front-End development goes in cycles. First started with static HTML pages, then we added JavaScript and AJAX to get more front-end interactivity. After this focus returned back to the server with Jinja templates and similar, which allowed us to render almost the entire website on the server, only including some small pieces of JavaScript for interactivity that can only exist in the frontend. Then the pendulum swung all the way in the opposite direction with Single Page Apps, where we just send the client a mostly empty HTML page and some JavaScript that then populates this page.

SPAs give unprecedented interactivity and developer experience, but until the browser is done figuring out to do with all that JavaScript, the user can't do anything. That's not a great experience!

For example if we want to view a page that shows some data from an API, assuming the data is not cached locally, we have to:

1. Client request the page
2. Server sends the page
3. Client renders the page, without the data
4. Client a request for the data in useEffect() or similar
5. Server makes DB request for the data
6. Server sends back data
7. Client inserts the data into the page

In a Server Side Rendered App, we can instead do:

1. Client requests the page
2. Server makes a DB request for the data
3. Server renders the page, including the data
4. Server sends back the rendered page

Server Side Rendering lets us save an entire round trip.

What's even better is, many pages or components of pages don't actually need to be re-rendered everytime they're requested. Instead we can render them once, at compile time, so it's just as fast as a site made from plain HTML.

But if Server Side Rendering is just Jinja Templates but written in JSX, doesn't that mean we lose some interactivity? Well that is where Hydration comes in. When you use SSR, the server sends a static page to the client. But of course your site still needs to have interactivity, so the client takes over the static page, and turns it into a dynamic page that can react to data changes. This is called Hydration.

However, Server Side Rendering also brings with it some new challenges. One challenge that is quite common, but fortunately also easily solvable, is Hydration Errors.

A Hydration Error is when while turning the static page into a dynamic page there is an unexpected difference between the two, and the process doesn't know how to deal with it.

## My bug

I was using this wrapper function around localStorage that returns a default if the user does not have the required item in their localStorage.

```typescript
export const getLocalStorageOrDefault = <T>(
  key: string,
  defaultObject: T,
): T => {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "") as T;
  } catch (e) {
    return defaultObject;
  }
};
```

In my Zustand store I was using the following reducer to get the current theme:

```typescript
const useStore = create<AppState>((set) => ({
  theme: getLocalStorageOrDefault<Theme>("theme", Theme.light),
  // other reducers such as toggleTheme
}));
```

Finally in my ThemeToggle component I was

```tsx
const ThemeToggle = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <>
      {theme === Theme.light ? (
        <StyledDayModeButton
          onClick={toggleTheme}
          color={lightTheme.text}
          title="Toggle Light Mode"
          height="36px"
          width="36px"
        />
      ) : (
        <StyledNightModeButton
          onClick={toggleTheme}
          color={darkTheme.text}
          title="Toggle Dark Mode"
          height="36px"
          width="36px"
        />
      )}
    </>
  );
};
```

The idea was to check if the user has set a theme in localStorage, and if not then use the default light theme.

## The solution

So we want to wait until the client has the site until we check localStorage. How can we do that?

The solution is fairly simple:

```tsx
const ThemeToggle = () => {
  const { theme, toggleTheme } = useStore();

  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  // Otherwise, render the same component as before
};
```

`useEffect` only runs once the site renders on the client, so we wait until that happens. This simple pattern is the solution to a large percentage of Next.js Hydration errors.

I hope this will be useful for someone. Thanks for reading :)
