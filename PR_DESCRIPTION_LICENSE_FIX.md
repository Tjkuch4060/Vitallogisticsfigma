# Fix license status logic inconsistency in UserContext

## Summary
This PR fixes a critical logic inconsistency in the license status management where the `useEffect` and provider return value were setting different statuses for expired licenses.

## Problem
The `UserContext` had conflicting logic:
- **useEffect** (line 30-31): Set status to `'Expired'` when `daysRemaining <= 0`
- **Provider return** (line 54): Returned `'Suspended'` when `daysRemaining <= 0`

This inconsistency caused:
- Unpredictable behavior in license status display
- Confusion between internal state management and exposed context values
- Potential bugs in components checking license status

## Solution
Standardized on `'Suspended'` status throughout:

### Changes in `src/app/context/UserContext.tsx`:
1. **Line 31**: Changed `setStatus('Expired')` → `setStatus('Suspended')`
2. **Line 32**: Changed condition `status === 'Expired'` → `status === 'Suspended'`
3. **Line 54**: Removed redundant status override - now returns `status` directly

## Why 'Suspended' Instead of 'Expired'?
- Matches existing app behavior in `App.tsx` suspension guard (line 55)
- More semantically accurate (license blocks user actions when expired)
- Simpler logic without duplicate status transformations

## Benefits
- ✅ Consistent license status throughout the application
- ✅ Simplified provider logic (removed redundant override)
- ✅ Matches expected behavior in suspension guards
- ✅ Easier to reason about and maintain

## Testing
- ✅ Build completes successfully
- ✅ No breaking changes
- ✅ Logic verified against App.tsx suspension guard requirements

## Type Definition
Note: The `LicenseStatus` type still includes `'Expired'` for potential future use (manual vs automatic suspension differentiation), but current logic only uses `'Active'` and `'Suspended'`.

https://claude.ai/code/session_DoTIx
