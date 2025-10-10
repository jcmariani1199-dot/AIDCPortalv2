# GitHub Pages Deployment Instructions

## Quick Start

This package contains the complete AI DC & Cloud Network Portal ready for GitHub Pages deployment.

**Version 3** - Final fix for dialog z-index issue

## Deployment Steps

### Option 1: Deploy to GitHub Pages (Recommended)

1. **Create/Update your GitHub repository** for GitHub Pages deployment

2. **Extract this package** to your repository's root or docs folder:
   - If deploying to root: Extract all files to the repository root
   - If deploying to docs folder: Extract all files to a `docs` folder

3. **Configure GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Set source to "Deploy from a branch"
   - Select the branch (usually `main` or `master`)
   - Select folder: `/root` or `/docs` (depending where you extracted)
   - Save

4. **Important**: Ensure your repository is set up to serve from `/AIDCPortalv2/` subdirectory
   - This application is configured with base path `/AIDCPortalv2/`
   - Your GitHub Pages URL should be: `https://yourusername.github.io/AIDCPortalv2/`

5. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy AI DC Portal v3 - Final"
   git push origin main
   ```

6. **Access your site** at: `https://yourusername.github.io/AIDCPortalv2/`

### Option 2: Deploy to Custom Domain

If you have a custom domain configured for GitHub Pages:

1. Follow steps 1-5 above
2. Configure your custom domain in GitHub Pages settings
3. Update the base path if needed (contact developer)

## What's Included

- ✅ All application files (HTML, CSS, JavaScript)
- ✅ Excel data file (705 records)
- ✅ Assets (logos, images)
- ✅ Configured for `/AIDCPortalv2/` base path
- ✅ Read-only data display (no backend required)
- ✅ Interactive map with geocoding
- ✅ Advanced filtering and reporting
- ✅ Neo Cloud Positioning form
- ✅ **FIXED**: Report dialogs now display correctly over map

## Technical Details

- **Base Path**: `/AIDCPortalv2/`
- **Data Source**: Static Excel file loaded on page load
- **No Backend Required**: Fully client-side application
- **Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Z-Index Fix**: Dialogs at z-9999, above Leaflet map (z-1000 max)

## Troubleshooting

### Issue: Page shows 404 error
**Solution**: Ensure GitHub Pages is configured correctly and the base path matches your repository name

### Issue: Excel data not loading
**Solution**: Verify the `attached_assets` folder is included in your deployment

### Issue: Blank page
**Solution**: Check browser console for errors. Ensure you're accessing the correct URL with `/AIDCPortalv2/` path

## Support

For technical support or customization requests, contact the development team.

---

**Built Date**: October 2025
**Version**: v3 - Final (Dialog z-index fixed)
