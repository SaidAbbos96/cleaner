# Remote Configuration Guide

This document explains how to set up and use remote configuration with the Page Cleaner extension.

## How Remote Configuration Works

The Page Cleaner extension can load configuration rules from a remote server instead of using only the local [config.js](file:///e:/coding/page-cleaner/config.js) file. This allows you to update the ad blocking rules without updating the extension itself.

## Setting Up Remote Configuration

### 1. Host Your Configuration File

Create a JSON configuration file with your ad blocking rules and host it on a web server or GitHub. You can use the [sample-remote-config.json](file:///e:/coding/page-cleaner/sample-remote-config.json) as a template.

Example configuration:
```json
{
    "domains": {
        "example.com": [
            ".ad-banner",
            "#sidebar-ads",
            "[data-ad-container]"
        ]
    },
    "globalSelectors": [
        ".google-ads",
        "[data-ads]"
    ]
}
```

### 2. Update the Extension Settings

You can configure the remote configuration URL in two ways:

#### Option A: Modify the Extension Code
Edit [background.js](file:///e:/coding/page-cleaner/background.js) and change the `REMOTE_CONFIG_URL` constant:
```javascript
const REMOTE_CONFIG_URL = 'https://your-server.com/page-cleaner-config.json';
```

#### Option B: Extension Settings (Future Feature)
In future versions, we plan to add a settings page where you can configure the remote URL without modifying code.

### 3. Enable Remote Configuration

The extension uses local configuration by default. To enable remote configuration:

1. Set `useRemoteConfig` to `true` in the extension storage
2. Ensure the remote configuration URL is correctly set

## Configuration File Format

The remote configuration file should be a valid JSON file with the following structure:

```json
{
    "domains": {
        "domain1.com": [
            "selector1",
            "selector2"
        ],
        "domain2.com": [
            "selector3",
            "selector4"
        ]
    },
    "globalSelectors": [
        "global-selector1",
        "global-selector2"
    ]
}
```

- `domains`: Object where keys are domain names and values are arrays of CSS selectors to remove for that domain
- `globalSelectors`: Array of CSS selectors that should be removed on all websites

## Hosting Options

### GitHub Hosting
1. Create a GitHub repository
2. Add your configuration file to the repository
3. Use the raw GitHub URL:
   ```
   https://raw.githubusercontent.com/username/repository/main/config.json
   ```

### Web Server Hosting
1. Upload your configuration file to a web server
2. Ensure the file is accessible via HTTP/HTTPS
3. Use the direct URL to the file

## Fallback Behavior

If the extension cannot load the remote configuration (network issues, invalid JSON, etc.), it will automatically fall back to using the local configuration from [config.js](file:///e:/coding/page-cleaner/config.js).

## Testing Remote Configuration

To test your remote configuration:

1. Load the extension in Chrome
2. Open the background script console (chrome://extensions/ → Inspect views for Page Cleaner)
3. Check for any errors in loading the remote configuration
4. Visit a website that should be affected by your rules
5. Verify that the elements are being removed

## Security Considerations

- Only load configuration from trusted sources
- Validate the JSON format of your configuration files
- Be cautious when updating rules, as they affect all users of your configuration