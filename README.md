# Karen Ono — portfolio

An interactive 3D studio built with React Three Fiber. Scrolling flies a live WebGL camera
through the room chapter by chapter, from the desk to the bookshelf and the pets. Everything is
built procedurally at runtime: the room, furniture, plants, the avatar and the five pets. There
are no 3D models or image assets to download.

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
| `src/content.ts` | All copy, the chapter list, and each chapter's camera pose. Pet names live here too. |
| `src/scroll.ts` | Maps page scroll to a fractional chapter index that the camera reads every frame. |
| `src/ui/` | The HTML layer: header, progress dots and the chapter cards that float over the scene. |
| `src/scene/Scene.tsx` | Canvas, lights (day to evening), camera rig, and where every object sits in the room. |
| `src/scene/Room.tsx` | Floor, walls, window, fairy lights and a wall clock that shows the real time. |
| `src/scene/furniture/` | Desk with its animated monitor, bookshelf, frames, corkboard, globe, cat tree and rug. |
| `src/scene/characters/` | The avatar, a configurable `Cat` (calico, black, Balinese, tabby) and the Shiba. |
| `src/scene/textures.ts` | Canvas-painted textures: wood floor, fur patterns, sticky notes, posters, sky. |

## Customising

- **Add a chapter:** add it to `chapters` in `src/content.ts` with a camera pose, then add a
  `<Chapter>` in `src/ui/Chapters.tsx`. To make an object fly the camera there, wrap it in a
  `<Hotspot>` in `Scene.tsx`.
- **Avatar look:** edit the `look` object at the top of `src/scene/characters/Avatar.tsx`.
- **Pets:** names and descriptions are in `pets` in `src/content.ts`. Coat colours are in `coats`
  in `Cat.tsx`.
