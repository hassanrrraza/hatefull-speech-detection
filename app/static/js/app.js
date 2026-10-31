/**
 * Roman Urdu Hate Speech Detection - Interactive Application Engine
 * High-performance UI/UX: Real-time AJAX analysis, theme management,
 * preset filtering, session history tracking, clipboard tools & accessible modals.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // DOM Element References
    // -------------------------------------------------------------------------
    const htmlRoot = document.documentElement;
    const form = document.getElementById('analysis-form');
    const textarea = document.getElementById('tweet-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const randomBtn = document.getElementById('random-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const charCounter = document.getElementById('char-counter');
    const wordCounter = document.getElementById('word-counter');
    const readTimeEl = document.getElementById('read-time');
    const charMeter = document.getElementById('char-meter');
    const inputCard = textarea ? textarea.closest('.input-card') : null;
    const resultWrapper = document.getElementById('result-wrapper');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const emptyHistoryPlaceholder = document.getElementById('empty-history-placeholder');
    const categoryTabs = document.querySelectorAll('.category-tabs .tab-btn');
    const sampleChips = document.querySelectorAll('.sample-chip');
    const toastHub = document.getElementById('toast-hub');

    // Modal elements
    const howItWorksBtn = document.getElementById('how-it-works-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDismissBtn = document.getElementById('modal-dismiss-btn');

    // Constants
    const MAX_CHARS = 1000;
    const WARNING_CHARS = 800;
    const DANGER_CHARS = 950;
    const HISTORY_KEY = 'roman_urdu_hate_speech_history';

    // -------------------------------------------------------------------------
    // Toast Notification Utility
    // -------------------------------------------------------------------------
    function showToast(message, type = 'info', iconClass = 'fa-circle-info') {
        if (!toastHub) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <i class="fas ${iconClass}" aria-hidden="true"></i>
            <span>${message}</span>
        `;

        toastHub.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-fade');
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    }

    // -------------------------------------------------------------------------
    // Theme Management (Dark / Light)
    // -------------------------------------------------------------------------
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            htmlRoot.setAttribute('data-theme', savedTheme);
        } else {
            // Check system preference
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            htmlRoot.setAttribute('data-theme', prefersDark ? 'dark' : 'dark'); // default dark for modern feel
        }
    }

    function toggleTheme() {
        const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlRoot.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        showToast(
            `Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`,
            'info',
            newTheme === 'dark' ? 'fa-moon' : 'fa-sun'
        );
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    initTheme();

    // -------------------------------------------------------------------------
    // Real-Time Input Metrics (Characters, Words, Read Time, Progress Bar)
    // -------------------------------------------------------------------------
    function updateMetrics() {
        if (!textarea) return;
        const text = textarea.value;
        const length = text.length;

        // Character counter
        if (charCounter) {
            charCounter.textContent = `${length} / ${MAX_CHARS}`;
            charCounter.classList.remove('warning', 'danger');
            if (length >= DANGER_CHARS) {
                charCounter.classList.add('danger');
            } else if (length >= WARNING_CHARS) {
                charCounter.classList.add('warning');
            }
        }

        // Meter progress
        if (charMeter) {
            const percentage = Math.min(100, Math.round((length / MAX_CHARS) * 100));
            charMeter.style.width = `${percentage}%`;
            charMeter.classList.remove('warning', 'danger');
            if (length >= DANGER_CHARS) {
                charMeter.classList.add('danger');
            } else if (length >= WARNING_CHARS) {
                charMeter.classList.add('warning');
            }
        }

        // Word counter
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        if (wordCounter) {
            wordCounter.innerHTML = `<i class="fas fa-file-lines"></i> ${words} ${words === 1 ? 'word' : 'words'}`;
        }

        // Estimated reading time
        if (readTimeEl) {
            const seconds = Math.max(1, Math.round((words / 200) * 60));
            readTimeEl.innerHTML = `<i class="fas fa-clock"></i> ~${seconds}s read`;
        }
    }

    function autoResizeTextarea() {
        if (!textarea) return;
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.max(150, textarea.scrollHeight)}px`;
    }

    if (textarea) {
        textarea.addEventListener('input', () => {
            updateMetrics();
            autoResizeTextarea();
        });
        updateMetrics();
        autoResizeTextarea();
    }

    // -------------------------------------------------------------------------
    // Category Tabs Filtering for Preset Samples
    // -------------------------------------------------------------------------
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;
            sampleChips.forEach(chip => {
                if (category === 'all' || chip.dataset.category === category) {
                    chip.style.display = 'inline-flex';
                } else {
                    chip.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // Sample Chip Insertion
    // -------------------------------------------------------------------------
    function insertSampleText(text, label = 'Sample') {
        if (!textarea) return;

        textarea.value = text;
        updateMetrics();
        autoResizeTextarea();
        textarea.focus();

        // Subtle animation on input card
        if (inputCard) {
            inputCard.style.transform = 'scale(0.99)';
            setTimeout(() => {
                inputCard.style.transform = '';
            }, 150);
        }

        showToast(`Loaded "${label}" into analysis console`, 'info', 'fa-sparkles');
    }

    sampleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const text = chip.dataset.text;
            const label = chip.querySelector('.chip-label')?.textContent || 'Sample';
            insertSampleText(text, label);
        });
    });

    // -------------------------------------------------------------------------
    // Toolbar Tools (Paste, Random, Clear)
    // -------------------------------------------------------------------------
    if (pasteBtn && textarea) {
        pasteBtn.addEventListener('click', async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text && text.trim()) {
                    textarea.value = text.trim();
                    updateMetrics();
                    autoResizeTextarea();
                    textarea.focus();
                    showToast('Pasted text from clipboard', 'success', 'fa-paste');
                } else {
                    showToast('Clipboard is empty or does not contain text', 'info', 'fa-triangle-exclamation');
                }
            } catch (err) {
                // Clipboard permissions might be denied
                showToast('Clipboard access was blocked by browser. Please paste manually.', 'info', 'fa-key');
            }
        });
    }

    if (randomBtn && sampleChips.length > 0) {
        randomBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * sampleChips.length);
            const chip = sampleChips[randomIndex];
            const text = chip.dataset.text;
            const label = chip.querySelector('.chip-label')?.textContent || 'Sample';
            insertSampleText(text, label);
        });
    }

    function clearInput() {
        if (!textarea) return;
        textarea.value = '';
        updateMetrics();
        autoResizeTextarea();
        textarea.focus();
        showToast('Console cleared', 'info', 'fa-rotate-left');
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearInput);
    }

    // -------------------------------------------------------------------------
    // Result Card Renderer (Dynamic AJAX Output)
    // -------------------------------------------------------------------------
    function renderResult(data) {
        if (!resultWrapper || !data) return;

        const isSafe = !data.is_hateful;
        const stateClass = isSafe ? 'is-safe' : 'is-hateful';
        const iconClass = isSafe ? 'fa-circle-check' : 'fa-triangle-exclamation';
        const verdictBadge = isSafe
            ? '<span class="verdict-badge badge-safe"><i class="fas fa-shield-check"></i> Normal Content</span>'
            : '<span class="verdict-badge badge-danger"><i class="fas fa-triangle-exclamation"></i> Hate Speech Detected</span>';

        const headline = isSafe
            ? 'Content Appears Safe & Compliant'
            : 'Toxic or Hateful Language Flagged';

        const summary = isSafe
            ? 'Our machine learning model analyzed this Roman Urdu statement and found no abusive words, harassment, or slurs.'
            : 'Our machine learning model flagged harmful patterns or abusive Roman Urdu expressions in this statement.';

        const safeProb = data.normal_probability || (isSafe ? 94.0 : 12.0);
        const hateProb = data.hate_probability || (isSafe ? 6.0 : 88.0);
        const riskLevel = data.risk_level || (isSafe ? 'Low' : 'High');

        // Tokens pills
        let tokensHtml = '';
        if (data.tokens && data.tokens.length > 0) {
            tokensHtml = `
                <div class="tokens-inspector">
                    <h4 class="tokens-title"><i class="fas fa-microchip"></i> Evaluated Tokens (Post-Stopwords Preprocessing):</h4>
                    <div class="tokens-list">
                        ${data.tokens.map(token => `<span class="token-pill">${escapeHtml(token)}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        resultWrapper.innerHTML = `
            <div class="result-card ${stateClass}">
                <div class="result-banner">
                    <div class="result-icon-box">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <div class="result-headline">
                        <div class="badge-group">
                            ${verdictBadge}
                            <span class="risk-badge">
                                Risk Level: <strong>${escapeHtml(riskLevel)}</strong>
                            </span>
                        </div>
                        <h3 class="verdict-title">${headline}</h3>
                        <p class="verdict-summary">${summary}</p>
                    </div>
                </div>

                <div class="metrics-grid">
                    <div class="metric-box">
                        <div class="metric-top">
                            <span class="metric-name"><i class="fas fa-heart"></i> Safety Score</span>
                            <span class="metric-value safe-text">${safeProb}%</span>
                        </div>
                        <div class="metric-bar-track">
                            <div class="metric-bar-fill safe-fill" style="width: ${safeProb}%;"></div>
                        </div>
                        <span class="metric-sub">Probability of safe, non-toxic text</span>
                    </div>

                    <div class="metric-box">
                        <div class="metric-top">
                            <span class="metric-name"><i class="fas fa-fire-flame-curved"></i> Hate Risk Score</span>
                            <span class="metric-value danger-text">${hateProb}%</span>
                        </div>
                        <div class="metric-bar-track">
                            <div class="metric-bar-fill danger-fill" style="width: ${hateProb}%;"></div>
                        </div>
                        <span class="metric-sub">Probability of toxic speech / slurs</span>
                    </div>
                </div>

                ${tokensHtml}

                <div class="result-actions">
                    <button type="button" class="action-btn" id="copy-result-btn" title="Copy report to clipboard">
                        <i class="fas fa-copy"></i>
                        <span>Copy Summary</span>
                    </button>
                    <button type="button" class="action-btn secondary-action" id="new-scan-btn">
                        <i class="fas fa-plus"></i>
                        <span>Scan Another</span>
                    </button>
                </div>
            </div>
        `;

        resultWrapper.classList.add('has-result');
        attachResultActions(data);

        // Scroll to result smoothly
        resultWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function escapeHtml(string) {
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    }

    // -------------------------------------------------------------------------
    // Result Action Listeners (Copy Report & Scan Another)
    // -------------------------------------------------------------------------
    function attachResultActions(data) {
        const copyBtn = document.getElementById('copy-result-btn');
        const newScanBtn = document.getElementById('new-scan-btn');

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const text = textarea ? textarea.value.trim() : '';
                const isSafe = !data.is_hateful;
                const report = [
                    '🛡️ Roman Urdu Hate Speech Detection Report',
                    '--------------------------------------------',
                    `Verdict: ${data.prediction || (isSafe ? 'Normal Tweet' : 'Hateful Tweet')}`,
                    `Risk Level: ${data.risk_level || (isSafe ? 'Low' : 'High')}`,
                    `Safety Score: ${data.normal_probability || (isSafe ? '94%' : '12%')}%`,
                    `Hate Risk: ${data.hate_probability || (isSafe ? '6%' : '88%')}%`,
                    `Input Text: "${text}"`,
                    `Timestamp: ${new Date().toLocaleString()}`
                ].join('\n');

                navigator.clipboard.writeText(report).then(() => {
                    showToast('Analysis report copied to clipboard!', 'success', 'fa-clipboard-check');
                }).catch(() => {
                    showToast('Failed to copy to clipboard', 'info', 'fa-triangle-exclamation');
                });
            });
        }

        if (newScanBtn) {
            newScanBtn.addEventListener('click', () => {
                clearInput();
                textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    }

    // Attach actions to server-rendered result if exists on first load
    if (resultWrapper && resultWrapper.classList.contains('has-result')) {
        const isHateful = resultWrapper.querySelector('.result-card')?.classList.contains('is-hateful');
        attachResultActions({
            is_hateful: isHateful,
            prediction: isHateful ? 'Hateful Tweet' : 'Normal Tweet',
            risk_level: isHateful ? 'High' : 'Low'
        });
    }

    // -------------------------------------------------------------------------
    // Session History Management
    // -------------------------------------------------------------------------
    function getHistory() {
        try {
            return JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveHistoryItem(item) {
        const history = getHistory();
        // Avoid duplicate identical consecutive queries
        if (history.length > 0 && history[0].text === item.text) {
            return;
        }
        history.unshift(item);
        if (history.length > 8) history.pop();
        try {
            sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.warn('Could not save history to sessionStorage', e);
        }
        renderHistory();
    }

    function renderHistory() {
        if (!historyList) return;
        const history = getHistory();

        if (history.length === 0) {
            if (emptyHistoryPlaceholder) {
                historyList.innerHTML = `
                    <div class="empty-history" id="empty-history-placeholder">
                        <i class="fas fa-inbox"></i>
                        <p>No scans yet in this session.<br>Run an analysis or click a sample to start!</p>
                    </div>
                `;
            }
            return;
        }

        historyList.innerHTML = history.map((item, index) => {
            const isSafe = !item.is_hateful;
            const tagClass = isSafe ? 'safe' : 'hate';
            const tagLabel = isSafe ? 'Safe' : 'Hate';
            return `
                <div class="history-item" data-index="${index}">
                    <div class="history-top">
                        <span class="history-tag ${tagClass}">${tagLabel}</span>
                        <span class="history-time">${escapeHtml(item.time)}</span>
                    </div>
                    <div class="history-text" title="${escapeHtml(item.text)}">${escapeHtml(item.text)}</div>
                </div>
            `;
        }).join('');

        // Add click events to reload history item
        historyList.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', () => {
                const index = parseInt(el.dataset.index, 10);
                const item = history[index];
                if (item) {
                    if (textarea) {
                        textarea.value = item.text;
                        updateMetrics();
                        autoResizeTextarea();
                    }
                    renderResult(item);
                    showToast('Reloaded scan from history', 'info', 'fa-history');
                }
            });
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            sessionStorage.removeItem(HISTORY_KEY);
            renderHistory();
            showToast('Session history cleared', 'info', 'fa-trash-can');
        });
    }
    renderHistory();

    // -------------------------------------------------------------------------
    // Form Submission: Real-time AJAX with Radar Scanning Animation
    // -------------------------------------------------------------------------
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = textarea ? textarea.value.trim() : '';

            // Validation
            if (!text) {
                if (inputCard) {
                    inputCard.classList.add('shake');
                    setTimeout(() => inputCard.classList.remove('shake'), 450);
                }
                if (textarea) textarea.focus();
                showToast('Please enter some Roman Urdu text to analyze', 'info', 'fa-circle-exclamation');
                return;
            }

            // Start Loading & Scanning animation
            if (analyzeBtn) {
                analyzeBtn.classList.add('loading');
                analyzeBtn.disabled = true;
            }
            if (inputCard) {
                inputCard.classList.add('scanning');
            }

            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ tweet: text })
                });

                if (!response.ok) {
                    throw new Error(`Server returned HTTP ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    // Update UI with result
                    renderResult(data);

                    // Record into session history
                    saveHistoryItem({
                        text: text,
                        is_hateful: data.is_hateful,
                        prediction: data.prediction,
                        normal_probability: data.normal_probability,
                        hate_probability: data.hate_probability,
                        risk_level: data.risk_level,
                        tokens: data.tokens,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });

                    showToast(
                        data.is_hateful ? 'Warning: Hateful content detected!' : 'Analysis complete: Content appears safe.',
                        data.is_hateful ? 'info' : 'success',
                        data.is_hateful ? 'fa-triangle-exclamation' : 'fa-circle-check'
                    );
                } else {
                    showToast(data.error || 'Prediction failed', 'info', 'fa-triangle-exclamation');
                }
            } catch (err) {
                console.warn('AJAX fetch error, submitting via standard POST fallback...', err);
                form.submit();
            } finally {
                if (analyzeBtn) {
                    analyzeBtn.classList.remove('loading');
                    analyzeBtn.disabled = false;
                }
                if (inputCard) {
                    inputCard.classList.remove('scanning');
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // "How It Works" Glass Modal Handlers
    // -------------------------------------------------------------------------
    function openModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.add('open');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (howItWorksBtn) howItWorksBtn.addEventListener('click', openModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }

    // -------------------------------------------------------------------------
    // Global Keyboard Shortcuts
    // -------------------------------------------------------------------------
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter or Cmd+Enter to Submit
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (form) form.requestSubmit();
        }

        // Escape: Close Modal or Clear input
        if (e.key === 'Escape') {
            if (modalBackdrop && modalBackdrop.classList.contains('open')) {
                closeModal();
            } else if (textarea && textarea.value) {
                clearInput();
            }
        }
    });

    console.log('🛡️ Roman Urdu Hate Speech Detection AI UI initialized successfully.');
});
