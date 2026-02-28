// ================================
// KATALUX ROOFERS LANDING PAGE - JAVASCRIPT
// Funcionalidades: Menu mobile, FAQ accordion, Form validation, Smooth scroll
// ================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ================================
    // MOBILE MENU TOGGLE
    // ================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // ================================
    // STICKY NAVBAR ON SCROLL
    // ================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });
    
    // ================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ================================
    // FAQ ACCORDION
    // ================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // ================================
    // FORM VALIDATION & SUBMISSION
    // ================================
    
    // Phone number formatting (US format)
    function formatPhoneNumber(value) {
        // Remove all non-numeric characters
        const cleaned = value.replace(/\D/g, '');
        
        // Format as (XXX) XXX-XXXX
        if (cleaned.length <= 3) {
            return cleaned;
        } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
    }
    
    // Auto-format phone inputs
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const formatted = formatPhoneNumber(e.target.value);
            e.target.value = formatted;
        });
    });
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation (US format)
    function isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length === 10;
    }
    
    // Form submission handler
    function handleFormSubmit(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(form);
            const name = formData.get('name');
            const company = formData.get('company');
            const phone = formData.get('phone');
            const email = formData.get('email');
            
            // Validation
            let errors = [];
            
            if (!name || name.trim().length < 2) {
                errors.push('Please enter your name');
            }
            
            if (!company || company.trim().length < 2) {
                errors.push('Please enter your company name');
            }
            
            if (!phone || !isValidPhone(phone)) {
                errors.push('Please enter a valid 10-digit phone number');
            }
            
            if (!email || !isValidEmail(email)) {
                errors.push('Please enter a valid email address');
            }
            
            // Display errors or submit
            if (errors.length > 0) {
                alert('Please fix the following errors:\n\n' + errors.join('\n'));
                return;
            }
            
            // Success handling
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Submit to Formspree (free email forwarding service)
            fetch('https://formspree.io/f/xbljawwe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    company: company,
                    phone: phone,
                    email: email,
                    _subject: `New Lead from Katalux Landing Page - ${company}`,
                    _replyto: email,
                    timestamp: new Date().toISOString()
                })
            })
            .then(response => {
                if (response.ok) {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.style.cssText = `
                        position: fixed;
                        top: 100px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #10B981;
                        color: white;
                        padding: 20px 40px;
                        border-radius: 8px;
                        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                        z-index: 10000;
                        font-family: 'Montserrat', sans-serif;
                        font-weight: 600;
                        font-size: 1.1rem;
                    `;
                    successMessage.textContent = '✓ Thanks! We\'ll contact you within 24 hours.';
                    document.body.appendChild(successMessage);
                    
                    // Reset form
                    form.reset();
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    
                    // Remove success message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Form submission error:', error);
                alert('Sorry, there was an error submitting your form. Please email us directly at katalux.roofing@gmail.com');
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
    
    // Attach handlers to all forms
    const heroForm = document.getElementById('heroForm');
    const finalForm = document.getElementById('finalForm');
    
    if (heroForm) {
        handleFormSubmit(heroForm);
    }
    
    if (finalForm) {
        handleFormSubmit(finalForm);
    }
    
    // ================================
    // SCROLL ANIMATIONS (OPTIONAL)
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll('.pain-card, .diagnosis-item, .method-step, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ================================
    // CONSOLE MESSAGE (EASTER EGG)
    // ================================
    console.log('%c🔥 KATALUX - Marketing as a Service', 'color: #F59E0B; font-size: 24px; font-weight: bold;');
    console.log('%cWe don\'t create the gold. We reveal it.', 'color: #0D9488; font-size: 16px; font-style: italic;');
    console.log('%cInterested in working with us? Email: katalux.roofing@gmail.com', 'color: #0A1628; font-size: 14px;');
    
});

// ================================
// UTILITY: LAZY LOAD IMAGES (if needed)
// ================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
