let lastScroll = 0;
const header = document.querySelector('.header');
const mainNav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Consent banner logic
document.addEventListener('DOMContentLoaded', function() {
    const consentBanner = document.getElementById('consent-banner');
    const acceptBtn = document.getElementById('accept-btn');
    const refuseBtn = document.getElementById('refuse-btn');

    // Check if consent has already been given or refused
    const consentStatus = localStorage.getItem('cookieConsent');
    console.log('Consent Status:', consentStatus);

    if (!consentStatus) {
        consentBanner.style.display = 'flex';
    } else {
        consentBanner.style.display = 'none';
    }

    acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        console.log('Consent Accepted');
        consentGranted();
        consentBanner.style.display = 'none';
    });

    refuseBtn.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'refused');
        console.log('Consent Refused');
        consentRefused();
        consentBanner.style.display = 'none';
    });
});

function consentGranted() {
    gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
    });
}

function consentRefused() {
    gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
    });
}