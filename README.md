# Portfolio

You only edit things in `src/`. Never edit `dist/` (it is rebuilt every time).

## Where to change what

| I want to change...                          | Open this file                          |
|----------------------------------------------|-----------------------------------------|
| Name, intro, email, GitHub, about text       | `src/data/site.js`                      |
| Add / edit a project                         | `src/data/projects.js`                  |
| Add / edit a tool (Canva, Figma, PHP...)     | `src/data/tools.js`                     |
| Titles for design images                     | `src/assets/img/<folder>/titles.json`   |
| Colors, spacing, fonts                       | `src/css/01-base.css` (and the others)  |
| Layout of a section                          | `src/partials/<section>.html`           |

## Image folders with titles

Put images in `src/assets/img/canva/` (any names, any of jpg/png/webp). They show up sorted
1, 2, 3... 10 (numbers sort correctly). Titles go in `titles.json` in the same folder:

    {
      "1": "Birthday poster",
      "2": "Menu design",
      "logo-final": "Logo for my shop"
    }

The key is the file name without the extension. If an image has no title and its name is
not just a number, the name is used (`summer-sale.jpg` becomes "Summer sale").

To give another tool or project a gallery: set `folder: 'figma'` in its data file and create
`src/assets/img/figma/`.

## Run it

- `node build.js` builds once into `dist/`
- `npm run dev` starts http://localhost:3000 (refresh the page after each edit)
- With XAMPP: run `node build.js`, then open http://localhost/portfolionirenz/dist/

Vercel runs the build by itself (`vercel.json`). Just commit and push.
