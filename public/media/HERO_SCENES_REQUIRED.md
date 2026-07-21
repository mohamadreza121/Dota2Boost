# Hero scene assets

The Dire Forge cinematic homepage expects these files:

- `public/media/dire-forge/scenes/doom.webp`
- `public/media/dire-forge/scenes/shadow-fiend.webp`
- `public/media/dire-forge/scenes/ember-spirit.webp`
- `public/media/dire-forge/scenes/lina.webp`
- `public/media/dire-forge/scenes/dragon-knight.webp`
- `public/media/dire-forge/dire-forge-poster.webp`
- `public/media/dire-forge/heroes/*.webp`

The five 1920×1080 scene layers are optimized, screen-blended WebP derivatives assembled from Valve's official Doom, Shadow Fiend, Ember Spirit, Lina, and Dragon Knight render loops. The homepage crossfades these GPU-friendly layers during scroll instead of repeatedly seeking through a video. This keeps the cinematic direction while removing the decode and random-access work that previously made scrolling feel heavy.

When regenerating a scene, decode the source VP9 alpha channel with `libvpx-vp9`, composite it over black, and export a visually lossless WebP at the same dimensions and composition. Keep each scene small enough to preload without delaying the page.

After adding or replacing a media asset, commit and push the change so Vercel creates a fresh Preview deployment for the branch.
