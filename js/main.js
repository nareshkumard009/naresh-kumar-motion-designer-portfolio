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
  const tabPill = document.getElementById("tab-pill");
  const gridShort = document.getElementById("portfolio-grid-short");
  const gridLong = document.getElementById("portfolio-grid-long");
  const panelsTrack = document.getElementById("portfolio-panels-track");
  const portfolioGrid = gridShort || document.getElementById("portfolio-grid");
  const videoModal = document.getElementById("video-modal");
  const modalContainer = document.getElementById("modal-media-slot");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const bookMeBtns = document.querySelectorAll(".btn-book-me-action");

  // ===========================================================================
  // 0. CINEMATIC HERO ENTRANCE CONTROLLER
  // ===========================================================================
  const triggerHeroEntrance = () => {
    // Wait for the browser to draw the initial frame, then trigger the glide-in
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.documentElement.classList.add("hero-enter");

        // Release classes after all animations complete (1.8s) so all child elements remain 100% interactively free
        setTimeout(() => {
          document.documentElement.classList.remove("hero-prep", "hero-enter");
          document.documentElement.classList.add("hero-done");
        }, 1800);
      }, 70);
    });
  };

  triggerHeroEntrance();

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

  // Helper to activate a specific nav link by target ID
  const setActiveNavLink = (targetId) => {
    if (!targetId) return;
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${targetId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  // Nav Links Click Handling (Immediate active underline switch + smooth scroll locking)
  let isNavClickScrolling = false;
  let navClickTimeout = null;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const targetId = href.substring(1);

      setActiveNavLink(targetId);

      // Lock scroll spy while smooth scrolling occurs
      isNavClickScrolling = true;
      clearTimeout(navClickTimeout);
      navClickTimeout = setTimeout(() => {
        isNavClickScrolling = false;
      }, 900);
    });
  });

  const navBrand = document.querySelector(".nav-brand");
  if (navBrand) {
    navBrand.addEventListener("click", () => {
      setActiveNavLink("hero");
      isNavClickScrolling = true;
      clearTimeout(navClickTimeout);
      navClickTimeout = setTimeout(() => {
        isNavClickScrolling = false;
      }, 900);
    });
  }

  // Active Nav Link Spy: Targets ALL sections and footer with an ID
  const navTargets = document.querySelectorAll("section[id], footer[id]");

  const updateActiveNavOnScroll = () => {
    if (isNavClickScrolling) return;

    // 1. Detect if scrolled to or near bottom of page -> activate #contact
    const scrollBottom = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (documentHeight - scrollBottom <= 100) {
      setActiveNavLink("contact");
      return;
    }

    // 2. Detect section at current scroll position
    const navBarHeight = navbar ? navbar.offsetHeight : 70;
    const scrollPosition = window.scrollY + navBarHeight + 60;

    let currentSectionId = null;
    navTargets.forEach((target) => {
      const top = target.offsetTop;
      const height = target.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = target.getAttribute("id");
      }
    });

    // If at the very top of the page, default to hero
    if (window.scrollY < 80) {
      currentSectionId = "hero";
    }

    if (currentSectionId) {
      setActiveNavLink(currentSectionId);
    }
  };

  window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });
  updateActiveNavOnScroll();

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

  // Helper to strictly update a card video's muted state and keep its volume button in sync
  const setCardMuted = (card, muted) => {
    if (!card) return;
    const video = card.querySelector(".card-video");
    const soundBtn = card.querySelector(".ctrl-sound");
    if (video) {
      video.muted = muted;
    }
    if (soundBtn) {
      const iconMuted = soundBtn.querySelector(".icon-muted");
      const iconUnmuted = soundBtn.querySelector(".icon-unmuted");
      if (muted) {
        if (iconMuted) iconMuted.style.display = "block";
        if (iconUnmuted) iconUnmuted.style.display = "none";
        soundBtn.setAttribute("aria-label", "Unmute video");
        soundBtn.setAttribute("title", "Sound Off (Click to unmute)");
      } else {
        if (iconMuted) iconMuted.style.display = "none";
        if (iconUnmuted) iconUnmuted.style.display = "block";
        soundBtn.setAttribute("aria-label", "Mute video");
        soundBtn.setAttribute("title", "Sound On (Click to mute)");
      }
    }
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
      document.querySelectorAll(".portfolio-card").forEach((c) => {
        setCardMuted(c, true);
      });

      // Mute RAW/FINAL comparison video if unmuted
      if (typeof window.muteRawFinalComparison === "function") {
        window.muteRawFinalComparison();
      } else {
        const rfVideoFinal = document.getElementById("rf-video-final");
        const rfVideoRaw = document.getElementById("rf-video-raw");
        if (rfVideoFinal) rfVideoFinal.muted = true;
        if (rfVideoRaw) rfVideoRaw.muted = true;
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

    // Viewport observer to pause and mute showreel video when scrolled away
    try {
      const showreelObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && showreelVideo) {
            if (!showreelVideo.paused) {
              showreelVideo.pause();
            }
            if (!showreelVideo.muted) {
              showreelVideo.muted = true;
              updateShowreelSoundIcons();
            }
          }
        });
      }, { threshold: 0.1 });
      showreelObserver.observe(showreelVideo);
    } catch (e) {}
  }

  // ===========================================================================
  // 2.5 CREDIBILITY STATS (STATIC DISPLAY)
  // ===========================================================================
  const statsBanner = document.querySelector(".about-stats-banner");
  if (statsBanner) {
    const statItems = statsBanner.querySelectorAll(".stat-item");

    // Sync from portfolioData.stats if provided
    if (Array.isArray(data.stats) && data.stats.length > 0) {
      statItems.forEach((item, index) => {
        if (data.stats[index]) {
          const numEl = item.querySelector(".stat-number");
          const lblEl = item.querySelector(".stat-label");
          if (numEl) {
            const suffix = data.stats[index].suffix !== undefined ? data.stats[index].suffix : "+";
            numEl.textContent = `${data.stats[index].value}${suffix}`;
          }
          if (lblEl && data.stats[index].label) {
            lblEl.textContent = data.stats[index].label;
          }
        }
      });
    }
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

  // State for view more toggle and drag scroll
  let isShortFormExpanded = false;
  let isCardDragScroll = false;

  // Dynamic 40% black feathered vignette overlay for Short-Form carousel
  const updateFeatherOverlays = () => {
    const featherLeft = document.getElementById("portfolio-feather-left");
    const featherRight = document.getElementById("portfolio-feather-right");
    const activeScrollEl = gridShort || portfolioGrid;
    if (!featherLeft || !featherRight || !activeScrollEl) return;

    if (currentCategory !== "shortForm") {
      featherLeft.classList.remove("is-visible");
      featherRight.classList.remove("is-visible");
      return;
    }

    const scrollLeft = activeScrollEl.scrollLeft;
    const scrollWidth = activeScrollEl.scrollWidth;
    const clientWidth = activeScrollEl.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 8) {
      featherLeft.classList.remove("is-visible");
      featherRight.classList.remove("is-visible");
      return;
    }

    // Left feather: no overlay when reached the start, visible as we scroll right
    if (scrollLeft > 10) {
      featherLeft.classList.add("is-visible");
    } else {
      featherLeft.classList.remove("is-visible");
    }

    // Right feather: visible while more content remains, disappears as we reach the rightmost end
    if (scrollLeft < maxScroll - 10) {
      featherRight.classList.add("is-visible");
    } else {
      featherRight.classList.remove("is-visible");
    }
  };

  // ===========================================================================
  // 4. PORTFOLIO TABS & GRID RENDERING
  // ===========================================================================
  const renderPortfolio = (categoryKey, targetContainer) => {
    const container = targetContainer || (categoryKey === "shortForm" ? gridShort : gridLong) || portfolioGrid;
    if (!container) return;

    const items = data.portfolio[categoryKey] || [];
    const isShort = categoryKey === "shortForm";

    const viewMoreWrap = document.getElementById("portfolio-action-wrap");
    if (viewMoreWrap) {
      viewMoreWrap.style.display = "none";
    }

    container.innerHTML = items
      .map((item, idx) => {
        if (isShort) {
          // Short-Form: Single horizontal row of all 8 videos, direct autoplaying muted loop video with minimal controls
          return `
            <div 
              class="portfolio-card card-short" 
              data-id="${item.id}"
              data-index="${idx}"
              role="article"
              aria-label="${item.title}"
            >
              <div class="card-media">
                <video 
                  class="card-video" 
                  muted 
                  loop 
                  playsinline 
                  preload="metadata"
                  poster="${item.thumbnail || item.fallbackThumbnail || 'public/thumbnails/placeholder-short.svg'}"
                  disablePictureInPicture
                  disableRemotePlayback
                  data-video-id="${item.id}"
                >
                  <source src="${item.videoUrl}" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <!-- Minimal Video Controls Overlay (Play/Pause, Sound, Timeline Scroller, Fullscreen) -->
                <div class="card-video-controls" aria-label="Video Controls">
                  <div class="ctrl-btn-group">
                    <!-- Play / Pause -->
                    <button class="video-ctrl-btn ctrl-play" aria-label="Play video" title="Play / Pause">
                      <svg class="icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                      <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display: block; transform: translateX(1px);">
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
          // Long-Form: 16:9 cinematic widescreen cards, muted loop playback when visible with minimal controls UI
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
                  muted 
                  loop 
                  playsinline 
                  preload="metadata"
                  poster="${item.thumbnail || item.fallbackThumbnail || 'public/thumbnails/placeholder-long.svg'}"
                  disablePictureInPicture
                  disableRemotePlayback
                  data-video-id="${item.id}"
                >
                  <source src="${item.videoUrl}" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <!-- Minimal Video Controls Overlay (Play/Pause, Sound, Timeline Scroller, Fullscreen) -->
                <div class="card-video-controls" aria-label="Video Controls">
                  <div class="ctrl-btn-group">
                    <!-- Play / Pause -->
                    <button class="video-ctrl-btn ctrl-play" aria-label="Play video" title="Play / Pause">
                      <svg class="icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                        <rect x="6" y="4" width="4" height="16" rx="1"/>
                        <rect x="14" y="4" width="4" height="16" rx="1"/>
                      </svg>
                      <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display: block; transform: translateX(1px);">
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
    container.querySelectorAll(".portfolio-card").forEach((card) => {
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
        // Start muted and paused; playback is strictly governed by viewport scroll visibility
        video.muted = true;
        video.pause();

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
              delete card.dataset.userPaused;
              video.play().catch(() => {});
            } else {
              card.dataset.userPaused = "true";
              video.pause();
            }
            updatePlayIcons();
          });

          video.addEventListener("play", updatePlayIcons);
          video.addEventListener("pause", updatePlayIcons);
          updatePlayIcons();
        }

        // Sound On / Off Toggle
        if (soundBtn) {
          const updateSoundIcons = () => {
            setCardMuted(card, video.muted);
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
              if (typeof window.muteRawFinalComparison === "function") {
                window.muteRawFinalComparison();
              } else {
                const rfVideoFinal = document.getElementById("rf-video-final");
                const rfVideoRaw = document.getElementById("rf-video-raw");
                if (rfVideoFinal) rfVideoFinal.muted = true;
                if (rfVideoRaw) rfVideoRaw.muted = true;
              }

              // Mute all other card videos so only this video plays sound
              document.querySelectorAll(".portfolio-card").forEach((c) => {
                if (c !== card) {
                  setCardMuted(c, true);
                }
              });

              setCardMuted(card, false);
              video.volume = 1;
            } else {
              setCardMuted(card, true);
            }
          });

          // Always listen to volumechange so UI stays 100% in sync whenever video.muted changes
          video.addEventListener("volumechange", updateSoundIcons);
          updateSoundIcons();
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

        // Fullscreen / Expand into Lightbox Modal with Fullscreen
        if (fullscreenBtn) {
          fullscreenBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (project) {
              const currentTime = video ? video.currentTime : 0;
              if (video) video.pause();
              openVideoModal(project, currentTime, true);
            }
          });
        }

        // Clicking card info or media area (outside controls) opens centered lightbox modal
        card.addEventListener("click", (e) => {
          if (isCardDragScroll) return;
          if (e.target.closest(".card-video-controls")) return;
          if (project) {
            const currentTime = video ? video.currentTime : 0;
            if (video) video.pause();
            openVideoModal(project, currentTime, false);
          }
        });
      }
    });

    // Viewport visibility is managed globally by updatePortfolioCardPlayback()
  };

  // Smooth Segmented Tab Switch Pill Positioner
  const updateTabPill = (animate = true) => {
    if (!tabPill) return;
    const activeBtn = document.querySelector(".tab-group .tab-btn.active");
    if (!activeBtn) return;

    if (!animate) {
      tabPill.style.transition = "none";
    } else {
      tabPill.style.transition = "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1), width 0.38s cubic-bezier(0.16, 1, 0.3, 1)";
    }

    tabPill.style.width = `${activeBtn.offsetWidth}px`;
    tabPill.style.transform = `translateX(${activeBtn.offsetLeft}px)`;
  };

  // Smooth Category Switching between Short-Form and Long-Form
  let trackHeightTimeout = null;

  const switchPortfolioCategory = (categoryKey) => {
    if (currentCategory === categoryKey) return;
    const isGoingToLong = categoryKey === "longForm";
    currentCategory = categoryKey;

    // 1. Update Tab buttons & glide the sliding pill
    if (tabShortBtn && tabLongBtn) {
      if (isGoingToLong) {
        tabLongBtn.classList.add("active");
        tabLongBtn.setAttribute("aria-selected", "true");
        tabShortBtn.classList.remove("active");
        tabShortBtn.setAttribute("aria-selected", "false");
      } else {
        tabShortBtn.classList.add("active");
        tabShortBtn.setAttribute("aria-selected", "true");
        tabLongBtn.classList.remove("active");
        tabLongBtn.setAttribute("aria-selected", "false");
      }
      updateTabPill(true);
    }

    if (!gridShort || !gridLong || !panelsTrack) return;

    const outgoingPanel = isGoingToLong ? gridShort : gridLong;
    const incomingPanel = isGoingToLong ? gridLong : gridShort;

    // 2. Animate container height smoothly
    const startHeight = outgoingPanel.offsetHeight;
    const prevPos = incomingPanel.style.position;
    const prevVis = incomingPanel.style.visibility;
    incomingPanel.style.position = "static";
    incomingPanel.style.visibility = "hidden";
    const targetHeight = incomingPanel.offsetHeight;
    incomingPanel.style.position = prevPos;
    incomingPanel.style.visibility = prevVis;

    panelsTrack.style.height = `${startHeight}px`;
    void panelsTrack.offsetHeight; // force reflow
    panelsTrack.style.transition = "height 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
    panelsTrack.style.height = `${targetHeight}px`;

    // 3. Smooth sliding panel motion
    if (isGoingToLong) {
      // Short-form glides out to the left
      outgoingPanel.classList.remove("is-active", "is-hidden-right");
      outgoingPanel.classList.add("is-hidden-left");

      // Long-form glides in from the right
      incomingPanel.classList.remove("is-hidden-left", "is-hidden-right");
      incomingPanel.classList.add("is-active");

      // Pause outgoing videos and mute them
      outgoingPanel.querySelectorAll(".portfolio-card").forEach((c) => {
        const v = c.querySelector(".card-video");
        if (v && !v.paused) v.pause();
        setCardMuted(c, true);
      });

      // Play only videos in the incoming panel that are currently visible in the viewport
      schedulePortfolioCardPlayback();
    } else {
      // Long-form glides out to the right
      outgoingPanel.classList.remove("is-active", "is-hidden-left");
      outgoingPanel.classList.add("is-hidden-right");

      // Short-form glides in from the left
      incomingPanel.classList.remove("is-hidden-left", "is-hidden-right");
      incomingPanel.classList.add("is-active");

      // Pause outgoing videos and mute them
      outgoingPanel.querySelectorAll(".portfolio-card").forEach((c) => {
        const v = c.querySelector(".card-video");
        if (v && !v.paused) v.pause();
        setCardMuted(c, true);
      });

      // Play only videos in the incoming panel that are currently visible in the viewport
      schedulePortfolioCardPlayback();
    }

    // 4. Update feather overlays
    updateFeatherOverlays();

    // Release height lock after animation
    clearTimeout(trackHeightTimeout);
    trackHeightTimeout = setTimeout(() => {
      panelsTrack.style.height = "auto";
      schedulePortfolioCardPlayback();
    }, 460);
  };

  // Wire up Tab Button Click Handlers
  if (tabShortBtn && tabLongBtn) {
    tabShortBtn.addEventListener("click", () => {
      switchPortfolioCategory("shortForm");
    });

    tabLongBtn.addEventListener("click", () => {
      switchPortfolioCategory("longForm");
    });
  }

  // Smooth mouse drag-to-scroll for desktop short-form horizontal single row
  let isGridDragging = false;
  let gridStartX = 0;
  let gridInitialScrollLeft = 0;

  if (gridShort) {
    gridShort.addEventListener("mousedown", (e) => {
      if (currentCategory !== "shortForm") return;
      if (e.target.closest("button") || e.target.closest(".ctrl-timeline-wrap")) return;
      isGridDragging = true;
      isCardDragScroll = false;
      gridStartX = e.pageX - gridShort.offsetLeft;
      gridInitialScrollLeft = gridShort.scrollLeft;
      gridShort.classList.add("is-dragging");
    });

    window.addEventListener("mouseup", () => {
      if (isGridDragging) {
        isGridDragging = false;
        if (gridShort) gridShort.classList.remove("is-dragging");
        setTimeout(() => {
          isCardDragScroll = false;
        }, 50);
      }
    });

    gridShort.addEventListener("mousemove", (e) => {
      if (!isGridDragging || currentCategory !== "shortForm") return;
      const currentX = e.pageX - gridShort.offsetLeft;
      const walk = (currentX - gridStartX) * 1.5;
      if (Math.abs(walk) > 6) {
        isCardDragScroll = true;
      }
      gridShort.scrollLeft = gridInitialScrollLeft - walk;
    });

    gridShort.addEventListener("scroll", updateFeatherOverlays, { passive: true });
    window.addEventListener("resize", () => {
      updateFeatherOverlays();
      updateTabPill(false);
    }, { passive: true });
  }

  // Populate Both Portfolio Panels at Startup
  if (gridShort) {
    renderPortfolio("shortForm", gridShort);
  }

  if (gridLong) {
    renderPortfolio("longForm", gridLong);
  }

  // Position pill immediately on load
  updateTabPill(false);
  setTimeout(() => updateTabPill(false), 60);
  setTimeout(() => updateTabPill(false), 250);

  updateFeatherOverlays();

  // ===========================================================================
  // 4.1 VIEWPORT-AWARE PORTFOLIO VIDEO PLAYBACK CONTROLLER
  // Only plays card videos when scrolled into view and inside the active tab.
  // When off-screen, scrolled away, or in an inactive tab, videos strictly pause!
  // ===========================================================================
  let cardPlaybackRaf = null;

  const updatePortfolioCardPlayback = () => {
    if (document.hidden) return;

    const activePanel = document.querySelector(".portfolio-panel.is-active");
    const inactivePanels = document.querySelectorAll(".portfolio-panel:not(.is-active)");

    // Ensure all videos in inactive panels are strictly paused and muted
    inactivePanels.forEach((panel) => {
      panel.querySelectorAll(".portfolio-card").forEach((c) => {
        const v = c.querySelector(".card-video");
        if (v && !v.paused) v.pause();
        setCardMuted(c, true);
      });
    });

    if (!activePanel) return;

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const panelRect = activePanel.getBoundingClientRect();

    // If the active panel is completely outside the viewport vertically, pause and mute all its videos
    if (panelRect.bottom < 40 || panelRect.top > vh - 40) {
      activePanel.querySelectorAll(".portfolio-card").forEach((c) => {
        const v = c.querySelector(".card-video");
        if (v && !v.paused) v.pause();
        setCardMuted(c, true);
      });
      return;
    }

    const isShortRow = activePanel.classList.contains("grid-short-form");
    const cards = activePanel.querySelectorAll(".portfolio-card");

    cards.forEach((card) => {
      const video = card.querySelector(".card-video");
      if (!video) return;

      // If user manually paused this card, keep it paused
      if (card.dataset.userPaused === "true") {
        if (!video.paused) video.pause();
        return;
      }

      const rect = card.getBoundingClientRect();
      const inVerticalView = rect.top < vh - 50 && rect.bottom > 50;
      let inHorizontalView = rect.left < vw - 20 && rect.right > 20;

      // If in short-form horizontal row, must also be visible inside the horizontal scroll boundaries!
      if (isShortRow) {
        inHorizontalView = inHorizontalView && (rect.left < panelRect.right - 25 && rect.right > panelRect.left + 25);
      }

      if (inVerticalView && inHorizontalView) {
        if (video.paused) {
          // When entering view or coming back, video is muted and volume button strictly shows OFF
          setCardMuted(card, true);
          const playPromise = video.play();
          if (playPromise !== undefined) playPromise.catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
        // When scrolled away, ensure video is muted and volume button shows OFF immediately
        if (!video.muted) {
          setCardMuted(card, true);
        }
      }
    });
  };

  const schedulePortfolioCardPlayback = () => {
    if (cardPlaybackRaf) return;
    cardPlaybackRaf = requestAnimationFrame(() => {
      cardPlaybackRaf = null;
      updatePortfolioCardPlayback();
    });
  };

  // Wire scroll and resize listeners for smooth playback updates
  window.addEventListener("scroll", schedulePortfolioCardPlayback, { passive: true });
  window.addEventListener("resize", schedulePortfolioCardPlayback, { passive: true });

  if (gridShort) {
    gridShort.addEventListener("scroll", schedulePortfolioCardPlayback, { passive: true });
  }

  // Initial playback check
  schedulePortfolioCardPlayback();
  setTimeout(schedulePortfolioCardPlayback, 200);

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
          if (titleEl) {
            titleEl.innerHTML = rfConfig.title.includes("rf-title-arrow")
              ? rfConfig.title
              : rfConfig.title.replace("→", '<span class="rf-title-arrow">→</span>');
          }
        }
        if (rfConfig.subtitle) {
          const subEl = rfSection.querySelector(".section-subtext");
          if (subEl) {
            subEl.textContent = rfConfig.subtitle;
          }
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

    // Overall Audio State (controlled by comparison slider and mute/unmute button)
    let isOverallMuted = true;
    let masterVolume = 1.0;

    // Both videos start muted for browser autoplay compliance
    rfVideoRaw.muted = true;
    rfVideoRaw.volume = 1.0;
    rfVideoFinal.muted = true;
    rfVideoFinal.volume = 0.5;

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

    // Both videos start paused and locked at time 0.
    // Playback is activated strictly when the user scrolls into the RAW -> FINAL section!
    rfVideoRaw.muted = true;
    rfVideoFinal.muted = true;
    rfVideoRaw.pause();
    rfVideoFinal.pause();
    rfVideoRaw.currentTime = 0;
    rfVideoFinal.currentTime = 0;

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
    let isRfActiveInView = false;

    const runSyncLoop = () => {
      if (isRfActiveInView && !userExplicitlyPaused && !isScrubbingTimeline) {
        if (!rfVideoFinal.paused && rfVideoRaw.paused) {
          rfVideoRaw.play().catch(() => {});
        }

        const diff = rfVideoRaw.currentTime - rfVideoFinal.currentTime;
        const absDiff = Math.abs(diff);

        if (absDiff > 0.015 && absDiff < 0.6) {
          const rate = Math.min(Math.max(1.0 - (diff * 2.0), 0.75), 1.25);
          rfVideoRaw.playbackRate = rate;
        } else if (absDiff <= 0.015) {
          rfVideoRaw.playbackRate = 1.0;
        } else if (absDiff >= 0.6) {
          if (!rfVideoRaw.seeking && !rfVideoFinal.seeking) {
            rfVideoRaw.currentTime = rfVideoFinal.currentTime;
            rfVideoRaw.playbackRate = 1.0;
          }
        }
      }

      if (isRfActiveInView && !userExplicitlyPaused) {
        syncRafId = requestAnimationFrame(runSyncLoop);
      } else {
        syncRafId = null;
      }
    };

    const startSyncLoop = () => {
      if (!syncRafId && isRfActiveInView && !userExplicitlyPaused) {
        syncRafId = requestAnimationFrame(runSyncLoop);
      }
    };

    const stopSyncLoop = () => {
      if (syncRafId) {
        cancelAnimationFrame(syncRafId);
        syncRafId = null;
      }
    };

    // =========================================================================
    // Comparison Slider Divider (Vertical Line with Centered Round Handle)
    // Directly updates inline clipPath and CSS variable for zero-latency response
    // =========================================================================
    let isDraggingSplit = false;
    let currentSplitX = 50;
    let splitRafId = null;

    // Dynamic Audio Volume Calculator (Unchanged behavior: RAW 100%, FINAL scales with reveal)
    const applyAudioVolumes = () => {
      // revealRatio: 0 = RAW fully revealed (FINAL 0%), 1 = FINAL fully revealed (RAW + FINAL)
      const finalRatio = Math.min(Math.max((100 - currentSplitX) / 100, 0), 1);

      if (isOverallMuted || masterVolume <= 0) {
        rfVideoRaw.muted = true;
        rfVideoFinal.muted = true;
      } else {
        // Audio of RAW video is always 100% (scaled by overall master volume)
        rfVideoRaw.muted = false;
        rfVideoRaw.volume = Math.min(Math.max(masterVolume * 1.0, 0), 1);

        // Audio of FINAL video scales as slider reveals final (0% at raw, 100% at final)
        const finalVol = Math.min(Math.max(masterVolume * finalRatio, 0), 1);
        rfVideoFinal.volume = finalVol;
        // Mute final track when volume is 0 to avoid any audio bleed
        rfVideoFinal.muted = finalVol <= 0.001;
      }

      // Update sound icons on the volume button
      if (rfSoundBtn) {
        const iconMuted = rfSoundBtn.querySelector(".icon-muted");
        const iconUnmuted = rfSoundBtn.querySelector(".icon-unmuted");
        if (isOverallMuted || masterVolume <= 0) {
          if (iconMuted) iconMuted.style.display = "block";
          if (iconUnmuted) iconUnmuted.style.display = "none";
          rfSoundBtn.setAttribute("aria-label", "Unmute comparison");
        } else {
          if (iconMuted) iconMuted.style.display = "none";
          if (iconUnmuted) iconUnmuted.style.display = "block";
          rfSoundBtn.setAttribute("aria-label", "Mute comparison");
        }
      }

    };

    const setSplitX = (pct) => {
      currentSplitX = Math.min(Math.max(pct, 0), 100);
      if (splitRafId) cancelAnimationFrame(splitRafId);
      splitRafId = requestAnimationFrame(() => {
        rfStage.style.setProperty("--split-pos-x", `${currentSplitX}%`);
        if (rfLayerFinal) {
          // Left side reveals RAW (base layer), right side reveals FINAL (top layer)
          const clipVal = `inset(0 0 0 ${currentSplitX}%)`;
          rfLayerFinal.style.clipPath = clipVal;
          rfLayerFinal.style.webkitClipPath = clipVal;
        }
        if (rfDivider) {
          rfDivider.style.left = `${currentSplitX}%`;
          rfDivider.setAttribute("aria-valuenow", Math.round(currentSplitX));
        }
        applyAudioVolumes();
      });
    };

    // Initialize clip-path at 50%
    setSplitX(50);

    const calcSplitFromClientX = (clientX) => {
      const rect = rfStage.getBoundingClientRect();
      if (rect.width <= 0) return;
      const offsetX = clientX - rect.left;
      const pct = (offsetX / rect.width) * 100;
      setSplitX(pct);
    };

    const onSplitPointerMove = (e) => {
      if (!isDraggingSplit) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      calcSplitFromClientX(clientX);
      if (window.updateCustomCursor) {
        window.updateCustomCursor(clientX, clientY);
      }
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
      isDraggingSplit = true;
      rfStage.classList.add("is-dragging");

      try {
        rfStage.setPointerCapture(e.pointerId);
      } catch (err) {}

      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      calcSplitFromClientX(clientX);
      if (window.updateCustomCursor) {
        window.updateCustomCursor(clientX, clientY);
      }

      window.addEventListener("pointermove", onSplitPointerMove, { passive: true });
      window.addEventListener("pointerup", onSplitPointerUp);
      window.addEventListener("pointercancel", onSplitPointerUp);
    });

    // Also listen on rfStage directly for captured pointer moves
    rfStage.addEventListener("pointermove", (e) => {
      if (isDraggingSplit) {
        onSplitPointerMove(e);
      }
    }, { passive: true });

    // Keyboard support on vertical divider (Left / Right arrows)
    if (rfDivider) {
      rfDivider.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          setSplitX(currentSplitX - 5);
        } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          setSplitX(currentSplitX + 5);
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
        if (userExplicitlyPaused || (rfVideoFinal.paused && rfVideoRaw.paused)) {
          userExplicitlyPaused = false;
          playBoth();
          startSyncLoop();
          updatePlayIcons(true);
        } else {
          userExplicitlyPaused = true;
          pauseBoth();
          stopSyncLoop();
          updatePlayIcons(false);
        }
      });
      // Initial state is paused with play icon
      updatePlayIcons(false);
    }

    // Overall Volume Control (Volume button beside pause button controls master audio)
    if (rfSoundBtn) {
      rfSoundBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        if (isOverallMuted || masterVolume <= 0) {
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
          document.querySelectorAll(".portfolio-card").forEach((c) => {
            setCardMuted(c, true);
          });

          isOverallMuted = false;
          if (masterVolume <= 0) masterVolume = 1.0;
        } else {
          isOverallMuted = true;
        }

        applyAudioVolumes();
        playBoth();
      });
    }

    // Global hook for cleanly muting comparison when other page elements play
    window.muteRawFinalComparison = () => {
      isOverallMuted = true;
      applyAudioVolumes();
    };

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
        handleTimelineScrub(moveEvt, false);
        if (window.updateCustomCursor && moveEvt.clientX !== undefined) {
          window.updateCustomCursor(moveEvt.clientX, moveEvt.clientY);
        }
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
        e.stopPropagation();
        isScrubbingTimeline = true;
        rfTimelineWrap.classList.add("is-dragging");

        try {
          rfTimelineWrap.setPointerCapture(e.pointerId);
        } catch (err) {}

        handleTimelineScrub(e, false);
        if (window.updateCustomCursor && e.clientX !== undefined) {
          window.updateCustomCursor(e.clientX, e.clientY);
        }

        window.addEventListener("pointermove", onTimelineMove, { passive: true });
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

    // Viewport IntersectionObserver to play RAW -> FINAL strictly when user scrolls into view,
    // and immediately pause when scrolled away to completely free hardware decoders and CPU sync loops!
    try {
      const stageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isRfActiveInView = true;
            if (!userExplicitlyPaused) {
              playBoth();
              startSyncLoop();
              updatePlayIcons(true);
            }
          } else {
            isRfActiveInView = false;
            pauseBoth();
            stopSyncLoop();
            updatePlayIcons(false);
            if (!isOverallMuted) {
              isOverallMuted = true;
              applyAudioVolumes();
            }
          }
        });
      }, { threshold: 0.15 });
      stageObserver.observe(rfStage);
    } catch (e) {}

    // Expose global hooks for modal close & page visibility
    window.checkRfVisibility = () => {
      if (!rfStage) return;
      const rect = rfStage.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const inView = rect.bottom > 80 && rect.top < vh - 80;
      if (inView) {
        isRfActiveInView = true;
        if (!userExplicitlyPaused) {
          playBoth();
          startSyncLoop();
          updatePlayIcons(true);
        }
      } else {
        isRfActiveInView = false;
        pauseBoth();
        stopSyncLoop();
        updatePlayIcons(false);
      }
    };

    window.stopRfComparison = () => {
      isRfActiveInView = false;
      pauseBoth();
      stopSyncLoop();
      updatePlayIcons(false);
    };
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

  function openVideoModal(project, startTime = 0, startFullscreen = false) {
    if (!project || !videoModal || !modalContainer) return;
    if (modalCloseTimer) clearTimeout(modalCloseTimer);
    activeModalProject = project;

    // Pause all inline videos
    if (showreelVideo && !showreelVideo.paused) {
      showreelVideo.pause();
    }
    document.querySelectorAll(".portfolio-card").forEach((c) => {
      const v = c.querySelector(".card-video");
      if (v && !v.paused) v.pause();
      setCardMuted(c, true);
    });
    const rfVideoRaw = document.getElementById("rf-video-raw");
    const rfVideoFinal = document.getElementById("rf-video-final");
    if (rfVideoRaw && !rfVideoRaw.paused) rfVideoRaw.pause();
    if (rfVideoFinal && !rfVideoFinal.paused) rfVideoFinal.pause();

    if (modalTitle) modalTitle.textContent = project.title || "Project Video";
    if (modalDescription) modalDescription.textContent = project.description || "";

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
      // Native HTML5 MP4 Player with Custom Glass Controls Overlay
      const posterAttr = project.thumbnail || project.fallbackThumbnail ? `poster="${project.thumbnail || project.fallbackThumbnail}"` : "";
      modalContainer.innerHTML = `
        <video 
          class="modal-video-player" 
          autoplay 
          playsinline 
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          ${posterAttr}
        >
          <source src="${project.videoUrl}" type="video/mp4" />
          <source src="${project.id === 'showreel' ? 'public/videos/showreel.mp4' : (isShort ? 'public/videos/8views -1.mp4' : 'public/videos/long-01.mp4')}" type="video/mp4" />
          <source src="public/videos/showreel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <!-- Center Big Play Button Overlay -->
        <button class="modal-big-play" id="modal-big-play" aria-label="Play video">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
        </button>

        <!-- Custom Video Controls Overlay (Play/Pause, Sound + Volume Slider, Timeline Scroller, Fullscreen) -->
        <div class="card-video-controls modal-video-controls" id="modal-video-controls" aria-label="Modal Video Controls">
          <div class="ctrl-btn-group">
            <!-- Play / Pause -->
            <button class="video-ctrl-btn ctrl-play" id="modal-ctrl-play" aria-label="Pause video" title="Play / Pause (Space)">
              <svg class="icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display: none; transform: translateX(1px);">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </button>

            <!-- Sound On / Off -->
            <button class="video-ctrl-btn ctrl-sound" id="modal-ctrl-sound" aria-label="Mute video" title="Sound On / Off (M)">
              <svg class="icon-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
              <svg class="icon-unmuted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>

          <!-- Video Timeline Scroller Slider -->
          <div class="ctrl-timeline-wrap" id="modal-timeline-wrap" title="Drag to seek (Left/Right arrow)" role="slider" aria-label="Video Timeline" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" tabindex="0">
            <div class="timeline-track" id="modal-timeline-track">
              <div class="timeline-progress" id="modal-timeline-progress"></div>
              <div class="timeline-thumb" id="modal-timeline-thumb"></div>
            </div>
            <span class="timeline-time">
              <span class="time-current" id="modal-time-current">0:00</span>
              <span class="time-total" id="modal-time-total"> / ${project.duration || (isShort ? '0:30' : '01:30')}</span>
            </span>
          </div>

          <!-- Fullscreen Toggle Button -->
          <button class="video-ctrl-btn ctrl-fullscreen" id="modal-ctrl-fullscreen" aria-label="Fullscreen" title="Fullscreen (F)">
            <svg class="icon-expand" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            <svg class="icon-compress" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="10" y1="14" x2="3" y2="21" />
            </svg>
          </button>
        </div>
      `;

      const modalVid = modalContainer.querySelector("video");
      const modalBigPlay = modalContainer.querySelector("#modal-big-play");
      const modalPlayBtn = modalContainer.querySelector("#modal-ctrl-play");
      const modalSoundBtn = modalContainer.querySelector("#modal-ctrl-sound");
      const modalFullscreenBtn = modalContainer.querySelector("#modal-ctrl-fullscreen");
      const modalTimelineWrap = modalContainer.querySelector("#modal-timeline-wrap");
      const modalTimelineTrack = modalContainer.querySelector("#modal-timeline-track");
      const modalTimelineProgress = modalContainer.querySelector("#modal-timeline-progress");
      const modalTimelineThumb = modalContainer.querySelector("#modal-timeline-thumb");
      const modalTimeCurrent = modalContainer.querySelector("#modal-time-current");
      const modalTimeTotal = modalContainer.querySelector("#modal-time-total");

      if (modalVid) {
        if (typeof startTime === "number" && startTime > 0) {
          try {
            modalVid.currentTime = startTime;
          } catch (e) {}
        } else {
          modalVid.currentTime = 0;
        }

        // Try unmuted audio first since user intentionally clicked video
        modalVid.muted = false;
        modalVid.volume = 1;

        const playPromise = modalVid.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Unmuted autoplay restricted by browser; starting muted:", err);
            modalVid.muted = true;
            modalVid.play().catch(e => console.error("Autoplay attempt failed:", e));
          });
        }

        // 1. Play / Pause Handling
        const updatePlayUI = () => {
          const isPaused = modalVid.paused;
          if (modalContainer) {
            modalContainer.classList.toggle("is-playing", !isPaused);
          }
          if (modalPlayBtn) {
            const pPause = modalPlayBtn.querySelector(".icon-pause");
            const pPlay = modalPlayBtn.querySelector(".icon-play");
            if (pPause) pPause.style.display = isPaused ? "none" : "block";
            if (pPlay) pPlay.style.display = isPaused ? "block" : "none";
            modalPlayBtn.setAttribute("aria-label", isPaused ? "Play video" : "Pause video");
          }
        };

        const toggleModalPlay = (e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (modalVid.paused) {
            modalVid.play().catch(() => {});
          } else {
            modalVid.pause();
          }
        };

        if (modalPlayBtn) modalPlayBtn.addEventListener("click", toggleModalPlay);
        if (modalBigPlay) modalBigPlay.addEventListener("click", toggleModalPlay);
        modalVid.addEventListener("click", (e) => {
          toggleModalPlay(e);
        });

        modalVid.addEventListener("play", updatePlayUI);
        modalVid.addEventListener("pause", updatePlayUI);
        updatePlayUI();

        // 2. Sound Mute / Unmute Handling
        const updateSoundUI = () => {
          const isMuted = modalVid.muted;
          if (modalSoundBtn) {
            const sm = modalSoundBtn.querySelector(".icon-muted");
            const su = modalSoundBtn.querySelector(".icon-unmuted");
            if (sm) sm.style.display = isMuted ? "block" : "none";
            if (su) su.style.display = isMuted ? "none" : "block";
            modalSoundBtn.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");
          }
        };

        if (modalSoundBtn) {
          modalSoundBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            modalVid.muted = !modalVid.muted;
            if (!modalVid.muted) modalVid.volume = 1;
            updateSoundUI();
          });
        }

        modalVid.addEventListener("volumechange", updateSoundUI);
        updateSoundUI();


        // 3. Timeline Scroller & Seeking
        let isDragging = false;
        const updateTimelineUI = (currentTime, duration) => {
          if (isNaN(currentTime)) return;
          const validDuration = duration && !isNaN(duration) && duration > 0 ? duration : 0;
          const pct = validDuration > 0 ? Math.min(Math.max((currentTime / validDuration) * 100, 0), 100) : 0;

          if (modalTimelineProgress) modalTimelineProgress.style.width = `${pct}%`;
          if (modalTimelineThumb) modalTimelineThumb.style.left = `${pct}%`;
          if (modalTimeCurrent) modalTimeCurrent.textContent = formatTime(currentTime);
          if (modalTimeTotal && validDuration > 0) {
            modalTimeTotal.textContent = ` / ${formatTime(validDuration)}`;
          }
          if (modalTimelineWrap) modalTimelineWrap.setAttribute("aria-valuenow", Math.round(pct));
        };

        modalVid.addEventListener("timeupdate", () => {
          if (!isDragging) {
            updateTimelineUI(modalVid.currentTime, modalVid.duration);
          }
        });

        modalVid.addEventListener("loadedmetadata", () => {
          if (modalTimeTotal && modalVid.duration > 0) {
            modalTimeTotal.textContent = ` / ${formatTime(modalVid.duration)}`;
          }
          updateTimelineUI(modalVid.currentTime, modalVid.duration);
        });

        if (modalTimelineWrap && modalTimelineTrack) {
          const seekFromPointer = (e) => {
            const rect = modalTimelineTrack.getBoundingClientRect();
            if (rect.width <= 0) return;
            const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
            const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
            const pct = offsetX / rect.width;
            const duration = modalVid.duration || 0;
            const targetTime = pct * duration;

            if (modalTimelineProgress) modalTimelineProgress.style.width = `${pct * 100}%`;
            if (modalTimelineThumb) modalTimelineThumb.style.left = `${pct * 100}%`;
            if (modalTimeCurrent) modalTimeCurrent.textContent = formatTime(targetTime);

            if (duration > 0 && !isNaN(targetTime) && isFinite(targetTime)) {
              modalVid.currentTime = targetTime;
            }
          };

          modalTimelineWrap.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            isDragging = true;
            modalTimelineWrap.classList.add("is-dragging");
            try { modalTimelineWrap.setPointerCapture(e.pointerId); } catch (err) {}
            const wasPaused = modalVid.paused;
            seekFromPointer(e);

            const onPointerMove = (moveEvt) => {
              if (!isDragging) return;
              moveEvt.preventDefault();
              seekFromPointer(moveEvt);
            };

            const onPointerUp = (upEvt) => {
              if (!isDragging) return;
              isDragging = false;
              modalTimelineWrap.classList.remove("is-dragging");
              try { modalTimelineWrap.releasePointerCapture(upEvt.pointerId); } catch (err) {}
              window.removeEventListener("pointermove", onPointerMove);
              window.removeEventListener("pointerup", onPointerUp);
              window.removeEventListener("pointercancel", onPointerUp);
              if (!wasPaused && modalVid.paused) {
                modalVid.play().catch(() => {});
              }
            };

            window.addEventListener("pointermove", onPointerMove);
            window.addEventListener("pointerup", onPointerUp);
            window.addEventListener("pointercancel", onPointerUp);
          });

          modalTimelineWrap.addEventListener("click", (e) => e.stopPropagation());
        }

        // 4. True Fullscreen Controller
        let modalInactivityTimer = null;
        const isModalFs = () => Boolean(
          document.fullscreenElement === modalContainer ||
          document.webkitFullscreenElement === modalContainer ||
          document.mozFullScreenElement === modalContainer ||
          document.msFullscreenElement === modalContainer ||
          modalContainer.classList.contains("is-fullscreen")
        );

        const resetModalInactivity = () => {
          if (!isModalFs()) return;
          modalContainer.classList.remove("controls-hidden");
          if (modalInactivityTimer) clearTimeout(modalInactivityTimer);
          if (modalVid && !modalVid.paused) {
            modalInactivityTimer = setTimeout(() => {
              if (isModalFs() && modalVid && !modalVid.paused) {
                modalContainer.classList.add("controls-hidden");
              }
            }, 3000);
          }
        };

        const updateModalFsUI = () => {
          const inFs = isModalFs();
          if (modalFullscreenBtn) {
            const iconExpand = modalFullscreenBtn.querySelector(".icon-expand");
            const iconCompress = modalFullscreenBtn.querySelector(".icon-compress");
            if (iconExpand) iconExpand.style.display = inFs ? "none" : "block";
            if (iconCompress) iconCompress.style.display = inFs ? "block" : "none";
            modalFullscreenBtn.setAttribute("aria-label", inFs ? "Exit fullscreen" : "Fullscreen");
            modalFullscreenBtn.setAttribute("title", inFs ? "Exit Fullscreen (F)" : "Fullscreen (F)");
          }

          if (!inFs) {
            modalContainer.classList.remove("is-fullscreen", "controls-hidden");
            if (modalInactivityTimer) clearTimeout(modalInactivityTimer);
          } else {
            modalContainer.classList.add("is-fullscreen");
            resetModalInactivity();
          }
        };

        const toggleModalFullscreen = (e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (!isModalFs()) {
            const req = modalContainer.requestFullscreen ||
                        modalContainer.webkitRequestFullscreen ||
                        modalContainer.mozRequestFullScreen ||
                        modalContainer.msRequestFullscreen;
            if (req) {
              req.call(modalContainer).catch(() => {
                modalContainer.classList.add("is-fullscreen");
                updateModalFsUI();
              });
            } else {
              modalContainer.classList.add("is-fullscreen");
              updateModalFsUI();
            }
          } else {
            const exit = document.exitFullscreen ||
                         document.webkitExitFullscreen ||
                         document.mozCancelFullScreen ||
                         document.msExitFullscreen;
            if (exit && (document.fullscreenElement || document.webkitFullscreenElement)) {
              exit.call(document).catch(() => {
                modalContainer.classList.remove("is-fullscreen");
                updateModalFsUI();
              });
            } else {
              modalContainer.classList.remove("is-fullscreen");
              updateModalFsUI();
            }
          }
        };

        if (modalFullscreenBtn) modalFullscreenBtn.addEventListener("click", toggleModalFullscreen);

        modalContainer.addEventListener("mousemove", resetModalInactivity);
        modalContainer.addEventListener("touchstart", resetModalInactivity, { passive: true });

        // Double-click on video toggles fullscreen
        modalVid.addEventListener("dblclick", (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleModalFullscreen(e);
        });

        // Event listeners for Fullscreen change
        const onFsChange = () => updateModalFsUI();
        document.addEventListener("fullscreenchange", onFsChange);
        document.addEventListener("webkitfullscreenchange", onFsChange);
        document.addEventListener("mozfullscreenchange", onFsChange);
        document.addEventListener("MSFullscreenChange", onFsChange);

        // Save cleanup handler for modal close
        window.__modalFsCleanup = () => {
          document.removeEventListener("fullscreenchange", onFsChange);
          document.removeEventListener("webkitfullscreenchange", onFsChange);
          document.removeEventListener("mozfullscreenchange", onFsChange);
          document.removeEventListener("MSFullscreenChange", onFsChange);
          if (modalInactivityTimer) clearTimeout(modalInactivityTimer);
        };

        // If requested to start directly in fullscreen, trigger immediately!
        if (startFullscreen) {
          toggleModalFullscreen();
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

    // Exit true fullscreen if active
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
      if (exit) {
        try { exit.call(document); } catch (e) {}
      }
    }
    if (typeof window.__modalFsCleanup === "function") {
      window.__modalFsCleanup();
      window.__modalFsCleanup = null;
    }
    if (modalContainer) {
      modalContainer.classList.remove("is-fullscreen", "controls-hidden", "is-playing");
    }

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
      } else {
        const activeCardVid = document.querySelector(`.portfolio-card[data-id="${activeModalProject.id}"] .card-video`);
        if (activeCardVid) {
          try {
            activeCardVid.currentTime = modalCurrentTime;
          } catch (e) {}
        }
      }
    }

    // 3. Resume inline videos strictly based on current viewport visibility!
    if (activeModalProject && activeModalProject.id === "showreel" && showreelVideo) {
      const heroEl = document.getElementById("hero");
      const heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
      if (heroRect && heroRect.bottom > 100 && heroRect.top < window.innerHeight - 100) {
        showreelVideo.play().catch(() => {});
      }
    }

    if (typeof schedulePortfolioCardPlayback === "function") {
      schedulePortfolioCardPlayback();
    }

    if (typeof window.checkRfVisibility === "function") {
      window.checkRfVisibility();
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
    if (!videoModal || !videoModal.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeVideoModal();
      return;
    }

    // Interactive shortcuts when modal is playing
    const modalVid = modalContainer ? modalContainer.querySelector("video") : null;
    if (!modalVid) return;

    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      if (modalVid.paused) modalVid.play().catch(() => {});
      else modalVid.pause();
    } else if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      const modalSoundBtn = modalContainer.querySelector("#modal-ctrl-sound");
      if (modalSoundBtn) modalSoundBtn.click();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      const modalFsBtn = modalContainer.querySelector("#modal-ctrl-fullscreen");
      if (modalFsBtn) modalFsBtn.click();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      modalVid.currentTime = Math.max(0, modalVid.currentTime - 5);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      modalVid.currentTime = Math.min(modalVid.duration || 0, modalVid.currentTime + 5);
    }
  });

  // Expose globally for testing or manual triggers
  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModal;

  // ===========================================================================
  // 5.5 PAGE VISIBILITY API (HALT ALL BACKGROUND PLAYBACK & CPU CYCLES)
  // ===========================================================================
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Background tab: immediately pause all playing videos to preserve battery & CPU
      document.querySelectorAll("video").forEach((v) => {
        if (!v.paused) v.pause();
      });
      if (typeof window.stopRfComparison === "function") {
        window.stopRfComparison();
      }
    } else {
      // Foreground tab: resume strictly what is currently visible in the active viewport
      if (typeof schedulePortfolioCardPlayback === "function") {
        schedulePortfolioCardPlayback();
      }
      if (typeof window.checkRfVisibility === "function") {
        window.checkRfVisibility();
      }
    }
  });

  // ===========================================================================
  // 6. DIRECT CONTACT (BLANK GMAIL COMPOSE, PHONE & SOCIAL LINKS)
  // ===========================================================================
  const setupBookingLinks = () => {
    const email = (data.personal && data.personal.email) || "nareshkumard009@gmail.com";
    const phone = (data.personal && data.personal.phone) || "+91 9177421780";

    // Blank Gmail compose URL with NO pre-filled subject or message
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

    // Ensure all Email links open a blank compose draft in Gmail
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

    // Ensure Phone links direct to tel:
    const phoneLinks = document.querySelectorAll(".link-phone");
    phoneLinks.forEach((p) => {
      p.setAttribute("href", `tel:${phone.replace(/[^0-9+]/g, "")}`);
    });

    // Ensure WhatsApp links direct to WhatsApp chat
    const whatsapp = (data.personal && data.personal.whatsapp) || phone;
    const cleanWaNumber = whatsapp.replace(/[^0-9]/g, "");
    const defaultWaUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent("Hi Naresh, I saw your portfolio and would like to connect!")}`;
    const whatsappUrl = (data.personal && data.personal.whatsappLink) || defaultWaUrl;

    const whatsappLinks = document.querySelectorAll(".link-whatsapp");
    whatsappLinks.forEach((w) => {
      w.setAttribute("href", whatsappUrl);
      w.setAttribute("target", "_blank");
      w.setAttribute("rel", "noopener noreferrer");
      const valSpan = w.querySelector(".contact-card-val");
      if (valSpan) {
        valSpan.textContent = (data.personal && data.personal.whatsappDisplay) || "Message me";
      }
    });

    // Social links (LinkedIn)
    const linkedinLinks = document.querySelectorAll(".link-linkedin");
    linkedinLinks.forEach((l) => {
      if (data.personal && data.personal.socials && data.personal.socials.linkedin) {
        l.setAttribute("href", data.personal.socials.linkedin);
      }
    });
  };

  setupBookingLinks();

  // ===========================================================================
  // 8. CUSTOM CURSOR & TRAILING RING (INSPIRED BY ALIHOSSAIN.COM)
  // ===========================================================================
  const initCustomCursor = () => {
    const supportsFinePointer =
      window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');

    if (!supportsFinePointer || !cursor || !ring) return;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let isVisible = false;
    let isHovering = false;

    // Direct cursor updater exposed globally so slider and dragging gestures feed coordinates seamlessly
    const updateCursorPos = (clientX, clientY) => {
      if (typeof clientX !== 'number' || typeof clientY !== 'number' || isNaN(clientX) || isNaN(clientY)) return;
      mx = clientX;
      my = clientY;

      if (!isVisible) {
        isVisible = true;
        rx = mx;
        ry = my;
        cursor.classList.add('cursor-visible');
        ring.classList.add('cursor-visible');
      }

      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };

    window.updateCustomCursor = updateCursorPos;

    // Follow pointer position instantly across all input and dragging events
    const onPointerMove = (e) => {
      updateCursorPos(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('dragover', onPointerMove, { passive: true });

    // Smooth lerp easing for trailing outer ring (0.12 factor matching alihossain.com)
    const animRing = () => {
      if (isVisible) {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      requestAnimationFrame(animRing);
    };

    requestAnimationFrame(animRing);

    // Interactive element hover detection (event delegation handles all current & dynamic nodes)
    const interactiveSelector =
      'a, button, [role="button"], [role="slider"], input, textarea, select, ' +
      '.filter-chip, .tab-btn, .portfolio-card, .video-card, .showreel-frame, ' +
      '.carousel-btn, .modal-close-floating, .brand-logo, .nav-link, .cta-button, ' +
      '.theme-toggle, .contact-method-card, label[for], .rf-stage, .rf-divider-vertical, ' +
      '.rf-handle-round, .rf-video-window, .ctrl-timeline-wrap, [data-cursor="hover"]';

    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest(interactiveSelector)) {
        if (!isHovering) {
          isHovering = true;
          cursor.classList.add('cursor-hover');
          ring.classList.add('cursor-hover');
        }
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (e.target && e.target.closest(interactiveSelector)) {
        const nextTarget = e.relatedTarget;
        if (!nextTarget || !nextTarget.closest(interactiveSelector)) {
          isHovering = false;
          cursor.classList.remove('cursor-hover');
          ring.classList.remove('cursor-hover');
        }
      }
    }, { passive: true });

    // Tactile Click Compression on all pointer events
    document.addEventListener('pointerdown', (e) => {
      updateCursorPos(e.clientX, e.clientY);
      cursor.classList.add('cursor-clicking');
      ring.classList.add('cursor-clicking');
    }, { passive: true });

    document.addEventListener('pointerup', () => {
      cursor.classList.remove('cursor-clicking');
      ring.classList.remove('cursor-clicking');
    }, { passive: true });

    document.addEventListener('mousedown', (e) => {
      updateCursorPos(e.clientX, e.clientY);
      cursor.classList.add('cursor-clicking');
      ring.classList.add('cursor-clicking');
    }, { passive: true });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('cursor-clicking');
      ring.classList.remove('cursor-clicking');
    }, { passive: true });

    // Viewport enter / leave listeners
    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursor.classList.remove('cursor-visible');
      ring.classList.remove('cursor-visible');
    });

    document.addEventListener('mouseenter', () => {
      if (mx > -50 && my > -50) {
        isVisible = true;
        cursor.classList.add('cursor-visible');
        ring.classList.add('cursor-visible');
      }
    });
  };

  initCustomCursor();
});

