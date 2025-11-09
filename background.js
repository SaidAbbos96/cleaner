// Background script for Page Cleaner extension

// Remote configuration URL (can be from your server or GitHub)
const REMOTE_CONFIG_URL = 'https://apps.aitechnogroup.uz/extentions/page-cleaner/config.json';

chrome.runtime.onInstalled.addListener(() => {
    console.log('Page Cleaner extension installed');

    // Set default configuration in storage
    chrome.storage.sync.set({
        enabled: true,
        useRemoteConfig: false, // Set to true to enable remote config by default
        remoteConfigUrl: REMOTE_CONFIG_URL,
        lastConfigLoad: 0,
        configLoadInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        statistics: {
            elementsRemoved: 0,
            sitesVisited: []
        }
    });

    // Load remote configuration
    loadRemoteConfig();
});

// Function to load remote configuration
function loadRemoteConfig() {
    chrome.storage.sync.get(['useRemoteConfig', 'remoteConfigUrl', 'lastConfigLoad', 'configLoadInterval'], function (result) {
        // Check if remote config is enabled
        if (!result.useRemoteConfig || !result.remoteConfigUrl) {
            console.log('Remote configuration is disabled or URL not set');
            return;
        }

        // Check if it's time to reload (respect interval)
        const now = Date.now();
        if (result.lastConfigLoad && (now - result.lastConfigLoad) < (result.configLoadInterval || 24 * 60 * 60 * 1000)) {
            console.log('Skipping remote config load, not enough time has passed since last load');
            return;
        }

        console.log('Loading remote configuration from:', result.remoteConfigUrl);

        fetch(result.remoteConfigUrl, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(remoteConfig => {
                chrome.storage.sync.set({
                    remoteConfig: remoteConfig,
                    lastConfigLoad: Date.now()
                });
                console.log('Remote configuration loaded successfully');

                // Notify content scripts of config update
                chrome.tabs.query({}, function (tabs) {
                    tabs.forEach(tab => {
                        try {
                            chrome.tabs.sendMessage(tab.id, {
                                action: "configUpdated",
                                useRemoteConfig: true,
                                remoteConfig: remoteConfig
                            });
                        } catch (e) {
                            // Ignore errors for tabs where content script isn't loaded
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Failed to load remote configuration:', error);
                // Notify content scripts to fall back to local config
                chrome.tabs.query({}, function (tabs) {
                    tabs.forEach(tab => {
                        try {
                            chrome.tabs.sendMessage(tab.id, {
                                action: "configUpdated",
                                useRemoteConfig: false,
                                remoteConfig: null
                            });
                        } catch (e) {
                            // Ignore errors for tabs where content script isn't loaded
                        }
                    });
                });
            });
    });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getConfig") {
        // Send both local and remote configurations
        chrome.storage.sync.get(['useRemoteConfig', 'remoteConfig'], function (result) {
            sendResponse({
                status: "ready",
                useRemoteConfig: result.useRemoteConfig,
                remoteConfig: result.remoteConfig
            });
        });
        return true; // Keep the message channel open for async response
    }

    if (request.action === "updateStats") {
        chrome.storage.sync.get(['statistics'], function (result) {
            const stats = result.statistics || { elementsRemoved: 0, sitesVisited: [] };
            stats.elementsRemoved += request.count || 0;

            // Track visited sites
            if (sender.tab && sender.tab.url) {
                try {
                    const url = new URL(sender.tab.url);
                    const domain = url.hostname.replace('www.', '');
                    if (!stats.sitesVisited.includes(domain)) {
                        stats.sitesVisited.push(domain);
                    }
                } catch (e) {
                    // Ignore invalid URLs
                }
            }

            chrome.storage.sync.set({ statistics: stats });
        });
        sendResponse({ status: "updated" });
    }

    if (request.action === "reloadConfig") {
        loadRemoteConfig();
        sendResponse({ status: "reloading" });
    }

    if (request.action === "getConfigStatus") {
        chrome.storage.sync.get(['useRemoteConfig', 'remoteConfigUrl', 'lastConfigLoad'], function (result) {
            sendResponse({
                useRemoteConfig: result.useRemoteConfig || false,
                remoteConfigUrl: result.remoteConfigUrl || REMOTE_CONFIG_URL,
                lastConfigLoad: result.lastConfigLoad || 0
            });
        });
        return true;
    }
});

// Add a click handler for the extension icon
chrome.action.onClicked.addListener((tab) => {
    // Send a message to the content script to clean immediately
    chrome.tabs.sendMessage(tab.id, { action: "cleanNow" }, function (response) {
        if (chrome.runtime.lastError) {
            // Extension not loaded on this page
            return;
        }

        if (response && response.status === "cleaned") {
            console.log("Page cleaned manually");
        }
    });
});

// Periodically reload configuration (every 24 hours)
setInterval(loadRemoteConfig, 24 * 60 * 60 * 1000);