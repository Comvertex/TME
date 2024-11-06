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

    const consentStatus = localStorage.getItem('cookieConsent');
    console.log('Consent Status:', consentStatus);

    if (consentStatus === 'accepted' || consentStatus === 'refused') {
        consentBanner.style.display = 'none';
    } else {
        consentBanner.style.display = 'flex';
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

document.addEventListener('DOMContentLoaded', function() {
    const consentBanner = document.querySelector('.consent-banner');
    const whatsappButton = document.querySelector('.whatsapp-float');

    function adjustWhatsAppPosition() {
        if (consentBanner.style.display === 'none') {
            whatsappButton.style.bottom = '20px';
        } else {
            const bannerHeight = consentBanner.offsetHeight;
            whatsappButton.style.bottom = `${bannerHeight + 20}px`;
        }
    }

    // Adjust position on load
    adjustWhatsAppPosition();

    // Adjust position on window resize
    window.addEventListener('resize', adjustWhatsAppPosition);

    // Adjust position when consent is given or refused
    document.getElementById('accept-btn').addEventListener('click', function() {
        consentBanner.style.display = 'none';
        adjustWhatsAppPosition();
    });

    document.getElementById('refuse-btn').addEventListener('click', function() {
        consentBanner.style.display = 'none';
        adjustWhatsAppPosition();
    });
});

document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(event) {
        // Comment out any preventDefault calls
        // event.preventDefault();
    });
});