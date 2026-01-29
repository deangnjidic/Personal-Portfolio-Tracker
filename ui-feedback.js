// UI Feedback Utilities - Loading States, Spinners, Toast Notifications
// Add this file to any page that needs enhanced UX feedback

(function(window) {
    'use strict';

    // Toast Notification System
    const ToastManager = {
        container: null,

        init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container';
                document.body.appendChild(this.container);
            }
        },

        show(message, type = 'info', duration = 5000) {
            this.init();

            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ'
            };

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <div class="toast-icon">${icons[type] || icons.info}</div>
                <div class="toast-content">
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">×</button>
            `;

            this.container.appendChild(toast);

            if (duration > 0) {
                setTimeout(() => {
                    toast.style.opacity = '0';
                    toast.style.transform = 'translateX(100%)';
                    setTimeout(() => toast.remove(), 300);
                }, duration);
            }

            return toast;
        },

        success(message, duration) {
            return this.show(message, 'success', duration);
        },

        error(message, duration) {
            return this.show(message, 'error', duration);
        },

        warning(message, duration) {
            return this.show(message, 'warning', duration);
        },

        info(message, duration) {
            return this.show(message, 'info', duration);
        }
    };

    // Loading Overlay
    const LoadingOverlay = {
        overlay: null,

        show(message = 'Loading...') {
            if (!this.overlay) {
                this.overlay = document.createElement('div');
                this.overlay.className = 'loading-overlay';
                this.overlay.innerHTML = `
                    <div class="spinner"></div>
                    <div class="loading-text">${message}</div>
                `;
                document.body.appendChild(this.overlay);
            } else {
                this.overlay.querySelector('.loading-text').textContent = message;
                this.overlay.style.display = 'flex';
            }
        },

        hide() {
            if (this.overlay) {
                this.overlay.style.display = 'none';
            }
        },

        remove() {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
        }
    };

    // Button Loading State
    function setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
            button.dataset.originalText = button.textContent;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
            if (button.dataset.originalText) {
                button.textContent = button.dataset.originalText;
            }
        }
    }

    // Inline Spinner
    function createSpinner(size = 'normal') {
        const spinner = document.createElement('div');
        spinner.className = size === 'small' ? 'spinner spinner-small spinner-inline' : 'spinner';
        return spinner;
    }

    // Error Message Component
    function showErrorMessage(container, title, message, actions = []) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        
        let actionsHTML = '';
        if (actions.length > 0) {
            actionsHTML = '<div class="error-actions">';
            actions.forEach(action => {
                actionsHTML += `<button class="error-action-btn" onclick="${action.onClick}">${action.label}</button>`;
            });
            actionsHTML += '</div>';
        }

        errorDiv.innerHTML = `
            <div class="error-message-header">
                <span class="error-icon">⚠</span>
                <span class="error-title">${title}</span>
            </div>
            <div class="error-content">${message}</div>
            ${actionsHTML}
        `;

        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.appendChild(errorDiv);
        }

        return errorDiv;
    }

    // Success Message Component
    function showSuccessMessage(container, title, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-message-header">
                <span class="success-icon">✓</span>
                <span class="success-title">${title}</span>
            </div>
            <div class="success-content">${message}</div>
        `;

        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.appendChild(successDiv);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => successDiv.remove(), 300);
        }, 5000);

        return successDiv;
    }

    // Progress Bar Component
    function createProgressBar(container, initialValue = 0) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = `${initialValue}%`;
        
        progressContainer.appendChild(progressBar);

        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (container) {
            container.appendChild(progressContainer);
        }

        return {
            element: progressContainer,
            setProgress(value) {
                progressBar.style.width = `${Math.min(100, Math.max(0, value))}%`;
            },
            complete() {
                this.setProgress(100);
                setTimeout(() => {
                    progressContainer.style.opacity = '0';
                    setTimeout(() => progressContainer.remove(), 300);
                }, 500);
            }
        };
    }

    // Skeleton Loading
    function createSkeleton(type = 'text') {
        const skeleton = document.createElement('div');
        skeleton.className = type === 'title' ? 'skeleton skeleton-title' : 'skeleton skeleton-text';
        return skeleton;
    }

    // Export to global scope
    window.UIFeedback = {
        toast: ToastManager,
        loading: LoadingOverlay,
        setButtonLoading,
        createSpinner,
        showErrorMessage,
        showSuccessMessage,
        createProgressBar,
        createSkeleton
    };

})(window);

// Example Usage:
// 
// // Show toast notification
// UIFeedback.toast.success('Portfolio updated!');
// UIFeedback.toast.error('Failed to fetch prices');
// UIFeedback.toast.warning('API rate limit approaching');
// UIFeedback.toast.info('Refreshing prices...');
//
// // Show loading overlay
// UIFeedback.loading.show('Fetching latest prices...');
// // ... do work ...
// UIFeedback.loading.hide();
//
// // Button loading state
// const btn = document.getElementById('refreshBtn');
// UIFeedback.setButtonLoading(btn, true);
// // ... do work ...
// UIFeedback.setButtonLoading(btn, false);
//
// // Show error message
// UIFeedback.showErrorMessage(
//     document.body,
//     'API Error',
//     'Could not fetch stock prices. Please check your API key.',
//     [
//         { label: 'Retry', onClick: 'retryFetch()' },
//         { label: 'Settings', onClick: 'openSettings()' }
//     ]
// );
//
// // Progress bar
// const progress = UIFeedback.createProgressBar(document.body, 0);
// progress.setProgress(50);
// progress.complete(); // Set to 100% and fade out
