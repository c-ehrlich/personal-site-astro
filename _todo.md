## TODO

- [ ] Layout animations between index and other pages?
- [ ] revise "content" section
  - [ ] each post gets "type" in frontmatter (talk, video, podcast, writing)
  - [ ] different icons depending on how which it is - like antfu site
    - talk: https://lucide.dev/icons/presentation
    - blog: https://lucide.dev/icons/pen-line - podcast/show: https://lucide.dev/icons/messages-square (maybe?)
    - video: https://lucide.dev/icons/youtube (maybe?)
    - https://github.com/dzeiocom/lucide-astro
- [ ] Add "work" section that includes jobs, oss, projects, etc - or is it "code"?
  - [ ] axiom: talk about how i helped them get an ancient codebase up to modern standards and worked on open source SDKs
  - [ ] moodys: talk about how i implemented typescript and react query, built large internal tools, etc
  - [ ] trpc: talk about how i rewrote the docs to make them more accessible
  - [ ] create-t3-app: im on the core team etc
  - [ ] "small stuff" section at the end... learn order, discord bot, build-react, etc?
- [ ] Write better intro
- [ ] Style code blocks
- [ ] Style blog posts in general
  - [ ] maybe just pay someone to do my tailwind shit?
- [ ] colors: light mode is fine, dark mode needs work

## DONE

- [x] ThemeToggle shouldn't flash in (can we make it part of the initial render?)
- [x] Less obtrusive layout on non-home pages
- [x] Blog becomes Content
- [x] Styling (markdown)
- [x] Logo
  - [x] not working on Vercel
  - [x] not sharp in dev => research image component more or just use a plain img?
- [x] Decide how to make contacts page
- [x] Styling (pages)
- [x] ThemeToggle
  - [x] Get it working
  - [x] Don't animate in on initial page load
  - [x] Get it working without theme flash
  - [x] Get theme colors working
- [x] Favicon
- [x] Fix page titles (shouldn't have to write " - Christopher Ehrlich" all the time)
- [x] rss
  - [x] get rss feed working
  - [x] make rss feed nice
  - [x] order posts by date
