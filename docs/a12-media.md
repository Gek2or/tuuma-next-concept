# A12 media production

Generated with the built-in imagegen tool. No real property photography was used. Empty living reference: `public/art/kalliolinna-a12-empty.webp`.

## Prompt set and provenance

- **Living furnished:** edit the empty living reference. Preserve walls, windows, doorways, kitchen, appliances, floor, ceiling, trees, daylight and camera. Add a modest Nordic linen sofa, rug, coffee table and small oak dining set. Save: `public/art/a12-living-furnished-v2.webp`.
- **Bedroom empty:** a modest Finnish bedroom using the living reference's light oak, white walls and birch surroundings; white built-in wardrobes and a radiator under the window. Save: `public/art/a12-bedroom-empty-v2.webp`.
- **Bedroom furnished:** edit that exact empty bedroom, retaining camera and fixed architecture. Add a bed, linen textiles and bedside tables. Save: `public/art/a12-bedroom-furnished-v2.webp`.
- **Bathroom:** reference the living image's visible warm beige tiled bathroom. Show glass shower, chrome rail, white vanity, toilet and washer connections; no movable furniture. Save: `public/art/a12-bathroom-empty-v2.webp`.
- **Balcony empty:** glazed Finnish apartment balcony, glass/aluminium railing, grey floor and birch trees; no furniture. Save: `public/art/a12-balcony-empty-v2.webp`.
- **Balcony furnished:** edit the exact empty balcony; add two oak chairs with linen cushions and a small table. Preserve all architecture, view and camera. Save: `public/art/a12-balcony-furnished-v2.webp`.
- **Hall:** white entrance door, white built-in storage, oak floor matching the living palette; no movable furniture. Save: `public/art/a12-hall-empty-v2.webp`.
- **Oak texture:** top-down orthographic albedo inspired by the empty living floor, eight oak boards with staggered joints, flat diffuse illumination, no perspective, objects or shadows. Save: `public/art/a12-oak-albedo.webp`.
- **Bathroom tile texture:** warm beige matte porcelain, rectangular horizontal tile bond, fine grout and flat illumination. Save: `public/art/a12-bathroom-tile-albedo.webp`.
- **Linen texture:** neutral greige natural linen weave with no folds or lighting direction. Save: `public/art/a12-linen-albedo.webp`.

All empty/furnished pairs were inspected visually. Exact original empty images are retained. Small generative differences are possible; this workflow is not deterministic photogrammetry. New rooms share the material direction, but are not ray-traced from the interactive model. Final room images are native 1536 × 1024, texture 1254 × 1254. Requested larger output was not returned; files have not been artificially upscaled. WebP quality 94 is used for delivery.

The interactive A12 model uses the three texture assets in its own materials, plus a simple modeled balcony, birch-yard backdrop, window glazing and furnishings. It offers room camera points, mouse/touch look, keyboard look and bounded WASD movement within the current room. This is a real-time concept model rather than a photographic or laser-scanned twin; it must not be described as a measured 360° capture.

## Future actual-property production

Keep an immutable empty room master, camera transform and approved CAD/BIM/GLB model. Render both furnishing states from the same camera and model. Store the empty-master ID, room ID, furniture variant and revision with every derivative. A staff review should reject altered openings, changed cabinetry, obstructed doors and mismatched lighting before publication.
