/**
 * Green Table - Brand Page Interactions & Logic
 * Author: Antigravity
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Navigation & Header Scrolls
    // ==========================================================================
    const header = document.querySelector('.main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Header background toggle on scroll
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Initialize check on load

    // Active nav link highlight on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the active view area
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Smooth Scrolling for Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';

                const headerOffset = header.classList.contains('scrolled') ? 80 : 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================================================
    // 2. Mobile Responsive Hamburger Menu Drawer
    // ==========================================================================
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-btn');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    // ==========================================================================
    // 3. Stats Counter Animation
    // ==========================================================================
    const statsSection = document.querySelector('.stats-container');
    const statNumbers = document.querySelectorAll('.stat-number');
    let counterStarted = false;

    const countUp = (element) => {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // Animation duration in milliseconds
        const frameRate = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameRate);
        let currentFrame = 0;

        const count = () => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            // Ease-out expo function for smoother landing
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeProgress * target);
            
            // Format number with commas
            element.textContent = currentValue.toLocaleString('ko-KR');

            if (currentFrame < totalFrames) {
                requestAnimationFrame(count);
            } else {
                element.textContent = target.toLocaleString('ko-KR');
            }
        };

        requestAnimationFrame(count);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterStarted) {
                counterStarted = true;
                statNumbers.forEach(num => countUp(num));
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }


    // ==========================================================================
    // 4. Menu Filter (Tab Menu)
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Card transitions
                card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });


    // ==========================================================================
    // 5. Scroll Reveal Animation
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once shown
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));


    // ==========================================================================
    // 6. Contact Form Logic (Conditional Fields, Validation, Success Popup)
    // ==========================================================================
    const inquiryForm = document.getElementById('inquiryForm');
    const radioGroup = document.getElementsByName('inquiryType');
    const conditionalFields = document.getElementById('conditionalFields');
    const groupFields = document.querySelector('.group-only-fields');
    
    // Inputs to validate
    const userNameInput = document.getElementById('userName');
    const userPhoneInput = document.getElementById('userPhone');
    const userEmailInput = document.getElementById('userEmail');
    const userMessageInput = document.getElementById('userMessage');
    const privacyCheck = document.getElementById('privacyAgree');
    
    const quantityInput = document.getElementById('orderQuantity');
    const deliveryDateInput = document.getElementById('deliveryDate');

    // Toggle fields based on radio button (정기배송 vs 단체주문)
    radioGroup.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'group') {
                // Show Group fields
                groupFields.style.display = 'grid';
                quantityInput.setAttribute('required', 'true');
                deliveryDateInput.setAttribute('required', 'true');
                
                // Add fade effect
                setTimeout(() => {
                    groupFields.style.opacity = '1';
                }, 50);
            } else {
                // Hide Group fields
                groupFields.style.display = 'none';
                quantityInput.removeAttribute('required');
                deliveryDateInput.removeAttribute('required');
                quantityInput.value = '';
                deliveryDateInput.value = '';
            }
        });
    });

    // Helper functions for validation styling
    const showError = (inputElement, isValid) => {
        const formGroup = inputElement.closest('.form-group') || inputElement.closest('.form-privacy-agree');
        if (!isValid) {
            formGroup.classList.add('error');
        } else {
            formGroup.classList.remove('error');
        }
    };

    // Regex check helpers
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
        // Formats: 010-1234-5678, 02-123-4567, 031-123-4567 etc
        return /^\d{2,3}-\d{3,4}-\d{4}$/.test(phone);
    };

    // Individual input validation listeners for real-time feedback
    userNameInput.addEventListener('input', () => {
        showError(userNameInput, userNameInput.value.trim() !== '');
    });

    userPhoneInput.addEventListener('input', () => {
        showError(userPhoneInput, validatePhone(userPhoneInput.value));
    });

    userEmailInput.addEventListener('input', () => {
        showError(userEmailInput, validateEmail(userEmailInput.value));
    });

    userMessageInput.addEventListener('input', () => {
        showError(userMessageInput, userMessageInput.value.trim() !== '');
    });

    privacyCheck.addEventListener('change', () => {
        showError(privacyCheck, privacyCheck.checked);
    });

    if (quantityInput) {
        quantityInput.addEventListener('input', () => {
            const isGroup = document.querySelector('input[name="inquiryType"]:checked').value === 'group';
            if (isGroup) {
                const val = parseInt(quantityInput.value, 10);
                showError(quantityInput, !isNaN(val) && val >= 10);
            }
        });
    }

    // Form Submission
    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Final Validation Check
        let isFormValid = true;

        // Name
        if (userNameInput.value.trim() === '') {
            showError(userNameInput, false);
            isFormValid = false;
        }

        // Phone
        if (!validatePhone(userPhoneInput.value)) {
            showError(userPhoneInput, false);
            isFormValid = false;
        }

        // Email
        if (!validateEmail(userEmailInput.value)) {
            showError(userEmailInput, false);
            isFormValid = false;
        }

        // Message
        if (userMessageInput.value.trim() === '') {
            showError(userMessageInput, false);
            isFormValid = false;
        }

        // Privacy Policy checkbox
        if (!privacyCheck.checked) {
            showError(privacyCheck, false);
            isFormValid = false;
        }

        // If Group Order, validate quantity
        const selectedType = document.querySelector('input[name="inquiryType"]:checked').value;
        if (selectedType === 'group') {
            const quantityVal = parseInt(quantityInput.value, 10);
            if (isNaN(quantityVal) || quantityVal < 10) {
                showError(quantityInput, false);
                isFormValid = false;
            }
        }

        // Exit if any validation fails
        if (!isFormValid) {
            // Find first error element and scroll to it
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // 2. Submit Animation (Trigger Spinner)
        const submitBtn = document.getElementById('btnSubmit');
        submitBtn.classList.add('submitting');

        // Simulate API post call
        setTimeout(() => {
            // Stop spinner
            submitBtn.classList.remove('submitting');
            
            // Show Alert & Custom Success Modal (User requirements demand an alert message, let's trigger both for top safety & premium UI experience)
            alert('그린테이블 문의가 접수되었습니다! 빠른 시간 내에 연락드리겠습니다. 🌱');
            
            showSuccessModal();
            
            // Reset Form
            inquiryForm.reset();
            // Manually trigger radio toggle back to regular
            groupFields.style.display = 'none';
        }, 1500);
    });

    // Success Modal functions
    const successModal = document.getElementById('successModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    const showSuccessModal = () => {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // block scrolling
    };

    const hideSuccessModal = () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    modalCloseBtn.addEventListener('click', hideSuccessModal);
    
    // Close modal on background click
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            hideSuccessModal();
        }
    });


    // ==========================================================================
    // 7. Scroll To Top & Mobile Sticky CTA visibility
    // ==========================================================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const mobileStickyCta = document.querySelector('.mobile-sticky-cta');

    window.addEventListener('scroll', () => {
        // Scroll to Top visibility
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('show');
            if (window.innerWidth <= 768 && mobileStickyCta) {
                mobileStickyCta.style.transform = 'translateY(0)';
                mobileStickyCta.style.opacity = '1';
            }
        } else {
            scrollTopBtn.classList.remove('show');
            if (window.innerWidth <= 768 && mobileStickyCta) {
                mobileStickyCta.style.transform = 'translateY(100%)';
                mobileStickyCta.style.opacity = '0';
            }
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
