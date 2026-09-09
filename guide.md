# matuz.dev — Starter

> A personal website, portfolio, playground, and eventually a small corner of the internet that is entirely mine.

This file is a **self-orientation guide** for building `matuz.dev`. It is intentionally not a rigid specification. The site should be able to evolve as ideas change.

---

## 1. Vision

`matuz.dev` should be more than a résumé.

The main site should present me as a **full-stack developer**, showcase my projects and skills, provide social/contact links, and eventually host a collection of casual public notes.

At the same time, the domain should be flexible enough to contain experiments and fun projects:

- `matuz.dev/`
- `matuz.dev/about`
- `matuz.dev/projects`
- `matuz.dev/contact`
- `matuz.dev/notes`
- `matuz.dev/lol`
- `matuz.dev/lab`
- `matuz.dev/experiments`
- Anything else that makes sense later

The professional areas should remain polished and reliable. The experimental areas can be weird, playful, or technically unnecessary.

**Core idea:** a polished developer portfolio with a personal playground attached to it.

---

## 2. Initial Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion / Framer Motion
- Lucide React
- React Router

### Content

- Markdown initially
- `remark` / `rehype` ecosystem as needed
- `react-markdown` initially
- Consider MDX later if interactive/custom content becomes useful

### Deployment

- Heroku
- GitHub
- GitHub → Heroku deployment

### Not planned initially

Avoid adding infrastructure just for the sake of showing infrastructure.

No initial need for:

- Redux
- Zustand
- Express/Fastify
- Prisma
- PostgreSQL
- Authentication
- CMS
- GraphQL
- Microservices
- Docker Compose
- HTMX alongside React
- Next.js purely because it is popular

If a real requirement appears later, add the technology then.

---

## 3. Why React Instead of HTMX?

HTMX is interesting, but it does not fit the main goal particularly well.

The portfolio is intended to showcase modern frontend/full-stack skills, and React + TypeScript gives the project a natural foundation for:

- component architecture
- animations
- interactive UI
- reusable components
- client-side routing
- API integrations
- dynamic content

HTMX could make sense for a server-rendered application, but adding it to this React project would mostly add complexity without solving a current problem.

**Decision for now: React + TypeScript, no HTMX.**

---

## 4. Site Structure

### Professional / Main Site

```text
/
├── Home
├── About
├── Projects
├── Contact
└── Notes
```

### Playground

```text
/lol
/lab
/experiments
/...
```

The playground should not be constrained by the portfolio's professional structure.

---

## 5. Homepage

The homepage should primarily sell **me as a developer**, not function as a résumé dump.

Possible content:

1. Hero / introduction
2. Short description of what I build
3. Selected projects
4. Technology/toolkit section
5. Social links
6. Notes / recent thoughts
7. Footer

Avoid generic portfolio copy such as:

> Hello, I'm John. I'm a passionate developer who loves solving problems.

The copy should feel personal and concise.

---

## 6. Projects

Projects should be represented as data rather than hard-coded directly into page JSX.

Example concept:

```ts
{
  title: "...",
  description: "...",
  technologies: [...],
  github: "...",
  demo: "...",
  image: "...",
}
```

This makes it easy to add, remove, reorder, or redesign projects later.

Project cards should be visually polished and interactive without becoming distracting.

Possible interactions:

- hover effects
- subtle movement
- image transitions
- technology badges
- GitHub/demo links
- expandable details
- page transitions

---

## 7. About

The About page should explain who I am as a developer and what I like building.

Potential topics:

- Full-stack development
- Technologies I enjoy
- Engineering interests
- Current projects
- Things I'm learning
- Personal interests where appropriate

Keep it human rather than turning it into a second résumé.

---

## 8. Contact / Socials

Include relevant ways to find/contact me.

Possible links:

- GitHub
- Discord
- LinkedIn
- Email
- Other social platforms if useful

The contact page should remain simple and reliable.

A real contact form can be added later if there is a reason to have one.

---

## 9. Technology / Toolkit Section

The site should show the technologies I work with, but avoid making it look like a giant wall of logos.

Possible categories:

### Languages

- TypeScript
- JavaScript
- SQL

### Frontend

- React
- Next.js
- Tailwind CSS
- MUI

### Backend / Data

- Node.js
- PostgreSQL
- Prisma
- Supabase

### Tools / Environment

- Git
- Docker
- Linux
- NixOS

The exact list can change.

### Visual idea

Technology icons can be interactive.

For example, hovering a technology could reveal:

```text
TypeScript

My primary language for
application development.
```

Primary technologies can receive more visual emphasis than technologies I only occasionally use.

---

## 10. Notes System

The notes section is **not intended to be a traditional blog**.

It should be a place for casual public writing:

- things I learned
- recommendations
- random thoughts
- technical notes
- opinions
- things I like
- tutorials or explanations
- media recommendations
- general yapping

The content should be written as Markdown and stored in a **separate Git repository**.

### Intended flow

```text
Separate notes repository
        ↓
Markdown files
        ↓
Website build/content loader
        ↓
Markdown parser
        ↓
React-rendered notes
```

The main website repository should not need to contain all note content.

### Possible notes repository

```text
notes/
├── README.md
├── notes/
│   ├── nixos.md
│   ├── things-i-like.md
│   ├── random-thought.md
│   └── ...
└── images/
    ├── something.png
    └── ...
```

Example:

```md
# Something I Like

This is a random thing I discovered.

![Cool image](../images/cool.png)

I also really liked this video:

[YouTube](https://youtube.com/...)
```

The website should turn this into a polished reading experience.

### Markdown → MDX later

Start with ordinary Markdown.

If notes eventually need interactive components, custom embeds, code playgrounds, or other React components, consider migrating to MDX.

Do not introduce MDX just because it is technically cool.

---

## 11. Visual Direction

The site should be:

- Modern
- Polished
- Dark-oriented
- Clean
- Reliable
- Slightly futuristic
- Interactive
- Not extravagant

A background image will be used as part of the visual identity.

The plan is to generate an **abstract, modern AI-generated background** rather than use a generic stock image.

The background should support the interface rather than compete with it.

### Background principles

- abstract rather than literal
- dark enough for readable text
- visually interesting at large resolutions
- subtle enough for UI elements to remain dominant
- preferably with areas of lower visual complexity behind text
- avoid excessive "AI art" appearance

Think of the background as atmosphere, not the centerpiece.

---

## 12. UI / Buttons

Buttons should look modern but dependable.

Avoid:

- excessive glassmorphism
- huge glowing borders
- unnecessary gradients everywhere
- extreme neon effects
- animations that make basic navigation annoying

Prefer:

- good spacing
- clear hierarchy
- subtle shadows
- restrained gradients
- tasteful hover states
- consistent border radius
- strong typography
- obvious interactive states

The design should communicate:

> "This is a serious website that happens to be fun."

rather than:

> "Look how many CSS effects I know."

---

## 13. Animation

Animation is important, but should serve the design.

Potential uses:

- page transitions
- hero entrance animations
- subtle text reveals
- project-card hover movement
- image transitions
- button micro-interactions
- scrolling effects
- technology icon reactions
- subtle background movement

Avoid animating everything.

The desired reaction is:

> "Damn, this is polished."

Not:

> "Why is the website fighting me?"

---

## 14. Possible Advanced Flex: WebGL

Potential future addition:

- Three.js
- React Three Fiber

A small WebGL element could be used as a visual accent or interactive object.

Do **not** turn the portfolio into a 3D showcase just to demonstrate Three.js.

Only add it if it improves the design.

This is a **Phase 2+ idea**.

---

## 15. Architecture Philosophy

Keep the project easy to change.

Possible initial structure:

```text
matuz.dev/
├── src/
│   ├── components/
│   ├── pages/
│   ├── data/
│   │   ├── projects.ts
│   │   └── technologies.ts
│   ├── lib/
│   ├── hooks/
│   ├── notes/
│   ├── styles/
│   └── main.tsx
├── public/
├── package.json
├── vite.config.ts
└── ...
```

The exact structure can change as the application grows.

Prefer simple, obvious architecture over abstractions created before they are needed.

---

## 16. GitHub

The source code should be public.

The repository itself should therefore also be treated as a portfolio piece.

Things worth demonstrating naturally through the project:

- TypeScript
- React component architecture
- clean Git history
- reusable components
- responsive design
- accessibility
- testing where useful
- CI/CD
- deployment
- documentation
- sensible dependency choices

Do not artificially add complexity just to make the repository look impressive.

---

## 17. Deployment

Initial deployment target:

**Heroku**

Possible flow:

```text
Local development
      ↓
GitHub
      ↓
Heroku
      ↓
matuz.dev
```

Heroku is acceptable even though other static hosting platforms may be simpler.

If Heroku becomes inconvenient later, deployment can be reconsidered without changing the frontend architecture.

---

## 18. Potential Future Features

Ideas, not requirements:

- GitHub API integration
- dynamically displaying repositories
- project statistics
- contact form
- guestbook
- interactive playground
- WebGL visual
- custom `/lol` page
- mini games
- developer tools
- interactive experiments
- RSS feed for notes
- search for notes
- tags/categories for notes
- syntax-highlighted code blocks
- YouTube embeds
- image galleries
- custom Markdown components

Only build these when they actually become interesting.

---

## 19. Development Phases

### Phase 1 — Foundation

- [ ] Initialize React + TypeScript + Vite
- [ ] Configure Tailwind
- [ ] Configure routing
- [ ] Establish typography
- [ ] Establish color palette
- [ ] Establish spacing/layout system
- [ ] Create reusable buttons/components
- [ ] Add background image
- [ ] Build responsive shell/navigation

### Phase 2 — Main Pages

- [ ] Home
- [ ] About
- [ ] Projects
- [ ] Contact
- [ ] Footer
- [ ] Social links

### Phase 3 — Visual Polish

- [ ] Page transitions
- [ ] Hero animations
- [ ] Project-card interactions
- [ ] Technology icon interactions
- [ ] Responsive/mobile polish
- [ ] Accessibility pass
- [ ] Performance pass

### Phase 4 — Notes

- [ ] Create separate notes repository
- [ ] Define Markdown format
- [ ] Load notes during build
- [ ] Render Markdown
- [ ] Add images
- [ ] Add links
- [ ] Add YouTube embeds
- [ ] Create notes index
- [ ] Create individual note pages

### Phase 5 — Deployment

- [ ] Connect GitHub
- [ ] Configure Heroku
- [ ] Configure environment variables if needed
- [ ] Configure domain
- [ ] Test production build
- [ ] Test mobile
- [ ] Test accessibility
- [ ] Deploy

### Phase 6 — Playground

- [ ] `/lol`
- [ ] `/lab`
- [ ] `/experiments`
- [ ] Other weird/fun ideas

---

## 20. Design Rule

When deciding whether to add something, ask:

1. Does it improve the experience?
2. Does it make the site more memorable?
3. Does it demonstrate a useful skill naturally?
4. Does it remain fast and reliable?
5. Is it actually fun to build?

If the answer is mostly "no", don't add it.

---

## 21. Current Direction

### Identity

**Matuz — Full-stack developer**

### Website

**matuz.dev**

### Personality

Professional core + personal playground.

### Visual

Modern + polished + dark + abstract + subtly futuristic.

### Interaction

Animated and responsive, but restrained.

### Content

Projects + About + Contact + casual Markdown notes.

### Content source

Separate Git repository for notes.

### Main stack

**React + TypeScript + Vite + Tailwind + Motion**

### Deployment

**Heroku**

### Philosophy

> Build something useful, make it look damn good, and leave room to have fun with it.
