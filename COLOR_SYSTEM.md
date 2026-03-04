# Low Dose Logistics - Unified Color System

## Overview
This document defines the complete color palette for the Low Dose Logistics application, ensuring visual consistency and adherence to the premium "Hemp aesthetic" with Deep Forest/Moss Green branding.

---

## Brand Colors (Primary Palette)

### Deep Forest/Moss Green Spectrum
```css
brand-50:  #f2f5f2  /* Lightest - backgrounds, subtle highlights */
brand-100: #e1e8e1  /* Light backgrounds, hover states */
brand-200: #c5d3c6  /* Borders, dividers */
brand-300: #a3b9a5  /* Secondary borders */
brand-400: #7a9a7d  /* Muted text, icons */
brand-500: #5a7c5e  /* Interactive elements */
brand-600: #3d5a45  /* Moss Green - primary buttons, accents */
brand-700: #2d4433  /* Deep Forest - primary text, logo */
brand-800: #1e2d22  /* Dark text, headers */
brand-900: #0f1711  /* Darkest - navbar, footer */
brand-950: #080c09  /* Ultra dark accents */
```

**Note:** All `emerald-*` classes now map to these brand colors for consistency.

---

## Semantic Status Colors

### Success (Uses Brand Green)
```css
success-50:  #f2f5f2
success-100: #e1e8e1
success-600: #3d5a45  /* Active/approved states */
success-700: #2d4433
success-800: #1e2d22
```

**Usage:**
- Approved licenses
- In-stock indicators
- Successful actions
- Positive metrics

### Warning (Yellow Spectrum)
```css
warning-50:  #fefce8  /* Light background */
warning-100: #fef9c3  /* Hover background */
warning-200: #fef08a  /* Border */
warning-600: #ca8a04  /* Primary warning text */
warning-700: #a16207  /* Dark warning text */
warning-800: #854d0e  /* Very dark warning */
```

**Usage:**
- Low stock alerts (< 30 units)
- License expiring soon (< 30 days)
- Attention-needed states
- Pending approvals

### Danger (Red Spectrum)
```css
danger-50:  #fef2f2  /* Light background */
danger-100: #fee2e2  /* Hover background */
danger-200: #fecaca  /* Border */
danger-600: #dc2626  /* Primary danger text */
danger-700: #b91c1c  /* Dark danger text */
danger-800: #991b1b  /* Very dark danger */
```

**Usage:**
- Out of stock
- Expired licenses
- Error states
- Destructive actions

### Info (Uses Brand Green)
```css
info-50:  #f2f5f2
info-100: #e1e8e1
info-200: #c5d3c6
info-600: #3d5a45
info-700: #2d4433
info-800: #1e2d22
```

**Usage:**
- Informational callouts
- Delivery estimates
- Policy notifications
- Helper text

---

## Neutral Colors

### Stone (Primary Neutral)
```css
stone-50:  #fafaf9  /* Card backgrounds */
stone-100: #f5f5f4  /* Subtle backgrounds */
stone-200: #e7e5e4  /* Borders, dividers */
stone-300: #d6d3d1
stone-400: #a8a29e
stone-500: #78716c
stone-600: #57534e
stone-700: #44403c
stone-800: #292524
stone-900: #1c1917
```

**Usage:**
- Card backgrounds
- Borders and dividers
- Subtle backgrounds
- Input backgrounds

### Slate (Text Colors)
```css
slate-50:  #f8fafc
slate-100: #f1f5f9
slate-200: #e2e8f0
slate-300: #cbd5e1
slate-400: #94a3b8
slate-500: #64748b
slate-600: #475569  /* Secondary text */
slate-700: #334155  /* Body text */
slate-800: #1e293b
slate-900: #0f172a  /* Heading text */
slate-950: #020617
```

**Usage:**
- Body text: `slate-700`
- Headings: `slate-900`
- Secondary text: `slate-600`
- Placeholder text: `slate-400`

---

## Component-Specific Guidelines

### Buttons

**Primary Actions:**
```tsx
className="bg-emerald-600 hover:bg-emerald-700 text-white"
```

**Secondary Actions:**
```tsx
className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
```

**Destructive Actions:**
```tsx
className="bg-red-600 hover:bg-red-700 text-white"
```

### Badges

**Success/Approved:**
```tsx
className="bg-emerald-100 text-emerald-800 border-emerald-200"
```

**Warning:**
```tsx
className="bg-warning-100 text-warning-700 border-warning-200"
```

**Danger/Error:**
```tsx
className="bg-danger-100 text-danger-700 border-danger-200"
```

### Cards

**Standard Card:**
```tsx
className="bg-white border border-stone-200 hover:border-emerald-300 shadow-md hover:shadow-xl"
```

**Highlighted Card:**
```tsx
className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200"
```

### Info Boxes

**Replace all blue info boxes with emerald:**

❌ **Old (Blue):**
```tsx
<div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
  <AlertTriangle className="text-blue-600" />
  <p className="text-blue-700">...</p>
</div>
```

✅ **New (Emerald):**
```tsx
<div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-200">
  <AlertTriangle className="text-emerald-700" />
  <p className="text-emerald-800">...</p>
</div>
```

### Status Indicators

**In Stock:**
```tsx
<Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
  In Stock ({stock})
</Badge>
```

**Low Stock:**
```tsx
<Badge className="bg-warning-100 text-warning-800 border-warning-200">
  Low Stock ({stock})
</Badge>
```

**Out of Stock:**
```tsx
<Badge className="bg-danger-100 text-danger-800 border-danger-200">
  Out of Stock
</Badge>
```

---

## Migration Checklist

### ✅ Completed
- [x] Updated `theme.css` with unified color system
- [x] Updated `LicenseStatus.tsx` (blue → emerald)
- [x] Updated `ProductQuickView.tsx` (blue → emerald)

### 🔄 To Update

**High Priority:**
1. `LicenseApprovalQueue.tsx` - Replace blue icons with emerald
2. `GlobalSearch.tsx` - Verify status color usage
3. `ProductCard.tsx` - Standardize rating stars (use warning-400)
4. `CartSheet.tsx` - Verify price lock indicator colors

**Medium Priority:**
5. All components using `amber-*` - Verify they use warning scale
6. All components using `blue-*` - Replace with emerald/info
7. Navigation hover states - Ensure emerald consistency

**Low Priority:**
8. Charts/graphs - Verify color harmony
9. Tooltip colors
10. Focus/ring colors

---

## Color Usage Rules

### ✅ DO:
- Use `emerald-*` for all brand/primary elements
- Use `stone-*` for backgrounds and structure
- Use `slate-*` for text
- Use semantic colors (`warning`, `danger`, `success`) for status
- Maintain WCAG AAA contrast ratios

### ❌ DON'T:
- Use standard Tailwind `green-*` colors
- Use `blue-*` colors (replaced by emerald/info)
- Mix emerald with other green variants
- Use `gray-*` or `zinc-*` (use stone/slate instead)

---

## Examples

### License Status Badge
```tsx
{isExpired ? (
  <Badge className="bg-danger-100 text-danger-800 border-danger-200">
    Expired
  </Badge>
) : daysRemaining < 30 ? (
  <Badge className="bg-warning-100 text-warning-800 border-warning-200">
    Expiring Soon
  </Badge>
) : (
  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
    Active ✓
  </Badge>
)}
```

### Product Stock Indicator
```tsx
{stock <= 0 ? (
  <Badge className="bg-danger-100 text-danger-800 border-danger-200">
    Out of Stock
  </Badge>
) : stock < 20 ? (
  <Badge className="bg-warning-100 text-warning-800 border-warning-200">
    Low Stock ({stock})
  </Badge>
) : (
  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
    In Stock ({stock})
  </Badge>
)}
```

### Hero Section Gradient
```tsx
<div className="bg-gradient-to-br from-emerald-50 to-white">
  <h1 className="text-emerald-700">Premium Hemp</h1>
  <p className="text-emerald-900">Tagline</p>
</div>
```

---

## Technical Implementation

All colors are defined in `/src/styles/theme.css` using the Tailwind v4 `@theme inline` directive and CSS custom properties. This ensures:

1. **Single source of truth** for all color values
2. **Automatic IntelliSense** in IDEs
3. **Easy theme switching** if needed in future
4. **Consistent rendering** across all components

---

## Questions or Updates

When adding new components or features, refer to this document to ensure color consistency. If you need a color not listed here, consider:

1. Can I use an existing semantic color?
2. Can I use a different shade of brand/emerald?
3. Do I need to extend the color system?

Always prioritize the existing palette before adding new colors.
