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

  // 3. GitHub Releases Live Downloads Counter & Download Feedback Notification
  const downloadToast = document.getElementById('downloadToast');
  const allDownloadBtns = document.querySelectorAll('a[download], a.btn-drive, a[href*="drive.google.com"]');
  const counterElements = [
    document.getElementById('downloadCounter'),
    document.getElementById('bannerDownloadCounter'),
    document.getElementById('statsSectionDownloadCounter')
  ];

  // Clean up any legacy localStorage counters so every device/profile displays the exact same GitHub count
  ['dukanflow_downloads_count_v2', 'dukanflow_downloads_count_v3', 'dukanflow_actual_downloads_v4', 'dukanflow_actual_downloads_v5', 'dukanflow_drive_downloads_v1', 'dukanflow_drive_downloads_v2'].forEach(k => {
    try { localStorage.removeItem(k); } catch (e) {}
  });

  let liveDownloadCount = 56;

  function updateDisplayCounters(val) {
    const formatted = Number(val).toLocaleString();
    counterElements.forEach(el => {
      if (el) el.textContent = formatted;
    });
  }

  // Direct live read from GitHub Releases API across ALL releases (v3.0.2 + v3.0.3)
  // Uses cache-busting timestamp to always get the freshest data
  async function fetchGitHubReleaseDownloads(owner, repo) {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?_t=${Date.now()}`);
      if (response.ok) {
        const releases = await response.json();
        let totalReleaseDownloads = 0;
        releases.forEach(rel => {
          if (rel.assets && Array.isArray(rel.assets)) {
            rel.assets.forEach(asset => {
              totalReleaseDownloads += asset.download_count || 0;
            });
          }
        });
        liveDownloadCount = totalReleaseDownloads;
        updateDisplayCounters(liveDownloadCount);
      }
    } catch (e) {
      // Gracefully maintain existing display count if offline/rate-limited
    }
  }

  // Auto-fetch live stats directly from GitHub releases
  fetchGitHubReleaseDownloads('SundeepKumar07', 'DukanFlow-releases');

  // Handle download button clicks
  allDownloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDrive = btn.classList.contains('btn-drive') || (btn.href && btn.href.includes('drive.google.com'));

      // Instant optimistic UI increment for current session without modifying localStorage
      liveDownloadCount += 1;
      updateDisplayCounters(liveDownloadCount);

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
