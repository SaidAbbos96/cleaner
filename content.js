// Content script to remove ads and unwanted elements
// Runs at document_start as specified in manifest.json

(function () {
    // Load local configuration
    const localConfig = typeof pageCleanerConfig !== 'undefined' ? pageCleanerConfig : {
        domains: {},
        globalSelectors: []
    };

    // Remote configuration (loaded from background)
    let remoteConfig = null;
    let useRemoteConfig = false;

    // Get current domain
    const currentDomain = window.location.hostname.replace('www.', '');

    // Performance tracking
    let lastRun = 0;
    const minInterval = 100; // Minimum interval between runs in ms

    // Function to get effective configuration (remote or local)
    function getEffectiveConfig() {
        if (useRemoteConfig && remoteConfig) {
            return remoteConfig;
        }
        return localConfig;
    }

    // Function to remove elements by selector
    function removeElements(selectors) {
        let removedCount = 0;
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    // Hide immediately to prevent flickering
                    element.style.display = 'none';
                    // Remove from DOM
                    element.remove();
                    removedCount++;
                });
            } catch (error) {
                console.warn(`Page Cleaner: Error removing elements with selector ${selector}`, error);
            }
        });

        if (removedCount > 0) {
            console.log(`Page Cleaner: Removed ${removedCount} elements`);
        }

        return removedCount;
    }

    // Function to clean page
    function cleanPage() {
        // Throttle execution
        const now = Date.now();
        if (now - lastRun < minInterval) {
            return;
        }
        lastRun = now;

        // Get the effective configuration
        const config = getEffectiveConfig();

        let totalRemoved = 0;

        // Remove global selectors
        if (config.globalSelectors && config.globalSelectors.length > 0) {
            totalRemoved += removeElements(config.globalSelectors);
        }

        // Remove domain-specific selectors
        if (config.domains && config.domains[currentDomain]) {
            totalRemoved += removeElements(config.domains[currentDomain]);
        }

        // Update statistics if we removed elements
        if (totalRemoved > 0) {
            chrome.runtime.sendMessage({
                action: "updateStats",
                count: totalRemoved
            });

            if (observer) {
                console.log(`Page Cleaner: Cleaning completed, removed ${totalRemoved} elements`);
            }
        }
    }

    // Create a MutationObserver to handle dynamically added content
    let observer;

    // Initialize observer after page load
    function initObserver() {
        observer = new MutationObserver(function (mutations) {
            let shouldClean = false;

            // Check if any relevant mutations occurred
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldClean = true;
                    break;
                }
            }

            if (shouldClean) {
                // Use a small delay to batch multiple mutations
                setTimeout(cleanPage, 10);
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Request configuration from background script
    chrome.runtime.sendMessage({ action: "getConfig" }, function (response) {
        if (response && response.status === "ready") {
            useRemoteConfig = response.useRemoteConfig || false;
            remoteConfig = response.remoteConfig || null;
            console.log('Page Cleaner: Configuration loaded', { useRemoteConfig, remoteConfig });
        }

        // Run on initial load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                cleanPage();
                initObserver();
            });
        } else {
            cleanPage();
            initObserver();
        }
    });

    // Also run when the page is fully loaded
    window.addEventListener('load', cleanPage);

    // Listen for messages from popup or background
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === "cleanNow") {
            cleanPage();
            sendResponse({ status: "cleaned" });
        }

        // Handle configuration updates
        if (request.action === "configUpdated") {
            useRemoteConfig = request.useRemoteConfig || false;
            remoteConfig = request.remoteConfig || null;
            console.log('Page Cleaner: Configuration updated', { useRemoteConfig, remoteConfig });
            cleanPage(); // Clean again with new config
            sendResponse({ status: "applied" });
        }
    });

    console.log('Page Cleaner initialized for domain:', currentDomain);
})();