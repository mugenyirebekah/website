# Rebekah Mugenyi — Portfolio Site

Hello world...

## Sidequests page (peel-to-reveal + blog)

`sidequests.html` shows a comic-style "COMING SOON!" poster with a peeling
corner at the top right (`.peel-corner` in `css/style.css`, logic in
`js/main.js` → `initSidequestPeel()`). Click the corner (the bouncing arrow
points at it) and the poster peels away and disappears, revealing a
construction-site panel underneath with a "Blogs" button. Once peeled, it
stays peeled on return visits (remembered via `localStorage`, key
`sidequestsPeeled`) — clear that key in devtools, or open in a private
window, to see the un-peeled state again.

"Blogs" links to `/blog/index.html` — a small Medium-style blog called
**Sidequests**, separate from the main site nav. `blog/index.html` lists
posts; `blog/sidequest-01-blue-leds.html` is a placeholder first post (real
paragraphs, not lorem ipsum — swap in your own). To add a new post, copy
that file, edit the title/body/tags, and add a matching `<a class="blog-card">`
entry in `blog/index.html`. All blog links use normal same-tab navigation.
