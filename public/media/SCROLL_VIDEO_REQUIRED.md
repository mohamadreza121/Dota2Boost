# Scroll video asset

The cinematic homepage expects these files:

- `public/media/highground-duel-scroll.mp4`
- `public/media/highground-duel-poster.webp`

Use the optimized, silent web export supplied with the implementation rather than the original upload. The export is 1280x720, 24 FPS, about 10 seconds long, and contains frequent keyframes for responsive forward and reverse scroll seeking.

Recommended encoding command:

```bash
ffmpeg -i input.mp4 -an -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart -g 8 -keyint_min 8 -sc_threshold 0 public/media/highground-duel-scroll.mp4
```

After adding or replacing either media asset, commit and push the change so Vercel creates a fresh Preview deployment for the branch.
