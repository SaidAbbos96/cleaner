// Script to enable remote configuration for the Page Cleaner extension
// Run this in the Chrome DevTools console on the extension's background page

// Enable remote configuration
chrome.storage.sync.set({
    useRemoteConfig: true,
    remoteConfigUrl: 'https://raw.githubusercontent.com/your-username/your-repo/main/config.json'
}, function () {
    console.log('Remote configuration enabled');
});

// Force reload of remote configuration
chrome.runtime.sendMessage({ action: "reloadConfig" }, function (response) {
    console.log('Configuration reload requested', response);
});