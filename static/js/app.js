/**
 * Hate Speech Detection - Enhanced Frontend Interactivity
 * Features: Character counter, sample chips, loading states, form handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('analysis-form');
    const textarea = document.getElementById('tweet-input');
    const charCounter = document.getElementById('char-counter');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleChips = document.querySelectorAll('.sample-chip');

    // Constants
    const MAX_CHARS = 1000;
    const WARNING_THRESHOLD = 800;
    const DANGER_THRESHOLD = 950;

    /**
     * Update character counter with visual feedback
     */
    function updateCharCounter() {
        const length = textarea.value.length;
        charCounter.textContent = `${length} / ${MAX_CHARS}`;

        // Remove previous state classes
        charCounter.classList.remove('warning', 'danger');

        // Add appropriate state class
        if (length >= DANGER_THRESHOLD) {
            charCounter.classList.add('danger');
        } else if (length >= WARNING_THRESHOLD) {
            charCounter.classList.add('warning');
        }
    }

    /**
     * Handle sample chip click - fill textarea with sample text
     */
    function handleSampleClick(chip) {
        const text = chip.dataset.text;
        
        // Animate the textarea
        textarea.style.transition = 'all 0.2s ease';
        textarea.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            textarea.value = text;
            textarea.style.transform = 'scale(1)';
            updateCharCounter();
            
            // Focus and select the textarea
            textarea.focus();
            
            // Scroll to textarea on mobile
            if (window.innerWidth < 640) {
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);

        // Visual feedback on the chip
        chip.style.transform = 'scale(0.95)';
        setTimeout(() => {
            chip.style.transform = '';
        }, 150);
    }

    /**
     * Handle form submission with loading state
     */
    function handleFormSubmit(e) {
        const text = textarea.value.trim();
        
        // Validate input
        if (!text) {
            e.preventDefault();
            textarea.classList.add('shake');
            textarea.focus();
            
            // Remove shake animation after it completes
            setTimeout(() => {
                textarea.classList.remove('shake');
            }, 500);
            
            return;
        }

        // Show loading state
        analyzeBtn.classList.add('loading');
        analyzeBtn.disabled = true;
        
        // Add loading styles if not present
        if (!document.getElementById('shake-styles')) {
            const style = document.createElement('style');
            style.id = 'shake-styles';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .shake {
                    animation: shake 0.5s ease-in-out;
                    border-color: var(--danger-500) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Clear the form
     */
    function clearForm() {
        textarea.value = '';
        updateCharCounter();
        textarea.focus();
        
        // Visual feedback
        clearBtn.style.transform = 'rotate(-180deg)';
        setTimeout(() => {
            clearBtn.style.transform = '';
        }, 300);
    }

    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboard(e) {
        // Ctrl/Cmd + Enter to submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
        
        // Escape to clear
        if (e.key === 'Escape') {
            clearForm();
        }
    }

    /**
     * Auto-resize textarea based on content
     */
    function autoResize() {
        textarea.style.height = 'auto';
        const newHeight = Math.max(140, textarea.scrollHeight);
        textarea.style.height = `${newHeight}px`;
    }

    // Event Listeners
    textarea.addEventListener('input', () => {
        updateCharCounter();
        autoResize();
    });

    textarea.addEventListener('keydown', handleKeyboard);

    form.addEventListener('submit', handleFormSubmit);

    clearBtn.addEventListener('click', clearForm);

    sampleChips.forEach(chip => {
        chip.addEventListener('click', () => handleSampleClick(chip));
    });

    // Initialize
    updateCharCounter();

    // Focus textarea on load (desktop only for better UX)
    if (window.innerWidth > 640) {
        setTimeout(() => textarea.focus(), 300);
    }

    // Handle browser back/forward button state preservation
    if (textarea.value) {
        updateCharCounter();
        autoResize();
    }

    console.log('🛡️ Hate Speech Detection App initialized');
});

/**
 * Utility: Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Intersection Observer for scroll animations
 */
if ('IntersectionObserver' in window) {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe result container if present
    document.querySelectorAll('.result-container').forEach(el => {
        observer.observe(el);
    });
}
