# Asset Replacement Guide for Naresh Kumar

This guide makes it straightforward to replace the placeholder assets with your actual videos, thumbnails, client brand logos, and portrait.

---

### 1. Showreel Video
- **Primary file**: `public/videos/showreel.mp4`
- **Thumbnail / Poster**: `public/thumbnails/showreel-poster.jpg`
- **YouTube/Vimeo Embed Option**: If you prefer streaming embeds, open `js/portfolio-data.js`, set `videoType: "youtube"` or `"vimeo"`, and paste your embed link in `embedUrl`.

---

### 2. Short-Form Portfolio (Vertical 9:16 / Reels / Shorts)
- **Videos**: Place in `public/videos/` as:
  - `short-01.mp4`
  - `short-02.mp4`
  - `short-03.mp4`
  - `short-04.mp4`
  - `short-05.mp4`
  - `short-06.mp4`
- **Thumbnails**: Place in `public/thumbnails/` as:
  - `short-01.jpg`
  - `short-02.jpg`
  - `short-03.jpg`
  - `short-04.jpg`
  - `short-05.jpg`
  - `short-06.jpg`

---

### 3. Long-Form Portfolio (Widescreen 16:9 / YouTube / Documentaries)
- **Videos**: Place in `public/videos/` as:
  - `long-01.mp4`
  - `long-02.mp4`
  - `long-03.mp4`
  - `long-04.mp4`
  - `long-05.mp4`
  - `long-06.mp4`
- **Thumbnails**: Place in `public/thumbnails/` as:
  - `long-01.jpg`
  - `long-02.jpg`
  - `long-03.jpg`
  - `long-04.jpg`
  - `long-05.jpg`
  - `long-06.jpg`

---

### 4. Brands I've Worked With (Logos Only)
- Replace vector logos in `public/logos/` as:
  - `brand-01.svg` to `brand-10.svg`
- Transparent SVG files with white/light monotone fills or strokes look best in the marquee.

---

### 5. About Me Photo
- Place your photo at `public/images/profile.jpg` (recommended: high-contrast portrait or editorial shot, 4:5 or 3:4 aspect ratio).

---

### 6. Updating Information & Details
All titles, descriptions, social links (Behance, LinkedIn), email, phone, WhatsApp, and testimonials can be modified in **`js/portfolio-data.js`**. You don't have to touch any HTML code!
