let lastScroll = 0;
const header = document.querySelector('.header');
const banner = document.querySelector('.contact-banner');
const bannerHeight = banner.offsetHeight;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > bannerHeight) {
        // Scrolling down & past banner
        header.classList.add('hidden');
    } else {
        // Scrolling up
        header.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
});
