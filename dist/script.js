/* Taxi Merci Express — homepage behaviors (vanilla, no dependencies)
   - Two-tier header: Tier A pinned, Tier B (nav) collapses on scroll-down,
     expands on scroll-up, with a ~470ms anti-stutter lock.
   - Scroll-reveal via IntersectionObserver + a guaranteed timeout fallback
     so content can never stay invisible. Respects prefers-reduced-motion.
   - Count-up stats (Italian decimal comma).
   - Hero video opacity crossfade once it can play.
   - Mobile menu toggle.
   - Cookie consent: shows the existing banner only when localStorage
     'cookieConsent' is unset; Accetta/Rifiuta keep firing the existing
     consentGranted()/consentRefused() handlers (defined in index.html head)
     via their inline onclick — this script only hides the banner + nudges
     the WhatsApp float. Consent/GTM plumbing is unchanged.
*/
(function () {
  'use strict';

  function init() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Mobile menu ---------- */
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');

    function closeMenu() {
      if (!menu || !toggle) return;
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Apri menu');
    }
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
      });
      Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
        a.addEventListener('click', closeMenu);
      });
    }

    /* ---------- Header nav collapse on scroll ---------- */
    var navbar = document.getElementById('navbar');
    var lastY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var hidden = false;
    var scrolled = false;
    var animLock = false;
    var animT;

    function onNavScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var dy = y - lastY;
      if (Math.abs(dy) < 4) return;

      var nowScrolled = y > 24;
      var nowHidden = hidden;
      if (!animLock) {
        if (dy > 0 && y > 110 && !hidden) nowHidden = true;
        else if (dy < 0 && hidden) nowHidden = false;
      }
      if (nowHidden !== hidden) {
        animLock = true;
        clearTimeout(animT);
        animT = setTimeout(function () { animLock = false; }, 470);
        hidden = nowHidden;
        if (navbar) navbar.classList.toggle('navbar--hidden', hidden);
        if (hidden) closeMenu();
      }
      if (nowScrolled !== scrolled) {
        scrolled = nowScrolled;
        if (navbar) navbar.classList.toggle('navbar--scrolled', scrolled);
      }
      lastY = y;
    }
    window.addEventListener('scroll', onNavScroll, { passive: true });

    /* ---------- Scroll-reveal ---------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    function revealOne(el) {
      if (el.__shown) return;
      el.__shown = true;
      var d = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () { el.classList.add('is-visible'); }, reduce ? 0 : d);
    }

    /* ---------- Count-up ---------- */
    var numEls = Array.prototype.slice.call(document.querySelectorAll('[data-countup]'));
    function fmt(v, dec) {
      return dec > 0 ? v.toFixed(dec).replace('.', ',') : String(Math.round(v));
    }
    function animateCount(el) {
      var target = parseFloat(el.getAttribute('data-countup'));
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      if (reduce || isNaN(target)) { el.textContent = fmt(target, dec); return; }
      var dur = 1500;
      var start = performance.now();
      (function step(now) {
        var p = Math.min((now - start) / dur, 1);
        p = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * p, dec);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
    function countOne(el) {
      if (el.__counted) return;
      el.__counted = true;
      animateCount(el);
    }

    if (!reduce && 'IntersectionObserver' in window) {
      var revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { revealOne(e.target); revealIO.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
      revealEls.forEach(function (el) { revealIO.observe(el); });

      var countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { countOne(e.target); countIO.unobserve(e.target); }
        });
      }, { threshold: 0.4 });
      numEls.forEach(function (el) { countIO.observe(el); });
    } else {
      revealEls.forEach(revealOne);
      numEls.forEach(countOne);
    }

    // Safety fallback: nothing may stay invisible / un-counted.
    setTimeout(function () {
      revealEls.forEach(revealOne);
      numEls.forEach(countOne);
    }, 1900);

    /* ---------- Hero video: desktop only, on demand ----------
       The poster (CSS background) is the LCP and shows on every viewport.
       The ~2.3MB video is only fetched on wider screens — never on phones/
       small tablets, with reduced-motion, or under Save-Data. preload="none"
       + JS-added source keeps it off the initial critical path. */
    var video = document.getElementById('heroVideo');
    if (video) {
      var src = video.getAttribute('data-src');
      var saveData = navigator.connection && navigator.connection.saveData;
      var wantVideo = src && !reduce && !saveData &&
        window.matchMedia('(min-width: 981px)').matches;
      if (wantVideo) {
        var showVideo = function () { video.classList.add('is-ready'); };
        if (video.readyState >= 3) {
          showVideo();
        } else {
          ['playing', 'canplay', 'loadeddata'].forEach(function (ev) {
            video.addEventListener(ev, showVideo, { once: true });
          });
        }
        var s = document.createElement('source');
        s.src = src;
        s.type = 'video/mp4';
        video.appendChild(s);
        video.load();
        var pr = video.play && video.play();
        if (pr && pr.catch) pr.catch(function () {});
      }
    }

    /* ---------- Footer year ---------- */
    var fy = document.getElementById('footerYear');
    if (fy) fy.textContent = new Date().getFullYear();

    /* ---------- Cookie consent (existing plumbing preserved) ---------- */
    var banner = document.getElementById('consent-banner');
    var acceptBtn = document.getElementById('accept-btn');
    var refuseBtn = document.getElementById('refuse-btn');
    var whatsapp = document.querySelector('.whatsapp-float');

    function adjustWhatsApp() {
      if (!whatsapp) return;
      var visible = banner && banner.style.display === 'block';
      // Desktop: banner is a bottom-left card, float is bottom-right — no
      // collision. Mobile (<=620px, where the banner spans the bottom): lift
      // the float clear above the banner so it stays visible and tappable.
      // Recompute from the live banner height so a font-reflow can't bury it.
      if (visible && window.innerWidth <= 620) {
        whatsapp.style.bottom = (banner.offsetHeight + 26) + 'px';
      } else {
        whatsapp.style.bottom = '22px';
      }
    }

    var consent = null;
    try { consent = localStorage.getItem('cookieConsent'); } catch (e) {}
    if (banner) {
      banner.style.display = (consent === 'accepted' || consent === 'refused') ? 'none' : 'block';
    }

    function dismissBanner() {
      if (banner) banner.style.display = 'none';
      adjustWhatsApp();
    }
    // The inline onclick already calls consentGranted()/consentRefused()
    // (gtag consent update + localStorage). We only hide + reflow here.
    if (acceptBtn) acceptBtn.addEventListener('click', dismissBanner);
    if (refuseBtn) refuseBtn.addEventListener('click', dismissBanner);

    adjustWhatsApp();
    window.addEventListener('resize', adjustWhatsApp);
    // Re-run after full load and after fonts settle — banner height can grow
    // when Montserrat swaps in, which would otherwise leave the float covered.
    window.addEventListener('load', adjustWhatsApp);
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(adjustWhatsApp).catch(function () {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
