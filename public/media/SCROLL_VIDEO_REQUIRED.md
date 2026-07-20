# Scroll video asset

The Dire Forge cinematic homepage expects these files:

- `public/media/dire-forge/dire-forge-scroll.mp4`
- `public/media/dire-forge/dire-forge-poster.webp`
- `public/media/dire-forge/heroes/*.webp`

The supplied scroll sequence is an optimized, silent 1920×1080 export assembled from Valve's official Doom, Shadow Fiend, Ember Spirit, Lina, and Dragon Knight render loops. It runs at 24 FPS, is about 11.6 seconds long, and contains frequent keyframes for responsive forward and reverse seeking.

Recommended encoding command:

```bash
ffmpeg -i input.mp4 -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -g 6 -keyint_min 6 -sc_threshold 0 public/media/dire-forge/dire-forge-scroll.mp4
```

After adding or replacing either media asset, commit and push the change so Vercel creates a fresh Preview deployment for the branch.
