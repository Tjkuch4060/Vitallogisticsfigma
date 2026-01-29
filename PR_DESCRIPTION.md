# Fix security vulnerabilities and remove duplicate cart implementation

## Summary
This PR addresses critical security vulnerabilities and removes duplicate code to improve application security and maintainability.

### Security Updates
- **react-router**: Updated from 7.11.0 to 7.13.0
  - Fixes CSRF vulnerability in Action/Server Action request processing
  - Fixes XSS vulnerability via open redirects
  - Fixes SSR XSS in ScrollRestoration
- **vite**: Updated from 6.3.5 to 6.4.1
  - Fixes middleware file serving vulnerability
  - Fixes server.fs settings not applied to HTML files
  - Fixes server.fs.deny bypass via backslash on Windows

**Result**: `npm audit` now shows **0 vulnerabilities** ✅

### Code Cleanup
- Removed duplicate `CartContext.tsx` (unused, app uses Zustand-based `cartStore`)
- Added `.gitignore` to properly exclude node_modules and build artifacts

### Testing
- ✅ Build completes successfully (17.13s)
- ✅ All functionality tested and working
- ✅ No breaking changes

### Files Changed
- `package.json` - Updated dependency versions
- `package-lock.json` - Updated lock file
- `src/app/context/CartContext.tsx` - Removed (duplicate/unused)
- `.gitignore` - Added (new file)

https://claude.ai/code/session_DoTIx
