// Configuration for Page Cleaner
// Define domains and their corresponding selectors to remove
const config = {
    domains: {
        // Social media sites
        "facebook.com": [
            "[role='feed'] div[data-pagelet*='Feed'] > div:not([data-sigil]):not(.userContentWrapper):not(.mfeed_pivots_message feed-story-highlight-candidate)",
            "div[data-pagelet='RightRail']",
            "div[data-pagelet='Stories']",
            ".fbAdUnit",
            "[data-testid='placementTracking']",
            "div[aria-label='Sponsored']",
            "div[aria-label='Sponsorlu']"  // Turkish translation
        ],
        "twitter.com": [
            "[data-testid='placementTracking']",
            "[aria-label='Timeline: Trending now']",
            "[aria-label='Who to follow']",
            "[aria-label='Kimi takip etmeli']",  // Turkish translation
            "div[data-testid='primaryColumn'] > div > div > div > div > div > div:nth-child(4)"
        ],
        "youtube.com": [
            "ytd-rich-item-renderer:has(ytd-display-ad-renderer)",
            "ytd-ad-slot-renderer",
            "#player-ads",
            "ytd-companion-slot-renderer",
            "#masthead-ad"
        ],

        // News sites
        "bbc.com": [
            ".bbccom_adsense_container",
            ".orb-modules-ads",
            "[data-e2e='advert-container']"
        ],

        // Educational/testing sites
        "onlinetestpad.com": [
            ".otp-item-form-top-ad",
            ".otp-ad-content",
            ".bgc-f4",
            ".otp-poweredby",
            "#app-public-result-email",
            "div.otp-item-res-container > div:nth-child(3)",
        ],

        // Generic examples
        "example.com": [
            "#ad-banner",
            ".advertisement",
            "[data-ad]"
        ],
        "news-site.com": [
            ".sidebar-ads",
            ".popup-overlay"
        ],

        // Local test domain
        "localhost": [
            "#ad-banner",
            ".ad-banner",
            ".sidebar-ads"
        ]
    },
    // Global selectors that should be removed on all sites
    globalSelectors: [
        "#cookie-consent",
        ".cookie-banner",
        ".gdpr-consent",
        "[class*='cookie-popup']",
        "[id*='cookie-banner']",
        ".popup-overlay"
    ]
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    window.pageCleanerConfig = config;
}