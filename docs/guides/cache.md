---
layout: page
path: /guides/cache.html
---

# Caching

A caching layer is also built in, with support for "russian-doll"
strategies in the view:

```
<article>
  <%= cache(`users/${user.id}`, () => { %>
    <header>
      <h1><%= user.name %></h1>
    </header>
    <main>
      <%= cache(`users/${user.id}/posts`, () => { %>
        <% user.posts.forEach(post => { %>
          <p><%= post.title %></p>
        <% }) %>
      <%= }) %>
    </main>
  <%= }) %>
</article>
```

This `cache` method is provided in the `View` for your convenience, but
you can access the app cache directly using `App.cache`. The method used
in the `cache` helper is `App.cache.fetch`, and is notable because it
first checks if a key is available and uses the cache if so, otherwise
it will call the provided "fresh" method and save that value as the
cache.


