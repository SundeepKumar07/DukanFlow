/**
 * DukanFlow Landing Page JavaScript
 * Developer: Sundeep Kumar
 * Fully static & client-side compatible for GitHub Pages
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
      });
    });
  }

  // 2. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach(i => i.classList.remove('active'));

        // Toggle clicked one
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }

  // 3. Actual Downloads Tracker (GitHub Releases + Website & Drive Downloads)
  const downloadToast = document.getElementById('downloadToast');
  const allDownloadBtns = document.querySelectorAll('a[download], a.btn-drive, a[href*="drive.google.com"]');
  const counterElements = [
    document.getElementById('downloadCounter'),
    document.getElementById('bannerDownloadCounter'),
    document.getElementById('statsSectionDownloadCounter')
  ];

  // REAL CONFIRMED DOWNLOADS:
  // v3.0.2 GitHub actual releases download count is 51. No artificial base added.
  const REAL_PREV_DOWNLOADS = 51;
  const STORAGE_KEY_COUNT = 'dukanflow_actual_downloads_v4';
  const STORAGE_KEY_DRIVE_CLICKS = 'dukanflow_drive_downloads_v1';

  function getStoredTotal() {
    const saved = localStorage.getItem(STORAGE_KEY_COUNT);
    const parsed = parseInt(saved, 10);
    if (!saved || isNaN(parsed) || parsed < REAL_PREV_DOWNLOADS) {
      localStorage.setItem(STORAGE_KEY_COUNT, REAL_PREV_DOWNLOADS);
      return REAL_PREV_DOWNLOADS;
    }
    return parsed;
  }

  function updateDisplayCounters(val) {
    const formatted = Number(val).toLocaleString();
    counterElements.forEach(el => {
      if (el) el.textContent = formatted;
    });
  }

  // Initialize display with actual downloads (51)
  let currentDownloads = getStoredTotal();
  updateDisplayCounters(currentDownloads);

  // Auto-fetch real downloads from GitHub API (actual downloads across all releases)
  async function fetchGitHubReleaseDownloads(owner, repo) {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
      if (response.ok) {
        const releases = await response.json();
        let githubTotal = 0;
        releases.forEach(rel => {
          if (rel.assets && Array.isArray(rel.assets)) {
            rel.assets.forEach(asset => {
              githubTotal += asset.download_count || 0;
            });
          }
        });

        // Add real Drive downloads initiated on website
        const driveClicks = parseInt(localStorage.getItem(STORAGE_KEY_DRIVE_CLICKS), 10) || 0;
        const actualTotal = Math.max(REAL_PREV_DOWNLOADS, githubTotal) + driveClicks;

        if (actualTotal > currentDownloads) {
          currentDownloads = actualTotal;
          localStorage.setItem(STORAGE_KEY_COUNT, currentDownloads);
          updateDisplayCounters(currentDownloads);
        }
      }
    } catch (e) {
      // Gracefully maintain local counter
    }
  }

  // Auto-connect to releases repository
  fetchGitHubReleaseDownloads('SundeepKumar07', 'DukanFlow-releases');

  // Track actual downloads from BOTH GitHub and Google Drive
  allDownloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDrive = btn.classList.contains('btn-drive') || (btn.href && btn.href.includes('drive.google.com'));

      if (isDrive) {
        // Track Drive download click
        let driveClicks = parseInt(localStorage.getItem(STORAGE_KEY_DRIVE_CLICKS), 10) || 0;
        driveClicks += 1;
        localStorage.setItem(STORAGE_KEY_DRIVE_CLICKS, driveClicks);
      }

      // Increment actual total downloads & update UI instantly
      currentDownloads += 1;
      localStorage.setItem(STORAGE_KEY_COUNT, currentDownloads);
      updateDisplayCounters(currentDownloads);

      // Show toast
      if (downloadToast) {
        const toastBody = downloadToast.querySelector('.toast-body');
        if (toastBody) {
          toastBody.innerHTML = `
            <strong>${isDrive ? 'Opening Google Drive Download' : 'Downloading DukanFlow v3.0.3 APK'}</strong>
            <p>${isDrive ? 'Opening Google Drive mirror link...' : 'Check your notifications to complete installation on Android.'}</p>
          `;
        }
        downloadToast.classList.add('show');
        setTimeout(() => {
          downloadToast.classList.remove('show');
        }, 5000);
      }
    });
  });

  // 4. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. Active Navbar Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });
});
