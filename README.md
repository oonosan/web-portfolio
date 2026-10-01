# Karen Ono — portfolio

Portfolio of Karen Ono, AI Discovery & Prototyping Consultant, built as an interactive 3D studio.

The page is a pastel isometric room: Karen at her desk, plants, a bookshelf and the studio crew
(one Shiba and four cats). Scrolling flies a live WebGL camera through the room one chapter at a
time, and each chapter is anchored to an object in it. Everything is built procedurally at
runtime with no 3D models or image assets.

## Chapters

| Chapter | Where the camera goes |
| --- | --- |
| Home | Isometric view of the whole studio |
| What I do | The desk: Karen typing, with code and a prototype building themselves on the monitor |
| Domains | The spinning globe on the windowsill |
| Impact | Three framed posters above the desk |
| Toolkit | The corkboard, with a sticky note for each tool |
| Background | The bookshelf; the book spines show past companies and stack |
| The crew | The pets on the rug, the desk, the bookshelf and the cat tree |
| Contact | The camera pulls back and the studio shifts into evening: fairy lights on, desk lamp glowing |

## Things to try

- **Click furniture** (desk, globe, frames, corkboard, bookshelf, rug) to fly to its chapter.
- **Hover a pet or Karen** to see a name tag.
- **Click a pet or Karen** to get a reaction:
  - Karen turns around and waves.
  - Momo wakes up and wags.
  - The cats hop.
- **Look for little details:** the wall clock shows your real local time, steam rises from the
  mug, and dust drifts in the window light.

## The crew

| Name | Who | Where to find them |
| --- | --- | --- |
| Momo | Shiba Inu | Asleep in the mint bed on the rug |
| Airi | Calico | Loafing on the desk next to the monitor |
| Taka | Black cat | On top of the bookshelf, tail hanging down |
| Tabi | Siamese Balinese | On the cat tree by the window |
| Kiki | Tabby | Batting a ball of yarn across the rug |

## Design

- **Palette:** pastel lavender, pink, mint, butter, sky and peach, with soft rounded walls and
  base. Scene colours live in `src/scene/palette.ts` and page colours in the `@theme` block of
  `src/styles.css`.
- **Type:** [Fredoka](https://fonts.google.com/specimen/Fredoka) for headings and
  [Nunito](https://fonts.google.com/specimen/Nunito) for body text.
- **Responsive layout:** on desktop the text cards float on the left and the room shifts right.
  On portrait screens the room sits in the top half and the cards rise from below.
- **Reduced motion:** with `prefers-reduced-motion`, the camera snaps between chapters instead of
  easing.

## Stack

[Vite](https://vite.dev), [React](https://react.dev),
[React Three Fiber](https://r3f.docs.pmnd.rs) with
[drei](https://github.com/pmndrs/drei), and [Tailwind CSS](https://tailwindcss.com) v4. The 3D scene is a lazily loaded chunk, so the text
appears before the room finishes loading.

## Run it

```bash
npm install
npm start          # dev server on http://localhost:4200
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build on http://localhost:4300
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/content.ts` | All copy, the chapter list with each chapter's camera pose, and the pets |
| `src/scroll.ts` | Maps page scroll to a fractional chapter index that the camera reads every frame |
| `src/ui/` | The HTML layer: header, progress dots and the chapter cards over the scene |
| `src/scene/Scene.tsx` | Canvas, day-to-evening lighting, camera rig, and where everything sits in the room |
| `src/scene/Room.tsx` | Floor, walls, window, fairy lights and the wall clock |
| `src/scene/furniture/` | Desk and animated monitor, bookshelf, frames, corkboard, globe, cat tree, rug |
| `src/scene/characters/` | Karen's avatar, a configurable `Cat` and the Shiba |
| `src/scene/plants.tsx` | Potted, trailing and hanging plants that sway |
| `src/scene/textures.ts` | Canvas-painted textures: wood floor, fur, sticky notes, posters, sky, globe |

## Customising

- **Copy:** edit `src/content.ts`. The sticky notes, posters and book spines in the room read
  from it too.
- **Add a chapter:**
  1. Add the chapter and its camera pose to `chapters` in `src/content.ts`.
  2. Add a `<Chapter>` in `src/ui/Chapters.tsx`.
  3. To make an object fly the camera there, wrap that object in a `<Hotspot>` in `Scene.tsx`.
- **Avatar:** edit the `look` object at the top of `src/scene/characters/Avatar.tsx` (skin, hair,
  sweater, headphones).
- **Pets:** names and descriptions are in `pets` in `src/content.ts`. Coat colours are in `coats`
  in `src/scene/characters/Cat.tsx`.
