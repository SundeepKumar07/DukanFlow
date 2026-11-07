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

  // 3. Download Counter & APK Download Feedback Notification
  const downloadToast = document.getElementById('downloadToast');
  const apkDownloadBtns = document.querySelectorAll('a[download]');
  const counterElements = [
    document.getElementById('downloadCounter'),
    document.getElementById('bannerDownloadCounter'),
    document.getElementById('statsSectionDownloadCounter')
  ];

  // Base download count starting from 10 + persistent increments + optional GitHub Releases API sync
  const BASE_DOWNLOADS = 10;
  const STORAGE_KEY = 'dukanflow_downloads_count_v2';

  function getStoredCount() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, BASE_DOWNLOADS);
      return BASE_DOWNLOADS;
    }
    return parseInt(saved, 10) || BASE_DOWNLOADS;
  }

  function updateDisplayCounters(val) {
    const formatted = Number(val).toLocaleString();
    counterElements.forEach(el => {
      if (el) el.textContent = formatted;
    });
  }

  // Initialize counter display
  let currentDownloads = getStoredCount();
  updateDisplayCounters(currentDownloads);

  // Auto-fetch real downloads from GitHub Releases if hosted under a repository
  async function fetchGitHubReleaseDownloads(owner, repo) {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`);
      if (response.ok) {
        const releases = await response.json();
        let total = 0;
        releases.forEach(rel => {
          if (rel.assets && Array.isArray(rel.assets)) {
            rel.assets.forEach(asset => {
              total += asset.download_count || 0;
            });
          }
        });
        if (total > 0) {
          currentDownloads = BASE_DOWNLOADS + total;
          updateDisplayCounters(currentDownloads);
        }
      }
    } catch (e) {
      // Gracefully fall back to local counter
    }
  }

  // Example GitHub sync hook (auto-connects to your releases repo):
  fetchGitHubReleaseDownloads('SundeepKumar07', 'DukanFlow-releases');

  apkDownloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Increment local count & update UI instantly
      currentDownloads += 1;
      localStorage.setItem(STORAGE_KEY, currentDownloads);
      updateDisplayCounters(currentDownloads);

      // Show toast
      if (downloadToast) {
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

