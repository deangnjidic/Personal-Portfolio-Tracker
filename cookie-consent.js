// Cookie Consent Manager for Free Portfolio Tracker
// Privacy notice banner (Umami Analytics is cookie-free — no consent required)

(function() {
    'use strict';

    const CONSENT_KEY = 'cookieConsent';
    const CONSENT_ACCEPTED = 'accepted';
    const CONSENT_REJECTED = 'rejected';

    // Check if user has already made a choice
    function getConsentStatus() {
        return localStorage.getItem(CONSENT_KEY);
    }

    // Save user's consent choice
    function saveConsent(choice) {
        localStorage.setItem(CONSENT_KEY, choice);
    }

    // No consent update needed — Umami Analytics is cookie-free

    // Create and show cookie banner
    function showCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <strong>🍪 We use cookies</strong>
                    <p>We use Umami Analytics (privacy-first, cookie-free) to understand how you use our site. Your portfolio data stays 100% local and is never tracked. <a href="privacy.html" target="_blank">Learn more</a></p>
                </div>
                <div class="cookie-buttons">
                    <button id="cookie-accept" class="cookie-btn cookie-accept">Accept</button>
                    <button id="cookie-reject" class="cookie-btn cookie-reject">Reject</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', function() {
            saveConsent(CONSENT_ACCEPTED);
            banner.remove();
        });

        document.getElementById('cookie-reject').addEventListener('click', function() {
            saveConsent(CONSENT_REJECTED);
            banner.remove();
        });
    }

    // Initialize consent system
    function initCookieConsent() {
        const consent = getConsentStatus();

        if (consent === CONSENT_ACCEPTED) {
            // User already accepted
        } else if (consent === CONSENT_REJECTED) {
            // User rejected, consent stays denied (already set in head)
            return;
        } else {
            // No choice made yet, show banner
            showCookieBanner();
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent);
    } else {
        initCookieConsent();
    }
})();
