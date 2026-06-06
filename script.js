/**
 * BPE Wallet - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && mobileMenuClose && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        };

        mobileMenuClose.addEventListener('click', closeMenu);

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.8)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.4)';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const animateElements = document.querySelectorAll('.fade-in-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // To trigger CSS animation
                entry.target.style.animationPlayState = 'running';
                // Stop observing once animated
                observer.unobserve(entry.target);
            } else {
                // Pause animation until in view
                entry.target.style.animationPlayState = 'paused';
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.style.animationPlayState = 'paused'; // Initial state
        observer.observe(el);
    });
    });

    // ==========================================
    // --- Interactive Logic & Modals ---
    // ==========================================

    // --- Toast Notification System ---
    const toastContainer = document.getElementById('toast-container');
    
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' 
            ? '<svg class="toast-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
            : '<svg class="toast-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
            
        toast.innerHTML = `
            ${icon}
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Modal Management ---
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        modals.forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
    }

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    
    // Close modal on outside click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    });

    // --- Auth Buttons Logic ---
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authForm = document.getElementById('auth-form');

    const setupAuthModal = (title, btnText) => {
        authTitle.innerText = title;
        authSubmitBtn.innerText = btnText;
        openModal('auth-modal');
    };

    document.getElementById('nav-signin-btn')?.addEventListener('click', () => setupAuthModal('Sign In', 'Sign In'));
    document.getElementById('mob-signin-btn')?.addEventListener('click', () => { closeMenu(); setupAuthModal('Sign In', 'Sign In'); });
    
    document.getElementById('nav-signup-btn')?.addEventListener('click', () => setupAuthModal('Create Account', 'Get Started'));
    document.getElementById('mob-signup-btn')?.addEventListener('click', () => { closeMenu(); setupAuthModal('Create Account', 'Get Started'); });

    // Handle Form Submit
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = authSubmitBtn;
            const originalText = btn.innerText;
            btn.innerText = 'Processing...';
            btn.style.opacity = '0.7';
            
            // Simulate API call
            setTimeout(() => {
                closeModal();
                showToast(`Successfully ${originalText === 'Sign In' ? 'signed in' : 'account created'}!`, 'success');
                btn.innerText = originalText;
                btn.style.opacity = '1';
                authForm.reset();
            }, 1000);
        });
    }

    // --- Dashboard Mockup Logic ---
    let balance = 24592.00;
    const balanceEl = document.getElementById('dashboard-balance');
    
    const updateBalanceDisplay = () => {
        balanceEl.innerText = `$${balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        balanceEl.style.transform = 'scale(1.1)';
        balanceEl.style.color = 'var(--clr-primary)';
        setTimeout(() => {
            balanceEl.style.transform = 'scale(1)';
            balanceEl.style.color = '';
        }, 200);
    };

    document.getElementById('mock-deposit')?.addEventListener('click', () => {
        const depositAmount = 500;
        const bonusAmount = depositAmount * 0.10;
        balance += depositAmount + bonusAmount;
        updateBalanceDisplay();
        showToast(`Instant Deposit of $${depositAmount.toFixed(2)} + 10% Bonus ($${bonusAmount.toFixed(2)}) successful`);
    });

    document.getElementById('mock-withdraw')?.addEventListener('click', () => {
        if (balance >= 200) {
            balance -= 200;
            updateBalanceDisplay();
            showToast('Withdrawal of $200.00 initiated');
        } else {
            showToast('Insufficient balance', 'error');
        }
    });

    document.getElementById('mock-trade')?.addEventListener('click', () => {
        // Simulate a quick successful trade outcome
        const profit = Math.floor(Math.random() * 150) + 10;
        balance += profit;
        updateBalanceDisplay();
        showToast(`Trade closed! Profit: $${profit}.00`);
    });

    // --- Download Progress Logic ---
    const downloadBtn = document.getElementById('download-btn');
    const downloadModal = document.getElementById('download-modal');
    const progressBar = document.getElementById('download-progress');
    const progressStatus = document.getElementById('download-status');

    downloadBtn?.addEventListener('click', () => {
        openModal('download-modal');
        let progress = 0;
        progressBar.style.width = '0%';
        progressStatus.innerText = '0%';
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            progressStatus.innerText = `${progress}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    closeModal();
                    showToast('App downloaded successfully!');
                }, 500);
            }
        }, 300);
    });

});
