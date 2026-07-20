# Media attribution

## User-supplied Dota-themed visual layers

The visual-overhaul branch includes optimized derivatives of artwork supplied directly by the project owner in July 2026:

- `public/media/dota/legacy-battle.webp` from `470662.jpg`
- `public/media/dota/hero-mosaic.webp` from `429385.png`
- `public/media/dota/vengeful-wall.webp` from `508437.jpg`

These files are used as cinematic section artwork. The project owner must confirm that production usage rights cover each supplied image before commercial launch; otherwise replace them with licensed or original equivalents.

## Original campaign map

`public/media/dota/campaign-map.webp` was generated specifically for this project with OpenAI image generation. It depicts an original, top-down three-lane fantasy arena in an old-school strategy-map style. The prompt deliberately excluded copied maps, logos, interface elements, text, and recognizable game characters. Review the final asset as part of the normal commercial-rights and brand review before launch.

The Herald-through-Immortal medal files in `public/media/ranks` are the Dota 2 rank medal assets distributed in the MIT-licensed [OpenDota web repository](https://github.com/odota/web/tree/b308436d5f5fa300deaafcef15c3d9155a104f44/public/assets/images/dota2/rank_icons). The source revision is pinned for reproducibility.

Dota, Dota 2, Steam, the Dota 2 rank names, and the medal artwork are trademarks or property of Valve Corporation. Their inclusion identifies rank selections and does not imply sponsorship or endorsement. Confirm production usage rights with counsel before accepting payments.

## The Dire Forge hero media

The homepage uses optimized derivatives of official Dota 2 hero render loops distributed from Valve's public Steam CDN. The source loops were downloaded on July 20, 2026:

- Doom: `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/doom_bringer.webm`
- Shadow Fiend: `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/nevermore.webm`
- Ember Spirit: `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/ember_spirit.webm`
- Lina: `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/lina.webm`
- Dragon Knight: `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/dragon_knight.webm`

The five loops were normalized, arranged into a silent 1920×1080 scroll-seek sequence, and encoded with frequent keyframes as `public/media/dire-forge/dire-forge-scroll.mp4`. Static WebP derivatives provide the poster and service-card art in `public/media/dire-forge`.

These files identify authentic Dota 2 heroes and do not imply sponsorship, endorsement, or affiliation. Valve owns the characters and original renders. The footer retains an explicit non-affiliation notice. Because this is a commercial service, confirm that production usage complies with Valve's current asset, fan-content, trademark, and game-service policies before accepting payments.

The older battlefield stills and loops elsewhere in `public/media` are original, MOBA-inspired project artwork and do not contain Valve game footage, hero portraits, logos, or UI captures.
