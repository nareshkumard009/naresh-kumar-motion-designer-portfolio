/**
 * =============================================================================
 * NARESH KUMAR — PORTFOLIO CONFIGURATION DATA
 * =============================================================================
 * 
 * Edit this single file to update your projects, contact info, statistics, 
 * brand logos, testimonials, and showreel without touching any HTML or CSS!
 * 
 * ASSET DIRECTORY GUIDE:
 * - Showreel video:       public/videos/showreel.mp4
 * - Short-form videos:    public/videos/short-01.mp4, short-02.mp4, etc.
 * - Short-form thumbs:    public/thumbnails/short-01.jpg, short-02.jpg, etc.
 * - Long-form videos:     public/videos/long-01.mp4, long-02.mp4, etc.
 * - Long-form thumbs:     public/thumbnails/long-01.jpg, long-02.jpg, etc.
 * - Brand logos (SVG):    public/logos/brand-01.svg, brand-02.svg, etc.
 * - Profile photo:        public/images/profile.jpg
 * 
 * Note: If an asset file is not yet placed, the site automatically displays
 * an elegant cinematic slate placeholder so it never breaks or shows broken icons!
 * =============================================================================
 */

const portfolioData = {
  // ---------------------------------------------------------------------------
  // Personal & Professional Details
  // ---------------------------------------------------------------------------
  personal: {
    name: "Naresh Kumar",
    role: "Video Editor & Motion Designer",
    location: "Hyderabad, India",
    status: "Available for freelance projects",
    coreSkills: "Motion Graphics · Storytelling<br />Color Grading · Sound Design",
    // Replace with your real email and phone number:
    email: "nareshkumard009@gmail.com",
    phone: "+91 9177421780",
    whatsapp: "+91 9177421780",
    whatsappDisplay: "Message me",
    whatsappLink: "https://wa.me/919177421780?text=Hi%20Naresh,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!",
    profileImage: "public/images/profile.jpg",
    fallbackProfileImage: "public/images/placeholder-profile.svg",
    socials: {
      behance: "https://www.behance.net/nareshkumar01",
      linkedin: "https://www.linkedin.com/in/naresh-kumar-b14a202a1/"
    }
  },

  // ---------------------------------------------------------------------------
  // Credibility Statistics (About Section Milestones)
  // ---------------------------------------------------------------------------
  stats: [
    { value: 2, suffix: "+", label: "Years Experience" },
    { value: 25, suffix: "+", label: "Brands" },
    { value: 300, suffix: "+", label: "Videos Edited" }
  ],

  // ---------------------------------------------------------------------------
  // Hero Showreel
  // ---------------------------------------------------------------------------
  showreel: {
    title: "Naresh Kumar — Showreel",
    // Local video path (e.g. "public/videos/showreel.mp4")
    videoUrl: "public/videos/my show reel.mp4",
    // Or set to "youtube" / "vimeo" with an embed URL if preferred:
    videoType: "mp4", // "mp4" | "youtube" | "vimeo"
    embedUrl: "",     // e.g. "https://www.youtube-nocookie.com/embed/YOUR_ID"
    poster: "public/thumbnails/placeholder-long.svg",
    duration: "01:30"
  },

  // ---------------------------------------------------------------------------
  // Brands Marquee (Logos Only — No text names)
  // Replace SVGs in public/logos/brand-01.svg to brand-14.svg
  // ---------------------------------------------------------------------------
  brandsRow1: [
    { id: "b1", logo: "public/logos/brand-01.svg", alt: "Aparna Construction" },
    { id: "b2", logo: "public/logos/brand-02.svg", alt: "8 Views" },
    { id: "b3", logo: "public/logos/brand-03.svg", alt: "E-Infra" },
    { id: "b4", logo: "public/logos/brand-04.svg", alt: "HPS" },
    { id: "b5", logo: "public/logos/brand-05.svg", alt: "AERO" },
    { id: "b6", logo: "public/logos/brand-06.svg", alt: "Brand Client 06" },
    { id: "b7", logo: "public/logos/brand-07.svg", alt: "Brand Client 07" }
  ],
  brandsRow2: [
    { id: "b8", logo: "public/logos/brand-08.svg", alt: "Brand Client 08" },
    { id: "b9", logo: "public/logos/brand-09.svg", alt: "Brand Client 09" },
    { id: "b10", logo: "public/logos/brand-10.svg", alt: "Brand Client 10" },
    { id: "b11", logo: "public/logos/brand-11.svg", alt: "Brand Client 11" },
    { id: "b12", logo: "public/logos/brand-12.svg", alt: "Brand Client 12" },
    { id: "b13", logo: "public/logos/brand-13.svg", alt: "Brand Client 13" },
    { id: "b14", logo: "public/logos/brand-14.svg", alt: "Brand Client 14" }
  ],

  // ---------------------------------------------------------------------------
  // Portfolio Projects (Divided into SHORT-FORM and LONG-FORM)
  // ---------------------------------------------------------------------------
  portfolio: {
    // SHORT-FORM: Instagram Reels, YouTube Shorts, Social Media Videos, Promotional Edits
    shortForm: [
      {
        id: "short-01",
        title: "Choose your Character",
        category: "Instagram Reel",
        aspectRatio: "9:16",
        duration: "0:30",
        thumbnail: "public/thumbnails/short-01.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-short.svg",
        videoUrl: "public/videos/short-01.mp4",
        videoType: "mp4", // "mp4" | "youtube" | "vimeo"
        embedUrl: "",
        description: "A high-energy retro game-inspired edit combining bold typography, dynamic motion graphics, vibrant color grading, and fast-paced visual transitions."
      },
      {
        id: "short-02",
        title: "Product Launch Teaser",
        category: "Promotional Edit",
        aspectRatio: "9:16",
        duration: "0:25",
        thumbnail: "public/thumbnails/short-02.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-short.svg",
        videoUrl: "public/videos/short-02.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Cinematic lighting transitions, 3D title integration, and punchy sound design."
      },
      {
        id: "short-03",
        title: "High-Retention Creator Short",
        category: "YouTube Shorts",
        aspectRatio: "9:16",
        duration: "0:45",
        thumbnail: "public/thumbnails/short-03.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-short.svg",
        videoUrl: "public/videos/short-03.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Engaging hook structure, custom auto-caption animations, sound effects, and micro-zooms."
      },
      {
        id: "short-04",
        title: "Editorial Fashion Reel",
        category: "Social Media",
        aspectRatio: "9:16",
        duration: "0:20",
        thumbnail: "public/thumbnails/short-04.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-short.svg",
        videoUrl: "public/videos/short-04.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Rhythm-driven montage, film grain texture, and high-fashion color treatment."
      },
      {
        id: "short-05",
        title: "Tech SaaS Motion Promo",
        category: "Brand Content",
        aspectRatio: "9:16",
        duration: "0:35",
        thumbnail: "public/thumbnails/short-05.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-short.svg",
        videoUrl: "public/videos/short-05.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Abstract UI animations, vector tracking, and modern electronic pacing."
      },
      {
        id: "short-06",
        title: "Fitness Lifestyle Reel",
        category: "Social Media",
        aspectRatio: "9:16",
        duration: "0:30",
        thumbnail: "public/thumbnails/short-06.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-short.svg",
        videoUrl: "public/videos/short-06.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Speed ramping, sound-synced impact hits, and dynamic typographic tracking."
      },
      {
        id: "short-07",
        title: "Cinematic Travel Montage",
        category: "Travel Reel",
        aspectRatio: "9:16",
        duration: "0:25",
        thumbnail: "public/thumbnails/short-01.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-short.svg",
        videoUrl: "public/videos/short-07.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Atmospheric nature sound design, match cuts, seamless whip pans, and organic film emulation color grading."
      },
      {
        id: "short-08",
        title: "Commercial Streetwear Drop",
        category: "Brand Promo",
        aspectRatio: "9:16",
        duration: "0:30",
        thumbnail: "public/thumbnails/short-02.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-short.svg",
        videoUrl: "public/videos/short-08.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Bass-heavy rhythmic cutdowns, kinetic typography tracking, glitch transitions, and high-contrast color palette."
      }
    ],

    // LONG-FORM: YouTube videos, Explainer videos, Documentary-style edits, Interviews
    longForm: [
      {
        id: "long-01",
        title: "Documentary: The Creative Mindset",
        category: "Documentary-Style",
        aspectRatio: "16:9",
        duration: "14:20",
        thumbnail: "public/thumbnails/long-01.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-long.svg",
        videoUrl: "public/videos/long-01.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Intimate pacing, multi-source archival footage treatment, cinematic score synchronization, and bespoke title cards."
      },
      {
        id: "long-02",
        title: "Explainer: The Future of Spatial Tech",
        category: "Explainer Video",
        aspectRatio: "16:9",
        duration: "09:45",
        thumbnail: "public/thumbnails/long-02.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-long.svg",
        videoUrl: "public/videos/long-02.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Visual metaphors, 2D motion graphics breakdown, split-screens, and custom data overlays."
      },
      {
        id: "long-03",
        title: "Founder Spotlight: Scaling Startups",
        category: "Interviews",
        aspectRatio: "16:9",
        duration: "18:10",
        thumbnail: "public/thumbnails/long-03.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-long.svg",
        videoUrl: "public/videos/long-03.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Three-camera angle switching, audio cleanup, dynamic lower-thirds, and b-roll narrative weave."
      },
      {
        id: "long-04",
        title: "YouTube Feature: Cinematic Journey",
        category: "YouTube Video",
        aspectRatio: "16:9",
        duration: "11:35",
        thumbnail: "public/thumbnails/long-04.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-long.svg",
        videoUrl: "public/videos/long-04.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Story-first long-form pacing, atmospheric soundscapes, and color grading in DaVinci Resolve."
      },
      {
        id: "long-05",
        title: "Brand Film: Studio Craft & Heritage",
        category: "Brand Documentary",
        aspectRatio: "16:9",
        duration: "08:45",
        thumbnail: "public/thumbnails/long-05.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-long.svg",
        videoUrl: "public/videos/long-05.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Rich cinematic narrative pacing, macro footage treatment, tailored color palette in DaVinci Resolve, and immersive soundscapes."
      },
      {
        id: "long-06",
        title: "Video Essay: The Art of Visual Storytelling",
        category: "Video Essay",
        aspectRatio: "16:9",
        duration: "16:20",
        thumbnail: "public/thumbnails/long-06.jpg",
        fallbackThumbnail: "public/thumbnails/placeholder-long.svg",
        videoUrl: "public/videos/long-06.mp4",
        videoType: "mp4",
        embedUrl: "",
        description: "Kinetic title sequencing, multi-camera audio mastering, archival motion design, and rhythmic documentary flow."
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // SECTION 04 // RAW → FINAL INTERACTIVE COMPARISON SLIDER
  // ---------------------------------------------------------------------------
  // Drag the vertical slider left & right to reveal the transformation from
  // raw camera/LOG capture to the finished cinematic color grade and master.
  // 1. Place your RAW camera video in "public/videos/raw video.mp4"
  // 2. Place your Final color-graded video in "public/videos/final output.mp4"
  // (Both videos should ideally have matching timing/duration for perfect lockstep sync).
  rawFinal: {
    tag: "04 // The Edit Process",
    title: 'RAW <span class="rf-title-arrow">→</span> FINAL',
    subtitle: "From raw footage to a refined visual experience.",
    rawVideo: "public/videos/raw video.mp4",
    finalVideo: "public/videos/final output.mp4",
    aspectRatio: "9:16"
  },

  // ---------------------------------------------------------------------------
  // Contact & Booking Settings (Opens blank email with no pre-written subject or body)
  // ---------------------------------------------------------------------------
  booking: {
    subject: "",
    body: ""
  }
};

// Make accessible globally
window.portfolioData = portfolioData;
