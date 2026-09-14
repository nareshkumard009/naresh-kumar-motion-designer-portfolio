/**
 * =============================================================================
 * NARESH KUMAR — PORTFOLIO MAIN INTERACTIVE SCRIPT
 * =============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure portfolio data is loaded
  const data = window.portfolioData;
  if (!data) {
    console.error("portfolioData configuration not found!");
    return;
  }

  // State
  let currentCategory = "shortForm"; // 'shortForm' | 'longForm'
  let activeModalProject = null;

  // DOM Elements
  const navbar = document.querySelector(".navbar");
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileDrawer = document.querySelector(".mobile-drawer");
  const navLinks = document.querySelectorAll(".nav-link");
  const tabShortBtn = document.getElementById("tab-short");
  const tabLongBtn = document.getElementById("tab-long");
  const portfolioGrid = document.getElementById("portfolio-grid");
  const videoModal = document.getElementById("video-modal");
  const modalContainer = document.getElementById("modal-media-slot");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const bookMeBtns = document.querySelectorAll(".btn-book-me-action");

  // ===========================================================================
  // 1. NAVIGATION & SCROLL TRACKING
  // ===========================================================================

  // Sticky Navbar blur and background transition
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.style.backgroundColor = "rgba(10, 11, 14, 0.96)";
      navbar.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.5)";
    } else {
      navbar.style.backgroundColor = "rgba(10, 11, 14, 0.85)";
      navbar.style.boxShadow = "none";
    }
  });

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.contains("open");
      if (isOpen) {
        mobileDrawer.classList.remove("open");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      } else {
        mobileDrawer.classList.add("open");
        mobileToggle.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });

    // Close mobile drawer on link click
    mobileDrawer.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // Active Nav Link Spy using IntersectionObserver
  const sections = document.querySelectorAll("section[id]");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));

  // ===========================================================================
  // 1.5 GLOBAL UTILITIES
  // ===========================================================================
  // Helper to format seconds into mm:ss format
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ===========================================================================
  // 2. HERO SHOWREEL VIDEO & CONTROLS (AUTOPLAY MUTED LOOP WITH MINIMAL CONTROLS)
  // ===========================================================================
  const showreelFrame = document.getElementById("showreel-frame");
  const showreelVideo = document.getElementById("showreel-video");
  const showreelPlayBtn = document.getElementById("showreel-ctrl-play");
  const showreelSoundBtn = document.getElementById("showreel-ctrl-sound");
  const showreelFullscreenBtn = document.getElementById("showreel-ctrl-fullscreen");
  const showreelTimelineWrap = document.getElementById("showreel-timeline-wrap");
  const showreelTimelineProgress = document.getElementById("showreel-timeline-progress");
  const showreelTimelineThumb = document.getElementById("showreel-timeline-thumb");
  const showreelTimeCurrent = document.getElementById("showreel-time-current");
  const showreelTimeTotal = document.getElementById("showreel-time-total");

  const getShowreelProject = () => ({
    id: "showreel",
    title: (data.showreel && data.showreel.title) || "Naresh Kumar — Showreel",
    category: "Showreel • 4K Master",
    aspectRatio: "16:9",
    duration: (data.showreel && data.showreel.duration) || "01:30",
    thumbnail: (data.showreel && data.showreel.poster) || "public/thumbnails/showreel-poster.jpg",
    fallbackThumbnail: "public/thumbnails/showreel-poster.jpg",
    videoUrl: (data.showreel && data.showreel.videoUrl) || "public/videos/showreel.mp4",
    videoType: (data.showreel && data.showreel.videoType) || "mp4",
    embedUrl: (data.showreel && data.showreel.embedUrl) || "",
    description: "Naresh Kumar • Motion Design & Video Editing Master Showreel"
  });

  const showreelBigPlayBtn = document.getElementById("showreel-big-play");

  if (showreelVideo) {
    // Keep paused initially with poster thumbnail
    showreelVideo.muted = true;
    showreelVideo.pause();

    // Sound icons & helpers
    const iconMuted = showreelSoundBtn ? showreelSoundBtn.querySelector(".icon-muted") : null;
    const iconUnmuted = showreelSoundBtn ? showreelSoundBtn.querySelector(".icon-unmuted") : null;

    const updateShowreelSoundIcons = () => {
      if (!showreelSoundBtn) return;
      if (showreelVideo.muted) {
        if (iconMuted) iconMuted.style.display = "block";
        if (iconUnmuted) iconUnmuted.style.display = "none";
        showreelSoundBtn.setAttribute("aria-label", "Unmute showreel");
      } else {
        if (iconMuted) iconMuted.style.display = "none";
        if (iconUnmuted) iconUnmuted.style.display = "block";
        showreelSoundBtn.setAttribute("aria-label", "Mute showreel");
      }
    };

    const unmuteShowreel = () => {
      // Mute all portfolio card videos so only showreel plays sound
      if (portfolioGrid) {
        portfolioGrid.querySelectorAll(".card-video").forEach((v) => {
          v.muted = true;
          const otherSoundBtn = v.closest(".portfolio-card")?.querySelector(".ctrl-sound");
          if (otherSoundBtn) {
            const om = otherSoundBtn.querySelector(".icon-muted");
            const ou = otherSoundBtn.querySelector(".icon-unmuted");
            if (om) om.style.display = "block";
            if (ou) ou.style.display = "none";
          }
        });
      }

      // Mute RAW/FINAL comparison video if unmuted
      const rfVideoFinal = document.getElementById("rf-video-final");
      const rfVideoRaw = document.getElementById("rf-video-raw");
      if (rfVideoFinal && !rfVideoFinal.muted) {
        rfVideoFinal.muted = true;
        if (rfVideoRaw) rfVideoRaw.muted = true;
        const rfSoundBtn = document.getElementById("rf-ctrl-sound");
        if (rfSoundBtn) {
          const rfm = rfSoundBtn.querySelector(".icon-muted");
          const rfu = rfSoundBtn.querySelector(".icon-unmuted");
          if (rfm) rfm.style.display = "block";
          if (rfu) rfu.style.display = "none";
        }
      }

      showreelVideo.muted = false;
      showreelVideo.volume = 1;
      updateShowreelSoundIcons();
    };

    const muteShowreel = () => {
      showreelVideo.muted = true;
      updateShowreelSoundIcons();
    };

    // Play / Pause Toggle
    if (showreelPlayBtn || showreelBigPlayBtn || showreelFrame) {
      const iconPause = showreelPlayBtn ? showreelPlayBtn.querySelector(".icon-pause") : null;
      const iconPlay = showreelPlayBtn ? showreelPlayBtn.querySelector(".icon-play") : null;

      const updateShowreelPlayIcons = () => {
        if (showreelVideo.paused) {
          if (iconPause) iconPause.style.display = "none";
          if (iconPlay) iconPlay.style.display = "block";
          if (showreelPlayBtn) showreelPlayBtn.setAttribute("aria-label", "Play showreel");
          if (showreelFrame) showreelFrame.classList.remove("is-playing");
        } else {
          if (iconPause) iconPause.style.display = "block";
          if (iconPlay) iconPlay.style.display = "none";
          if (showreelPlayBtn) showreelPlayBtn.setAttribute("aria-label", "Pause showreel");
          if (showreelFrame) showreelFrame.classList.add("is-playing");
        }
      };

      const toggleShowreelPlay = (e) => {
        if (e) e.stopPropagation();
        if (showreelVideo.paused) {
          // When clicking play, unmute the showreel
          unmuteShowreel();
          const playPromise = showreelVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Fallback to muted playback if browser restricts unmuted autoplay
              showreelVideo.muted = true;
              updateShowreelSoundIcons();
              showreelVideo.play().catch(() => {});
            });
          }
        } else {
          showreelVideo.pause();
        }
        updateShowreelPlayIcons();
      };

      if (showreelPlayBtn) {
        showreelPlayBtn.addEventListener("click", toggleShowreelPlay);
      }
      if (showreelBigPlayBtn) {
        showreelBigPlayBtn.addEventListener("click", toggleShowreelPlay);
      }
      if (showreelFrame) {
        showreelFrame.addEventListener("click", (e) => {
          if (!e.target.closest(".card-video-controls")) {
            toggleShowreelPlay(e);
          }
        });
      }

      showreelVideo.addEventListener("play", updateShowreelPlayIcons);
      showreelVideo.addEventListener("pause", updateShowreelPlayIcons);
      updateShowreelPlayIcons();
    }

    // Sound On / Off Toggle (Mute/Unmute button)
    if (showreelSoundBtn) {
      showreelSoundBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (showreelVideo.muted) {
          unmuteShowreel();
        } else {
          muteShowreel();
        }
      });
    }

    showreelVideo.addEventListener("volumechange", updateShowreelSoundIcons);
    updateShowreelSoundIcons();

    // Timeline Scroller (Seek & Drag Scrubbing)
    if (showreelTimelineWrap) {
      const timelineTrack = showreelTimelineWrap.querySelector(".timeline-track");
      let isDragging = false;
      let wasPausedBeforeDrag = false;

      const updateTimelineUI = (currentTime, duration) => {
        if (isNaN(currentTime)) return;
        const validDuration = duration && !isNaN(duration) && duration > 0 ? duration : 0;
        const pct = validDuration > 0 ? Math.min(Math.max((currentTime / validDuration) * 100, 0), 100) : 0;

        if (showreelTimelineProgress) showreelTimelineProgress.style.width = `${pct}%`;
        if (showreelTimelineThumb) showreelTimelineThumb.style.left = `${pct}%`;
        if (showreelTimeCurrent) showreelTimeCurrent.textContent = formatTime(currentTime);
        if (showreelTimeTotal && validDuration > 0) {
          showreelTimeTotal.textContent = ` / ${formatTime(validDuration)}`;
        }
        showreelTimelineWrap.setAttribute("aria-valuenow", Math.round(pct));
      };

      showreelVideo.addEventListener("timeupdate", () => {
        if (!isDragging) {
          updateTimelineUI(showreelVideo.currentTime, showreelVideo.duration);
        }
      });

      showreelVideo.addEventListener("loadedmetadata", () => {
        if (showreelTimeTotal && showreelVideo.duration > 0) {
          showreelTimeTotal.textContent = ` / ${formatTime(showreelVideo.duration)}`;
        }
        updateTimelineUI(showreelVideo.currentTime, showreelVideo.duration);
      });

      const seekFromPointer = (e) => {
        const rect = (timelineTrack || showreelTimelineWrap).getBoundingClientRect();
        if (rect.width <= 0) return;
        const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const pct = offsetX / rect.width;
        const duration = showreelVideo.duration || 0;
        const targetTime = pct * duration;

        if (showreelTimelineProgress) showreelTimelineProgress.style.width = `${pct * 100}%`;
        if (showreelTimelineThumb) showreelTimelineThumb.style.left = `${pct * 100}%`;
        if (showreelTimeCurrent) showreelTimeCurrent.textContent = formatTime(targetTime);

        if (duration > 0 && !isNaN(targetTime) && isFinite(targetTime)) {
          showreelVideo.currentTime = targetTime;
        }
      };

      showreelTimelineWrap.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        showreelTimelineWrap.classList.add("is-dragging");
        try {
          showreelTimelineWrap.setPointerCapture(e.pointerId);
        } catch (err) {}

        wasPausedBeforeDrag = showreelVideo.paused;
        seekFromPointer(e);

        const onPointerMove = (moveEvt) => {
          if (!isDragging) return;
          moveEvt.preventDefault();
          seekFromPointer(moveEvt);
        };

        const onPointerUp = (upEvt) => {
          if (!isDragging) return;
          isDragging = false;
          showreelTimelineWrap.classList.remove("is-dragging");
          try {
            showreelTimelineWrap.releasePointerCapture(upEvt.pointerId);
          } catch (err) {}

          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);

          if (!wasPausedBeforeDrag && showreelVideo.paused) {
            showreelVideo.play().catch(() => {});
          }
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      });

      showreelTimelineWrap.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      showreelTimelineWrap.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();
          showreelVideo.currentTime = Math.max((showreelVideo.currentTime || 0) - 3, 0);
          updateTimelineUI(showreelVideo.currentTime, showreelVideo.duration);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();
          showreelVideo.currentTime = Math.min((showreelVideo.currentTime || 0) + 3, showreelVideo.duration || 0);
          updateTimelineUI(showreelVideo.currentTime, showreelVideo.duration);
        }
      });
    }

    // Fullscreen Controller (True Fullscreen with all UI: Play/Pause, Volume, Timeline preserved)
    if (showreelFullscreenBtn && showreelFrame) {
      const iconExpand = showreelFullscreenBtn.querySelector(".icon-expand");
      const iconCompress = showreelFullscreenBtn.querySelector(".icon-compress");
      let fsInactivityTimer = null;

      const isFrameFullscreen = () => {
        return Boolean(
          document.fullscreenElement === showreelFrame ||
          document.webkitFullscreenElement === showreelFrame ||
          document.mozFullScreenElement === showreelFrame ||
          document.msFullscreenElement === showreelFrame ||
          showreelFrame.classList.contains("is-fullscreen")
        );
      };

      const resetInactivityTimer = () => {
        if (!isFrameFullscreen()) return;
        showreelFrame.classList.remove("controls-hidden");
        if (fsInactivityTimer) clearTimeout(fsInactivityTimer);
        // If video is playing, fade out controls after 3.2 seconds of mouse stillness
        if (showreelVideo && !showreelVideo.paused) {
          fsInactivityTimer = setTimeout(() => {
            if (isFrameFullscreen() && showreelVideo && !showreelVideo.paused) {
              showreelFrame.classList.add("controls-hidden");
            }
          }, 3200);
        }
      };

      const updateFullscreenUI = () => {
        const inFs = isFrameFullscreen();
        if (iconExpand) iconExpand.style.display = inFs ? "none" : "block";
        if (iconCompress) iconCompress.style.display = inFs ? "block" : "none";
        showreelFullscreenBtn.setAttribute("aria-label", inFs ? "Exit fullscreen" : "Fullscreen showreel");
        showreelFullscreenBtn.setAttribute("title", inFs ? "Exit Fullscreen" : "Fullscreen");

        if (!inFs) {
          showreelFrame.classList.remove("is-fullscreen", "controls-hidden");
          if (fsInactivityTimer) clearTimeout(fsInactivityTimer);
        } else {
          showreelFrame.classList.add("is-fullscreen");
          resetInactivityTimer();
        }
      };

      const toggleFullscreen = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }

        if (!isFrameFullscreen()) {
          const req = showreelFrame.requestFullscreen ||
                      showreelFrame.webkitRequestFullscreen ||
                      showreelFrame.mozRequestFullScreen ||
                      showreelFrame.msRequestFullscreen;
          if (req) {
            req.call(showreelFrame).catch(() => {
              showreelFrame.classList.add("is-fullscreen");
              updateFullscreenUI();
            });
          } else {
            showreelFrame.classList.add("is-fullscreen");
            updateFullscreenUI();
          }
        } else {
          const exit = document.exitFullscreen ||
                       document.webkitExitFullscreen ||
                       document.mozCancelFullScreen ||
                       document.msExitFullscreen;
          if (exit && (document.fullscreenElement || document.webkitFullscreenElement)) {
            exit.call(document).catch(() => {
              showreelFrame.classList.remove("is-fullscreen");
              updateFullscreenUI();
            });
          } else {
            showreelFrame.classList.remove("is-fullscreen");
            updateFullscreenUI();
          }
        }
      };

      showreelFullscreenBtn.addEventListener("click", toggleFullscreen);

      // Listen for Fullscreen API change events (including Esc key exit)
      document.addEventListener("fullscreenchange", updateFullscreenUI);
      document.addEventListener("webkitfullscreenchange", updateFullscreenUI);
      document.addEventListener("mozfullscreenchange", updateFullscreenUI);
      document.addEventListener("MSFullscreenChange", updateFullscreenUI);

      // Inactivity autohide / wake in fullscreen
      showreelFrame.addEventListener("mousemove", resetInactivityTimer);
      showreelFrame.addEventListener("touchstart", resetInactivityTimer, { passive: true });

      // Double-click on showreel frame toggles fullscreen
      showreelFrame.addEventListener("dblclick", (e) => {
        if (!e.target.closest(".card-video-controls")) {
          toggleFullscreen(e);
        }
      });
    }

    // Viewport observer to pause showreel video when scrolled away
    try {
      const showreelObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && showreelVideo && !showreelVideo.paused) {
            showreelVideo.pause();
          }
        });
      }, { threshold: 0.1 });
      showreelObserver.observe(showreelVideo);
    } catch (e) {}
  }

  // ===========================================================================
  // 3. BRANDS MARQUEE RENDERING (LOGOS ONLY)
  // ===========================================================================
  const renderMarqueeRow = (rowId, brandList) => {
    const track = document.getElementById(rowId);
    if (!track || !brandList || brandList.length === 0) return;

    // To create a perfectly seamless, infinite marquee loop with zero gaps on any screen
    // (including ultra-wide and 4K displays), we create two identical halves (Group A and Group B).
    // Repeating 4 times gives 28 items per half (>4,800px wide), ensuring the track is always
    // completely filled with logos from edge to edge without any empty spaces.
    const groupA = [...brandList, ...brandList, ...brandList, ...brandList];
    const groupB = [...brandList, ...brandList, ...brandList, ...brandList];
    const duplicated = [...groupA, ...groupB];

    track.innerHTML = duplicated
      .map(
        (brand) => `
        <div class="logo-slot">
          <img 
            src="${brand.logo}" 
            alt="${brand.alt || 'Brand Logo'}"
            loading="lazy"
            onerror="this.onerror=null; this.src='public/logos/brand-01.svg';"
          />
        </div>
      `
      )
      .join("");
  };

  if (data.brandsRow1 && data.brandsRow2) {
    renderMarqueeRow("marquee-track-1", data.brandsRow1, "marquee-track-left");
    renderMarqueeRow("marquee-track-2", data.brandsRow2, "marquee-track-right");
  }

  // State for view more toggle
  let isShortFormExpanded = false;



  // ===========================================================================
  // 4. PORTFOLIO TABS & GRID RENDERING
  // ===========================================================================
  const renderPortfolio = (categoryKey) => {
    if (!portfolioGrid) return;
    currentCategory = categoryKey;

    const items = data.portfolio[categoryKey] || [];
    const isShort = categoryKey === "shortForm";

    // Set grid class: 4 columns for shortForm, 2 columns for longForm
    portfolioGrid.className = `portfolio-grid ${isShort ? 'grid-short-form' : 'grid-long-form'}`;

    const viewMoreWrap = document.getElementById("portfolio-action-wrap");
    const viewMoreBtn = document.getElementById("btn-view-more");
    const viewMoreText = document.getElementById("view-more-text");

    // For short-form, show "VIEW MORE" if more than 4 items
    if (viewMoreWrap) {
      if (isShort && items.length > 4) {
        viewMoreWrap.style.display = "flex";
        if (viewMoreText) viewMoreText.textContent = isShortFormExpanded ? "VIEW LESS" : "VIEW MORE";
        if (viewMoreBtn) {
          if (isShortFormExpanded) {
            viewMoreBtn.classList.add("expanded");
          } else {
            viewMoreBtn.classList.remove("expanded");
          }
        }
      } else {
        viewMoreWrap.style.display = "none";
      }
    }

    portfolioGrid.innerHTML = items
      .map((item, idx) => {
        const isHidden = isShort && idx >= 4 && !isShortFormExpanded;

        if (isShort) {
          // Short-Form: 4-column row, no thumbnails, direct autoplaying muted loop video with minimal controls
          return `
            <div 
              class="portfolio-card card-short ${isHidden ? 'card-hidden' : (idx >= 4 ? 'card-revealed' : '')}" 
              data-id="${item.id}"
              data-index="${idx}"
              role="article"
              aria-label="${item.title}"
            >
              <div class="card-media">
                <video 
                  class="card-video" 
                  autoplay 
                  muted 
                  loop 
                  playsinline 
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  data-video-id="${item.id}"
                >
                  <source src="${item.videoUrl}" type="video/mp4" />
                  <source src="public/videos/8views -1.mp4" type="video/mp4" />
                  <source src="public/videos/my show reel.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <!-- Top Meta Badges -->
                <div class="card-meta-top">
                  <span class="card-badge">${item.category}</span>
                  <span class="card-duration">${item.duration || '9:16'}</span>
                </div>

                <!-- Minimal Video Controls Overlay (Play/Pause, Sound, Timeline Scroller, Fullscreen) -->
                <div class="card-video-controls" aria-label="Video Controls">
                  <div class="ctrl-btn-group">
                    <!-- Play / Pause -->
                    <button class="video-ctrl-btn ctrl-play" aria-label="Pause video" title="Play / Pause">
                      <svg class="icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                      <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display: none; transform: translateX(1px);">
                        <polygon points="6 4 20 12 6 20 6 4"/>
                      </svg>
                    </button>

                    <!-- Sound On / Off -->
                    <button class="video-ctrl-btn ctrl-sound" aria-label="Unmute video" title="Sound On / Off">
                      <svg class="icon-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
                        <line x1="23" y1="9" x2="17" y2="15"/>
                        <line x1="17" y1="9" x2="23" y2="15"/>
                      </svg>
                      <svg class="icon-unmuted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Timeline Scroller -->
                  <div class="ctrl-timeline-wrap" title="Drag to seek" role="slider" aria-label="Video Timeline" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
                    <div class="timeline-track">
                      <div class="timeline-progress"></div>
                      <div class="timeline-thumb"></div>
                    </div>
                    <span class="timeline-time">
                      <span class="time-current">0:00</span>
                      <span class="time-total"> / ${item.duration || '0:30'}</span>
                    </span>
                  </div>

                  <!-- Fullscreen -->
                  <button class="video-ctrl-btn ctrl-fullscreen" aria-label="Fullscreen" title="Fullscreen">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 3 21 3 21 9"/>
                      <polyline points="9 21 3 21 3 15"/>
                      <line x1="21" y1="3" x2="14" y2="10"/>
                      <line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          `;
        } else {
          // Long-Form: 16:9 cinematic widescreen cards, automatic muted loop playback with same minimal controls UI
          return `
            <div 
              class="portfolio-card card-long" 
              data-id="${item.id}"
              data-index="${idx}"
              role="article"
              aria-label="${item.title}"
            >
              <div class="card-media">
                <video 
                  class="card-video" 
                  autoplay 
                  muted 
                  loop 
                  playsinline 
                  preload="metadata"
                  disablePictureInPicture
                  disableRemotePlayback
                  data-video-id="${item.id}"
                >
                  <source src="${item.videoUrl}" type="video/mp4" />
                  <source src="public/videos/long-01.mp4" type="video/mp4" />
                  <source src="public/videos/my show reel.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <!-- Top Meta Badges -->
                <div class="card-meta-top">
                  <span class="card-badge">${item.category}</span>
                  <span class="card-duration">${item.duration || '16:9'}</span>
                </div>

                <!-- Minimal Video Controls Overlay (Play/Pause, Sound, Timeline Scroller, Fullscreen) -->
                <div class="card-video-controls" aria-label="Video Controls">
                  <div class="ctrl-btn-group">
                    <!-- Play / Pause -->
                    <button class="video-ctrl-btn ctrl-play" aria-label="Pause video" title="Play / Pause">
                      <svg class="icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                      <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display: none; transform: translateX(1px);">
                        <polygon points="6 4 20 12 6 20 6 4"/>
                      </svg>
                    </button>

                    <!-- Sound On / Off -->
                    <button class="video-ctrl-btn ctrl-sound" aria-label="Unmute video" title="Sound On / Off">
                      <svg class="icon-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
                        <line x1="23" y1="9" x2="17" y2="15"/>
                        <line x1="17" y1="9" x2="23" y2="15"/>
                      </svg>
                      <svg class="icon-unmuted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Timeline Scroller -->
                  <div class="ctrl-timeline-wrap" title="Drag to seek" role="slider" aria-label="Video Timeline" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
                    <div class="timeline-track">
                      <div class="timeline-progress"></div>
                      <div class="timeline-thumb"></div>
                    </div>
                    <span class="timeline-time">
                      <span class="time-current">0:00</span>
                      <span class="time-total"> / ${item.duration || '16:9'}</span>
                    </span>
                  </div>

                  <!-- Fullscreen -->
                  <button class="video-ctrl-btn ctrl-fullscreen" aria-label="Fullscreen" title="Fullscreen">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="15 3 21 3 21 9"/>
                      <polyline points="9 21 3 21 3 15"/>
                      <line x1="21" y1="3" x2="14" y2="10"/>
                      <line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          `;
        }
      })
      .join("");

    // Wire up each card's video and controls (both short-form and long-form)
    portfolioGrid.querySelectorAll(".portfolio-card").forEach((card) => {
      const id = card.dataset.id;
      const project = items.find((p) => p.id === id);
      const video = card.querySelector(".card-video");
      const playBtn = card.querySelector(".ctrl-play");
      const soundBtn = card.querySelector(".ctrl-sound");
      const fullscreenBtn = card.querySelector(".ctrl-fullscreen");
      const timelineWrap = card.querySelector(".ctrl-timeline-wrap");
      const timelineTrack = card.querySelector(".timeline-track");
      const timelineProgress = card.querySelector(".timeline-progress");
      const timelineThumb = card.querySelector(".timeline-thumb");
      const timeCurrent = card.querySelector(".time-current");
      const timeTotal = card.querySelector(".time-total");

      if (video) {
        // Ensure muted autoplay
        video.muted = true;
        video.play().catch(() => {});

        // Play / Pause Toggle
        if (playBtn) {
          const iconPause = playBtn.querySelector(".icon-pause");
          const iconPlay = playBtn.querySelector(".icon-play");

          const updatePlayIcons = () => {
            if (video.paused) {
              if (iconPause) iconPause.style.display = "none";
              if (iconPlay) iconPlay.style.display = "block";
              playBtn.setAttribute("aria-label", "Play video");
            } else {
              if (iconPause) iconPause.style.display = "block";
              if (iconPlay) iconPlay.style.display = "none";
              playBtn.setAttribute("aria-label", "Pause video");
            }
          };

          playBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (video.paused) {
              video.play();
            } else {
              video.pause();
            }
            updatePlayIcons();
          });

          video.addEventListener("play", updatePlayIcons);
          video.addEventListener("pause", updatePlayIcons);
        }

        // Sound On / Off Toggle
        if (soundBtn) {
          const iconMuted = soundBtn.querySelector(".icon-muted");
          const iconUnmuted = soundBtn.querySelector(".icon-unmuted");

          const updateSoundIcons = () => {
            if (video.muted) {
              if (iconMuted) iconMuted.style.display = "block";
              if (iconUnmuted) iconUnmuted.style.display = "none";
              soundBtn.setAttribute("aria-label", "Unmute video");
            } else {
              if (iconMuted) iconMuted.style.display = "none";
              if (iconUnmuted) iconUnmuted.style.display = "block";
              soundBtn.setAttribute("aria-label", "Mute video");
            }
          };

          soundBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (video.muted) {
              // Mute showreel if it is currently unmuted
              if (showreelVideo && !showreelVideo.muted) {
                showreelVideo.muted = true;
                if (showreelSoundBtn) {
                  const sm = showreelSoundBtn.querySelector(".icon-muted");
                  const su = showreelSoundBtn.querySelector(".icon-unmuted");
                  if (sm) sm.style.display = "block";
                  if (su) su.style.display = "none";
                  showreelSoundBtn.setAttribute("aria-label", "Unmute showreel");
                }
              }

              // Mute RAW/FINAL comparison video if unmuted
              const rfVideoFinal = document.getElementById("rf-video-final");
              const rfVideoRaw = document.getElementById("rf-video-raw");
              if (rfVideoFinal && !rfVideoFinal.muted) {
                rfVideoFinal.muted = true;
                if (rfVideoRaw) rfVideoRaw.muted = true;
                const rfSoundBtn = document.getElementById("rf-ctrl-sound");
                if (rfSoundBtn) {
                  const rfm = rfSoundBtn.querySelector(".icon-muted");
                  const rfu = rfSoundBtn.querySelector(".icon-unmuted");
                  if (rfm) rfm.style.display = "block";
                  if (rfu) rfu.style.display = "none";
                }
              }

              // Mute all other card videos so only this video plays sound
              portfolioGrid.querySelectorAll(".card-video").forEach((v) => {
                if (v !== video) {
                  v.muted = true;
                  const otherSoundBtn = v.closest(".portfolio-card")?.querySelector(".ctrl-sound");
                  if (otherSoundBtn) {
                    const om = otherSoundBtn.querySelector(".icon-muted");
                    const ou = otherSoundBtn.querySelector(".icon-unmuted");
                    if (om) om.style.display = "block";
                    if (ou) ou.style.display = "none";
                  }
                }
              });

              video.muted = false;
              video.volume = 1;
            } else {
              video.muted = true;
            }
            updateSoundIcons();
          });
        }

        // Video Timeline Scroller (Seek & Drag Scrubbing)
        if (timelineWrap && timelineTrack) {
          let isDragging = false;
          let wasPausedBeforeDrag = false;

          const updateTimelineUI = (currentTime, duration) => {
            if (isNaN(currentTime)) return;
            const validDuration = duration && !isNaN(duration) && duration > 0 ? duration : 0;
            const pct = validDuration > 0 ? Math.min(Math.max((currentTime / validDuration) * 100, 0), 100) : 0;

            if (timelineProgress) timelineProgress.style.width = `${pct}%`;
            if (timelineThumb) timelineThumb.style.left = `${pct}%`;
            if (timeCurrent) timeCurrent.textContent = formatTime(currentTime);
            if (timeTotal && validDuration > 0) {
              timeTotal.textContent = ` / ${formatTime(validDuration)}`;
            }
            timelineWrap.setAttribute("aria-valuenow", Math.round(pct));
          };

          // Listen to video time updates
          video.addEventListener("timeupdate", () => {
            if (!isDragging) {
              updateTimelineUI(video.currentTime, video.duration);
            }
          });

          // Update total duration once metadata loads
          video.addEventListener("loadedmetadata", () => {
            if (timeTotal && video.duration > 0) {
              timeTotal.textContent = ` / ${formatTime(video.duration)}`;
            }
            updateTimelineUI(video.currentTime, video.duration);
          });

          // Helper to seek from pointer coordinate
          const seekFromPointer = (e) => {
            const rect = timelineTrack.getBoundingClientRect();
            if (rect.width <= 0) return;
            const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
            const pct = offsetX / rect.width;
            const duration = video.duration || 0;
            const targetTime = pct * duration;

            // Instant visual feedback
            if (timelineProgress) timelineProgress.style.width = `${pct * 100}%`;
            if (timelineThumb) timelineThumb.style.left = `${pct * 100}%`;
            if (timeCurrent) timeCurrent.textContent = formatTime(targetTime);

            if (duration > 0 && !isNaN(targetTime) && isFinite(targetTime)) {
              video.currentTime = targetTime;
            }
          };

          // Pointer Down (scrub start)
          timelineWrap.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            timelineWrap.classList.add("is-dragging");
            try {
              timelineWrap.setPointerCapture(e.pointerId);
            } catch (err) {}

            wasPausedBeforeDrag = video.paused;
            seekFromPointer(e);

            const onPointerMove = (moveEvt) => {
              if (!isDragging) return;
              moveEvt.preventDefault();
              seekFromPointer(moveEvt);
            };

            const onPointerUp = (upEvt) => {
              if (!isDragging) return;
              isDragging = false;
              timelineWrap.classList.remove("is-dragging");
              try {
                timelineWrap.releasePointerCapture(upEvt.pointerId);
              } catch (err) {}

              window.removeEventListener("pointermove", onPointerMove);
              window.removeEventListener("pointerup", onPointerUp);
              window.removeEventListener("pointercancel", onPointerUp);

              // Resume playing if was playing previously
              if (!wasPausedBeforeDrag && video.paused) {
                video.play().catch(() => {});
              }
            };

            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);
            window.addEventListener("pointercancel", onPointerUp);
          });

          // Prevent click bubbling to card
          timelineWrap.addEventListener("click", (e) => {
            e.stopPropagation();
          });

          // Keyboard support (Arrow Left/Right to seek)
          timelineWrap.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              e.stopPropagation();
              video.currentTime = Math.max((video.currentTime || 0) - 3, 0);
              updateTimelineUI(video.currentTime, video.duration);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              e.stopPropagation();
              video.currentTime = Math.min((video.currentTime || 0) + 3, video.duration || 0);
              updateTimelineUI(video.currentTime, video.duration);
            }
          });
        }

        // Fullscreen / Expand into Lightbox Modal (Our custom designed centered modal overlay)
        if (fullscreenBtn) {
          fullscreenBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (project) {
              const currentTime = video ? video.currentTime : 0;
              if (video) video.pause();
              openVideoModal(project, currentTime);
            }
          });
        }

        // Clicking card info or media area (outside controls) opens centered lightbox modal
        card.addEventListener("click", (e) => {
          if (e.target.closest(".card-video-controls")) return;
          if (project) {
            const currentTime = video ? video.currentTime : 0;
            if (video) video.pause();
            openVideoModal(project, currentTime);
          }
        });
      }
    });

    // Viewport observer for portfolio card videos: pauses off-screen cards to preserve decoder bandwidth
    try {
      if (window.portfolioCardObserver) {
        window.portfolioCardObserver.disconnect();
      }
      window.portfolioCardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      }, { threshold: 0.1 });

      portfolioGrid.querySelectorAll(".card-video").forEach((v) => {
        window.portfolioCardObserver.observe(v);
      });
    } catch (err) {}
  };

  // Tab buttons click events
  if (tabShortBtn && tabLongBtn) {
    tabShortBtn.addEventListener("click", () => {
      tabShortBtn.classList.add("active");
      tabLongBtn.classList.remove("active");
      isShortFormExpanded = false;
      renderPortfolio("shortForm");
    });

    tabLongBtn.addEventListener("click", () => {
      tabLongBtn.classList.add("active");
      tabShortBtn.classList.remove("active");
      isShortFormExpanded = false;
      renderPortfolio("longForm");
    });
  }

  // View More Button click event
  const viewMoreBtn = document.getElementById("btn-view-more");
  if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", () => {
      isShortFormExpanded = !isShortFormExpanded;
      renderPortfolio(currentCategory);

      if (isShortFormExpanded) {
        // Ensure newly revealed videos start playing
        portfolioGrid.querySelectorAll(".card-revealed .card-video").forEach((v) => {
          v.muted = true;
          v.play().catch(() => {});
        });
      } else {
        // Smoothly scroll back to top of portfolio grid
        portfolioGrid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // Initial Portfolio Render (Short-form by default)
  renderPortfolio("shortForm");

  // ===========================================================================
  // 4.5. RAW → FINAL INTERACTIVE COMPARISON SLIDER (VERTICAL 9:16)
  // ===========================================================================
  // 4.5. RAW → FINAL INTERACTIVE COMPARISON SLIDER (VERTICAL 9:16)
  // ===========================================================================
  const initRawFinalComparison = () => {
    const rfStage = document.getElementById("rf-stage");
    const rfDivider = document.getElementById("rf-divider");
    const rfLayerFinal = document.getElementById("rf-layer-final");
    const rfVideoRaw = document.getElementById("rf-video-raw");
    const rfVideoFinal = document.getElementById("rf-video-final");
    const rfPlayBtn = document.getElementById("rf-ctrl-play");
    const rfSoundBtn = document.getElementById("rf-ctrl-sound");
    const rfTimelineWrap = document.getElementById("rf-timeline-wrap");
    const rfTimelineProgress = document.getElementById("rf-timeline-progress");
    const rfTimelineThumb = document.getElementById("rf-timeline-thumb");
    const rfTimeCurrent = document.getElementById("rf-time-current");
    const rfTimeTotal = document.getElementById("rf-time-total");

    if (!rfStage || !rfVideoRaw || !rfVideoFinal) return;

    // Load config & video sources from portfolioData.rawFinal if defined
    if (typeof portfolioData !== "undefined" && portfolioData.rawFinal) {
      const rfConfig = portfolioData.rawFinal;

      // Update section text elements if provided in portfolioData.rawFinal
      const rfSection = document.getElementById("raw-final");
      if (rfSection) {
        if (rfConfig.tag) {
          const tagEl = rfSection.querySelector(".section-tag");
          if (tagEl) tagEl.textContent = rfConfig.tag;
        }
        if (rfConfig.title) {
          const titleEl = rfSection.querySelector(".section-title");
          if (titleEl) titleEl.textContent = rfConfig.title;
        }
        if (rfConfig.subtitle) {
          const subEl = rfSection.querySelector(".section-subtext");
          if (subEl) subEl.textContent = rfConfig.subtitle;
        }
        if (rfConfig.finalLabel) {
          const finalTitle = rfSection.querySelector(".rf-ext-final .rf-ext-title");
          if (finalTitle) finalTitle.textContent = rfConfig.finalLabel;
        }
        if (rfConfig.finalDesc) {
          const finalDesc = rfSection.querySelector(".rf-ext-final .rf-ext-desc");
          if (finalDesc) finalDesc.textContent = rfConfig.finalDesc;
        }
        if (rfConfig.rawLabel) {
          const rawTitle = rfSection.querySelector(".rf-ext-raw .rf-ext-title");
          if (rawTitle) rawTitle.textContent = rfConfig.rawLabel;
        }
        if (rfConfig.rawDesc) {
          const rawDesc = rfSection.querySelector(".rf-ext-raw .rf-ext-desc");
          if (rawDesc) rawDesc.textContent = rfConfig.rawDesc;
        }
      }

      if (rfConfig.rawVideo) {
        const rawSource = rfVideoRaw.querySelector("source");
        if (rawSource && rawSource.getAttribute("src") !== rfConfig.rawVideo) {
          rawSource.setAttribute("src", rfConfig.rawVideo);
          rfVideoRaw.load();
        }
      }
      if (rfConfig.finalVideo) {
        const finalSource = rfVideoFinal.querySelector("source");
        if (finalSource && finalSource.getAttribute("src") !== rfConfig.finalVideo) {
          finalSource.setAttribute("src", rfConfig.finalVideo);
          rfVideoFinal.load();
        }
      }
    }

    // Strict Audio Policy:
    // Final Output is MASTER (has audio track, unmutable by user).
    // RAW is permanently silent (muted = true, volume = 0).
    rfVideoRaw.muted = true;
    rfVideoRaw.volume = 0;
    rfVideoFinal.muted = true;

    let userExplicitlyPaused = false;
    let isScrubbingTimeline = false;
    let syncRafId = null;

    // Helper to start/resume both in unison
    const playBoth = () => {
      if (userExplicitlyPaused) return;
      if (rfVideoFinal.paused) {
        rfVideoFinal.play().catch(() => {});
      }
      if (rfVideoRaw.paused) {
        rfVideoRaw.play().catch(() => {});
      }
    };

    const pauseBoth = () => {
      rfVideoFinal.pause();
      rfVideoRaw.pause();
    };

    // Both videos start locked at time 0
    let rawReady = rfVideoRaw.readyState >= 2;
    let finalReady = rfVideoFinal.readyState >= 2;

    const startInitialPlayback = () => {
      if (rawReady && finalReady) {
        rfVideoRaw.currentTime = 0;
        rfVideoFinal.currentTime = 0;
        rfVideoRaw.playbackRate = 1.0;
        rfVideoFinal.playbackRate = 1.0;
        playBoth();
      }
    };

    rfVideoRaw.addEventListener("loadeddata", () => {
      rawReady = true;
      startInitialPlayback();
    });

    rfVideoFinal.addEventListener("loadeddata", () => {
      finalReady = true;
      startInitialPlayback();
    });

    // Fallback if already ready in memory/cache
    startInitialPlayback();
    setTimeout(playBoth, 300);

    // Lockstep End & Loop: Master triggers synchronous restart
    const handleLoop = () => {
      if (userExplicitlyPaused) return;
      rfVideoFinal.currentTime = 0;
      rfVideoRaw.currentTime = 0;
      rfVideoRaw.playbackRate = 1.0;
      rfVideoFinal.playbackRate = 1.0;
      playBoth();
    };

    rfVideoFinal.addEventListener("ended", handleLoop);
    rfVideoRaw.addEventListener("ended", handleLoop);

    // Buffering coordination: if Master buffers, wait; if Slave buffers, pause Master
    rfVideoFinal.addEventListener("waiting", () => {
      if (!rfVideoRaw.paused) rfVideoRaw.pause();
    });
    rfVideoFinal.addEventListener("playing", () => {
      if (!userExplicitlyPaused && rfVideoRaw.paused) rfVideoRaw.play().catch(() => {});
    });
    rfVideoRaw.addEventListener("waiting", () => {
      if (!rfVideoFinal.paused) rfVideoFinal.pause();
    });
    rfVideoRaw.addEventListener("playing", () => {
      if (!userExplicitlyPaused && rfVideoFinal.paused) rfVideoFinal.play().catch(() => {});
    });

    // Timeline UI update
    const updateTimelineUI = (currentTime, duration) => {
      if (!duration || duration <= 0) return;
      const pct = Math.min(Math.max((currentTime / duration) * 100, 0), 100);
      if (rfTimelineProgress) rfTimelineProgress.style.width = `${pct}%`;
      if (rfTimelineThumb) rfTimelineThumb.style.left = `${pct}%`;
      if (rfTimelineWrap) rfTimelineWrap.setAttribute("aria-valuenow", Math.round(pct));
      if (rfTimeCurrent) rfTimeCurrent.textContent = formatTime(currentTime);
    };

    // Master drives timeline progress
    rfVideoFinal.addEventListener("timeupdate", () => {
      const dur = rfVideoFinal.duration || rfVideoRaw.duration || 0;
      if (!isScrubbingTimeline) {
        updateTimelineUI(rfVideoFinal.currentTime, dur);
      }
    });

    const onMetaLoaded = () => {
      const dur = rfVideoFinal.duration || rfVideoRaw.duration || 0;
      if (rfTimeTotal && dur > 0) {
        rfTimeTotal.textContent = ` / ${formatTime(dur)}`;
      }
      updateTimelineUI(rfVideoFinal.currentTime, dur);
    };

    rfVideoFinal.addEventListener("loadedmetadata", onMetaLoaded);
    rfVideoRaw.addEventListener("loadedmetadata", onMetaLoaded);

    // =========================================================================
    // Stutter-Free, Anti-Freeze Continuous Synchronization Loop (RAF)
    // Synchronizes the slave (RAW) to the master (FINAL) using micro-rate adjustments.
    // NEVER touches currentTime during continuous playback! ZERO buffer flushes!
    // =========================================================================
    const syncVideosLoop = () => {
      if (!userExplicitlyPaused && !isScrubbingTimeline) {
        // Keep both playing if master is playing
        if (!rfVideoFinal.paused && rfVideoRaw.paused) {
          rfVideoRaw.play().catch(() => {});
        }

        const diff = rfVideoRaw.currentTime - rfVideoFinal.currentTime;
        const absDiff = Math.abs(diff);

        if (absDiff > 0.015 && absDiff < 0.6) {
          // Micro-adjustment: if Raw is ahead (diff > 0), slow down; if behind, speed up
          const rate = Math.min(Math.max(1.0 - (diff * 2.0), 0.75), 1.25);
          rfVideoRaw.playbackRate = rate;
        } else if (absDiff <= 0.015) {
          rfVideoRaw.playbackRate = 1.0;
        } else if (absDiff >= 0.6) {
          // Discontinuity (e.g. background tab sleep > 1 second):
          if (!rfVideoRaw.seeking && !rfVideoFinal.seeking) {
            rfVideoRaw.currentTime = rfVideoFinal.currentTime;
            rfVideoRaw.playbackRate = 1.0;
          }
        }
      }
      syncRafId = requestAnimationFrame(syncVideosLoop);
    };

    syncVideosLoop();

    // =========================================================================
    // Comparison Slider Divider (Horizontal Line with Outside Round Handle)
    // Directly updates inline clipPath and CSS variable for zero-latency response
    // =========================================================================
    let isDraggingSplit = false;
    let currentSplitY = 50;
    let splitRafId = null;

    const setSplitY = (pct) => {
      currentSplitY = Math.min(Math.max(pct, 2), 98);
      if (splitRafId) cancelAnimationFrame(splitRafId);
      splitRafId = requestAnimationFrame(() => {
        rfStage.style.setProperty("--split-pos-y", `${currentSplitY}%`);
        if (rfLayerFinal) {
          const clipVal = `inset(0 0 ${100 - currentSplitY}% 0)`;
          rfLayerFinal.style.clipPath = clipVal;
          rfLayerFinal.style.webkitClipPath = clipVal;
        }
        if (rfDivider) {
          rfDivider.style.top = `${currentSplitY}%`;
          rfDivider.setAttribute("aria-valuenow", Math.round(currentSplitY));
        }
      });
    };

    // Initialize clip-path at 50%
    setSplitY(50);

    const calcSplitFromClientY = (clientY) => {
      const rect = rfStage.getBoundingClientRect();
      if (rect.height <= 0) return;
      const offsetY = clientY - rect.top;
      const pct = (offsetY / rect.height) * 100;
      setSplitY(pct);
    };

    const onSplitPointerMove = (e) => {
      if (!isDraggingSplit) return;
      e.preventDefault();
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      calcSplitFromClientY(clientY);
    };

    const onSplitPointerUp = (e) => {
      if (!isDraggingSplit) return;
      isDraggingSplit = false;
      rfStage.classList.remove("is-dragging");
      try {
        if (e.pointerId) rfStage.releasePointerCapture(e.pointerId);
      } catch (err) {}

      window.removeEventListener("pointermove", onSplitPointerMove);
      window.removeEventListener("pointerup", onSplitPointerUp);
      window.removeEventListener("pointercancel", onSplitPointerUp);
    };

    rfStage.addEventListener("pointerdown", (e) => {
      // Ignore clicks on bottom controls or timeline
      if (e.target.closest(".rf-controls")) return;
      e.preventDefault();
      isDraggingSplit = true;
      rfStage.classList.add("is-dragging");

      try {
        rfStage.setPointerCapture(e.pointerId);
      } catch (err) {}

      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      calcSplitFromClientY(clientY);

      window.addEventListener("pointermove", onSplitPointerMove, { passive: false });
      window.addEventListener("pointerup", onSplitPointerUp);
      window.addEventListener("pointercancel", onSplitPointerUp);
    });

    // Keyboard support on horizontal divider (Up / Down arrows)
    if (rfDivider) {
      rfDivider.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          setSplitY(currentSplitY - 5);
        } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          setSplitY(currentSplitY + 5);
        }
      });
    }

    // Play / Pause Button
    const updatePlayIcons = (isPlaying) => {
      if (!rfPlayBtn) return;
      const iconPause = rfPlayBtn.querySelector(".icon-pause");
      const iconPlay = rfPlayBtn.querySelector(".icon-play");
      if (isPlaying) {
        if (iconPause) iconPause.style.display = "block";
        if (iconPlay) iconPlay.style.display = "none";
        rfPlayBtn.setAttribute("aria-label", "Pause comparison");
      } else {
        if (iconPause) iconPause.style.display = "none";
        if (iconPlay) iconPlay.style.display = "block";
        rfPlayBtn.setAttribute("aria-label", "Play comparison");
      }
    };

    if (rfPlayBtn) {
      rfPlayBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (userExplicitlyPaused) {
          userExplicitlyPaused = false;
          playBoth();
          updatePlayIcons(true);
        } else {
          userExplicitlyPaused = true;
          pauseBoth();
          updatePlayIcons(false);
        }
      });
    }

    // Sound Toggle (Master Audio only; RAW is always silent)
    if (rfSoundBtn) {
      const iconMuted = rfSoundBtn.querySelector(".icon-muted");
      const iconUnmuted = rfSoundBtn.querySelector(".icon-unmuted");

      const updateSoundIcons = () => {
        const isMuted = rfVideoFinal.muted;
        if (isMuted) {
          if (iconMuted) iconMuted.style.display = "block";
          if (iconUnmuted) iconUnmuted.style.display = "none";
          rfSoundBtn.setAttribute("aria-label", "Unmute comparison");
        } else {
          if (iconMuted) iconMuted.style.display = "none";
          if (iconUnmuted) iconUnmuted.style.display = "block";
          rfSoundBtn.setAttribute("aria-label", "Mute comparison");
        }
      };

      rfSoundBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        rfVideoRaw.muted = true;
        rfVideoRaw.volume = 0;

        if (rfVideoFinal.muted) {
          // Mute showreel if playing
          if (showreelVideo && !showreelVideo.muted) {
            showreelVideo.muted = true;
            const srSoundBtn = document.getElementById("showreel-ctrl-sound");
            if (srSoundBtn) {
              const sm = srSoundBtn.querySelector(".icon-muted");
              const su = srSoundBtn.querySelector(".icon-unmuted");
              if (sm) sm.style.display = "block";
              if (su) su.style.display = "none";
            }
          }
          // Mute all portfolio videos
          if (portfolioGrid) {
            portfolioGrid.querySelectorAll(".card-video").forEach((v) => {
              v.muted = true;
              const cardSoundBtn = v.closest(".portfolio-card")?.querySelector(".ctrl-sound");
              if (cardSoundBtn) {
                const cm = cardSoundBtn.querySelector(".icon-muted");
                const cu = cardSoundBtn.querySelector(".icon-unmuted");
                if (cm) cm.style.display = "block";
                if (cu) cu.style.display = "none";
              }
            });
          }

          rfVideoFinal.muted = false;
          rfVideoFinal.volume = 1;
        } else {
          rfVideoFinal.muted = true;
        }

        updateSoundIcons();
        playBoth();
      });
    }

    // Interactive Timeline Scroller (Seek & Drag)
    if (rfTimelineWrap) {
      const timelineTrack = rfTimelineWrap.querySelector(".timeline-track") || rfTimelineWrap;

      const executeSeek = (targetTime) => {
        if (targetTime === null || isNaN(targetTime) || !isFinite(targetTime)) return;
        rfVideoFinal.currentTime = targetTime;
        rfVideoRaw.currentTime = targetTime;
        rfVideoRaw.playbackRate = 1.0;
        rfVideoFinal.playbackRate = 1.0;
        playBoth();
      };

      const handleTimelineScrub = (e, isRelease = false) => {
        const rect = timelineTrack.getBoundingClientRect();
        if (rect.width <= 0) return;
        const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const pct = offsetX / rect.width;
        const dur = rfVideoFinal.duration || rfVideoRaw.duration || 0;
        const targetTime = pct * dur;

        if (rfTimelineProgress) rfTimelineProgress.style.width = `${pct * 100}%`;
        if (rfTimelineThumb) rfTimelineThumb.style.left = `${pct * 100}%`;
        if (rfTimeCurrent) rfTimeCurrent.textContent = formatTime(targetTime);

        if (isRelease && dur > 0 && !isNaN(targetTime)) {
          executeSeek(targetTime);
        }
      };

      const onTimelineMove = (moveEvt) => {
        if (!isScrubbingTimeline) return;
        moveEvt.preventDefault();
        handleTimelineScrub(moveEvt, false);
      };

      const onTimelineUp = (upEvt) => {
        if (!isScrubbingTimeline) return;
        isScrubbingTimeline = false;
        rfTimelineWrap.classList.remove("is-dragging");

        try {
          if (upEvt.pointerId) rfTimelineWrap.releasePointerCapture(upEvt.pointerId);
        } catch (err) {}

        window.removeEventListener("pointermove", onTimelineMove);
        window.removeEventListener("pointerup", onTimelineUp);
        window.removeEventListener("pointercancel", onTimelineUp);

        handleTimelineScrub(upEvt, true);
        playBoth();
      };

      rfTimelineWrap.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        isScrubbingTimeline = true;
        rfTimelineWrap.classList.add("is-dragging");

        try {
          rfTimelineWrap.setPointerCapture(e.pointerId);
        } catch (err) {}

        handleTimelineScrub(e, false);

        window.addEventListener("pointermove", onTimelineMove, { passive: false });
        window.addEventListener("pointerup", onTimelineUp);
        window.addEventListener("pointercancel", onTimelineUp);
      });

      rfTimelineWrap.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      rfTimelineWrap.addEventListener("keydown", (e) => {
        const dur = rfVideoFinal.duration || rfVideoRaw.duration || 0;
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          e.stopPropagation();
          const target = Math.max((rfVideoFinal.currentTime || 0) - 2, 0);
          executeSeek(target);
          updateTimelineUI(target, dur);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          e.stopPropagation();
          const target = Math.min((rfVideoFinal.currentTime || 0) + 2, dur);
          executeSeek(target);
          updateTimelineUI(target, dur);
        }
      });
    }

    // Viewport IntersectionObserver to start/resume playback when user scrolls into view,
    // and pause when scrolled away to save hardware video decoder bandwidth!
    try {
      const stageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!userExplicitlyPaused) playBoth();
          } else {
            // When scrolled off-screen, pause both comparison videos to free hardware decoders
            pauseBoth();
          }
        });
      }, { threshold: 0.1 });
      stageObserver.observe(rfStage);
    } catch (e) {}
  };

  // Initialize RAW → FINAL Comparison Slider
  initRawFinalComparison();

  // ===========================================================================
  // 5. VIDEO MODAL / LIGHTBOX
  // ===========================================================================
  let modalCloseTimer = null;

  // Helper to safely extract YouTube video ID from standard or shortened URLs
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = String(url).match(regExp);
    return match && match[1] ? match[1] : null;
  };

  // Helper to extract Vimeo video ID
  const getVimeoId = (url) => {
    if (!url) return null;
    const match = String(url).match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    return match && match[1] ? match[1] : null;
  };

  function openVideoModal(project, startTime = 0) {
    if (!project || !videoModal || !modalContainer) return;
    if (modalCloseTimer) clearTimeout(modalCloseTimer);
    activeModalProject = project;

    // Pause all inline videos
    if (showreelVideo && !showreelVideo.paused) {
      showreelVideo.pause();
    }
    if (portfolioGrid) {
      portfolioGrid.querySelectorAll(".card-video").forEach((v) => {
        if (!v.paused) v.pause();
      });
    }
    const rfVideoRaw = document.getElementById("rf-video-raw");
    const rfVideoFinal = document.getElementById("rf-video-final");
    if (rfVideoRaw && !rfVideoRaw.paused) rfVideoRaw.pause();
    if (rfVideoFinal && !rfVideoFinal.paused) rfVideoFinal.pause();

    modalTitle.textContent = project.title || "Project Video";
    modalDescription.textContent = project.description || `${project.category || 'Video'} • Edited by Naresh Kumar`;

    const isShort = project.aspectRatio === "9:16";
    modalContainer.className = `modal-video-container ${isShort ? 'aspect-9-16' : 'aspect-16-9'}`;

    const modalDialog = videoModal.querySelector(".modal-dialog");
    if (modalDialog) {
      modalDialog.style.maxWidth = isShort ? "440px" : "960px";
    }

    const candidateUrl = project.embedUrl || project.videoUrl || "";
    const ytId = getYouTubeId(candidateUrl);
    const vimeoId = getVimeoId(candidateUrl);

    // Render video player or embed with guaranteed autoplay
    if (ytId) {
      modalContainer.innerHTML = `
        <iframe 
          class="modal-video-player" 
          src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&playsinline=1&rel=0&modestbranding=1" 
          title="${project.title || 'Video'}"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowfullscreen
        ></iframe>
      `;
    } else if (vimeoId) {
      modalContainer.innerHTML = `
        <iframe 
          class="modal-video-player" 
          src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0" 
          title="${project.title || 'Video'}"
          frameborder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowfullscreen
        ></iframe>
      `;
    } else {
      // Native HTML5 MP4 Player
      const posterAttr = project.thumbnail || project.fallbackThumbnail ? `poster="${project.thumbnail || project.fallbackThumbnail}"` : "";
      modalContainer.innerHTML = `
        <video 
          class="modal-video-player" 
          controls 
          autoplay 
          playsinline 
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          ${posterAttr}
        >
          <source src="${project.videoUrl}" type="video/mp4" />
          <source src="${project.id === 'showreel' ? 'public/videos/showreel.mp4' : (isShort ? 'public/videos/8views -1.mp4' : 'public/videos/long-01.mp4')}" type="video/mp4" />
          <source src="public/videos/showreel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      `;

      const modalVid = modalContainer.querySelector("video");
      if (modalVid) {
        if (typeof startTime === "number" && startTime > 0) {
          try {
            modalVid.currentTime = startTime;
          } catch (e) {}
        } else {
          modalVid.currentTime = 0;
        }

        // Try unmuted audio first since user intentionally opened the lightbox modal
        modalVid.muted = false;
        const playPromise = modalVid.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Unmuted autoplay restricted by browser; starting muted:", err);
            modalVid.muted = true;
            modalVid.play().catch(e => console.error("Autoplay attempt failed:", e));
          });
        }

        // Gracefully handle missing local video in modal
        modalVid.addEventListener("error", () => {
          modalContainer.innerHTML = `
            <div class="modal-placeholder-notice">
              <div class="placeholder-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <h4>Video File Ready For Linking</h4>
              <p>Drop your video file into the project at:</p>
              <code>${project.videoUrl}</code>
              <p class="placeholder-subnote">Or update <code>portfolio-data.js</code> with your YouTube or Vimeo link.</p>
            </div>
          `;
        });
      }
    }

    // Activate modal overlay & body blur smoothly
    videoModal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function closeVideoModal() {
    if (!videoModal || !videoModal.classList.contains("active")) return;

    // 1. Immediately pause and mute any video or audio in modal
    const modalVid = modalContainer.querySelector("video");
    let modalCurrentTime = 0;
    if (modalVid) {
      modalCurrentTime = modalVid.currentTime;
      modalVid.pause();
      modalVid.muted = true;
    }
    const iframe = modalContainer.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
    }

    // 2. Remove active class and modal-open on body to trigger smooth reverse blur animations
    videoModal.classList.remove("active");
    document.body.classList.remove("modal-open");

    // Sync playhead back to active card video or showreel if applicable
    if (activeModalProject && modalCurrentTime > 0) {
      if (activeModalProject.id === "showreel" && showreelVideo) {
        try {
          showreelVideo.currentTime = modalCurrentTime;
        } catch (e) {}
      } else if (activeModalProject.id === "raw-final") {
        const rfVideoRaw = document.getElementById("rf-video-raw");
        const rfVideoFinal = document.getElementById("rf-video-final");
        try {
          if (rfVideoRaw) rfVideoRaw.currentTime = modalCurrentTime;
          if (rfVideoFinal) rfVideoFinal.currentTime = modalCurrentTime;
        } catch (e) {}
      } else if (portfolioGrid) {
        const activeCardVid = portfolioGrid.querySelector(`[data-id="${activeModalProject.id}"] .card-video`);
        if (activeCardVid) {
          try {
            activeCardVid.currentTime = modalCurrentTime;
          } catch (e) {}
        }
      }
    }

    // 3. Resume inline looping videos (portfolio cards and raw-final)
    if (activeModalProject && activeModalProject.id === "showreel" && showreelVideo) {
      showreelVideo.play().catch(() => {});
    }
    if (portfolioGrid) {
      portfolioGrid.querySelectorAll(".card-video").forEach((v) => {
        if (v.paused) {
          v.muted = true;
          v.play().catch(() => {});
        }
      });
    }
    const rfVidRaw = document.getElementById("rf-video-raw");
    const rfVidFinal = document.getElementById("rf-video-final");
    if (rfVidRaw && rfVidRaw.paused) {
      rfVidRaw.muted = true;
      rfVidRaw.volume = 0;
      rfVidRaw.play().catch(() => {});
    }
    if (rfVidFinal && rfVidFinal.paused) {
      rfVidFinal.muted = true;
      rfVidFinal.play().catch(() => {});
    }

    // 4. Clear container after transition completes so fade-out is seamless
    if (modalCloseTimer) clearTimeout(modalCloseTimer);
    modalCloseTimer = setTimeout(() => {
      if (!videoModal.classList.contains("active")) {
        modalContainer.innerHTML = "";
        activeModalProject = null;
      }
    }, 400);
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeVideoModal);

  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal && videoModal.classList.contains("active")) {
      closeVideoModal();
    }
  });

  // Expose globally for testing or manual triggers
  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModal;

  // ===========================================================================
  // 6. TESTIMONIALS RENDERING
  // ===========================================================================
  const feedbackGrid = document.getElementById("feedback-grid");
  if (feedbackGrid && data.testimonials) {
    feedbackGrid.innerHTML = data.testimonials
      .map(
        (t) => `
        <div class="feedback-card">
          <div class="feedback-quote-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
            </svg>
          </div>
          <p class="feedback-quote">"${t.quote}"</p>
          <div class="feedback-author">
            <div class="author-avatar" aria-hidden="true">${t.clientName.charAt(0)}</div>
            <div class="author-info">
              <span class="author-name">${t.clientName}</span>
              <span class="author-role">${t.role} • ${t.company}</span>
            </div>
          </div>
        </div>
      `
      )
      .join("");
  }

  // ===========================================================================
  // 7. BOOK ME & DIRECT CONTACT (GMAIL COMPOSE & SOCIAL LINKS)
  // ===========================================================================
  const setupBookingLinks = () => {
    const email = (data.personal && data.personal.email) || "nareshkumard009@gmail.com";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

    // Ensure all Email links take users directly to Gmail compose
    const emailLinks = document.querySelectorAll(".btn-book-me-action, .link-email");
    emailLinks.forEach((btn) => {
      btn.setAttribute("href", gmailUrl);
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener noreferrer");
      btn.addEventListener("click", (e) => {
        window.open(gmailUrl, "_blank", "noopener,noreferrer");
        e.preventDefault();
      });
    });

    // Social links (LinkedIn & Instagram)
    const linkedinLinks = document.querySelectorAll(".link-linkedin");
    const instagramLinks = document.querySelectorAll(".link-instagram");

    linkedinLinks.forEach((l) => {
      if (data.personal && data.personal.socials && data.personal.socials.linkedin) {
        l.setAttribute("href", data.personal.socials.linkedin);
      }
    });

    instagramLinks.forEach((l) => {
      if (data.personal && data.personal.socials && data.personal.socials.instagram) {
        l.setAttribute("href", data.personal.socials.instagram);
      }
    });
  };

  setupBookingLinks();

  // ===========================================================================
  // 8. FLUID GOOEY CURSOR (EXACT MATCH TO AKIMAFILMS.COM)
  // ===========================================================================
  const initCustomCursor = () => {
    // Only activate on devices with fine pointer (desktop mouse/trackpad)
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cursor = document.getElementById("cursor");
    if (!cursor) return;

    const TAIL_LENGTH = 20;
    let mouseX = -100;
    let mouseY = -100;
    let hasMoved = false;
    let isVisible = false;

    // Initialize array of trailing position objects
    const cursorHistory = [];
    for (let i = 0; i < TAIL_LENGTH; i++) {
      cursorHistory.push({ x: -100, y: -100 });
    }

    // Create 20 cursor circle elements
    cursor.innerHTML = "";
    for (let i = 0; i < TAIL_LENGTH; i++) {
      const div = document.createElement("div");
      div.className = "cursor-circle";
      cursor.appendChild(div);
    }
    const cursorCircles = Array.from(cursor.querySelectorAll(".cursor-circle"));

    // Track mouse position
    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        for (let i = 0; i < TAIL_LENGTH; i++) {
          cursorHistory[i].x = mouseX;
          cursorHistory[i].y = mouseY;
        }
      }

      if (!isVisible) {
        isVisible = true;
        cursor.classList.add("cursor-visible");
      }
    }, { passive: true });

    // Viewport enter / leave listeners
    document.addEventListener("mouseleave", () => {
      isVisible = false;
      cursor.classList.remove("cursor-visible");
    });

    document.addEventListener("mouseenter", () => {
      if (hasMoved) {
        isVisible = true;
        cursor.classList.add("cursor-visible");
      }
    });

    // Hover detection on interactive elements
    const interactiveSelector = "a, button, [role='button'], [role='slider'], .rf-handle-round, input, textarea, select, .progress-bar-container, .showreel-frame, .portrait-frame";
    document.addEventListener("mouseover", (e) => {
      if (e.target && e.target.closest(interactiveSelector)) {
        cursor.classList.add("cursor-hover");
      }
    }, { passive: true });

    document.addEventListener("mouseout", (e) => {
      if (e.target && e.target.closest(interactiveSelector)) {
        cursor.classList.remove("cursor-hover");
      }
    }, { passive: true });

    // Animation loop: exact akimafilms.com fluid physics
    function updateCursor() {
      if (hasMoved) {
        cursorHistory.shift();
        cursorHistory.push({ x: mouseX, y: mouseY });

        for (let i = 0; i < TAIL_LENGTH; i++) {
          const current = cursorHistory[i];
          const next = cursorHistory[i + 1] || cursorHistory[TAIL_LENGTH - 1];
          const xDiff = next.x - current.x;
          const yDiff = next.y - current.y;
          current.x += xDiff * 0.35;
          current.y += yDiff * 0.35;
          const scale = (i + 1) / TAIL_LENGTH;
          cursorCircles[i].style.transform = `translate3d(${current.x}px, ${current.y}px, 0) scale(${scale})`;
        }
      }

      requestAnimationFrame(updateCursor);
    }

    requestAnimationFrame(updateCursor);
  };

  initCustomCursor();
});

