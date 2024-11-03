// Header scroll behavior
let lastScroll = 0;
const header = document.querySelector('.header');
const mainNav = document.querySelector('.main-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > lastScroll && currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Ensure smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Video loading optimization
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero-section video');
    if (video) {
        // Add loading="lazy" dynamically
        video.loading = 'lazy';
        
        // Handle video loading errors
        video.addEventListener('error', (e) => {
            console.error('Error loading video:', e);
            video.style.display = 'none';
        });
    }
}); 