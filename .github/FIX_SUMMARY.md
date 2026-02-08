# 🚀 SSR Build Pipeline Fix - Search Index & Sitemaps

## ✅ **Problem Summary**

The GitHub Actions pipeline was failing verification because:

1. **Search index** was written to `public/search-index.json` ✅ (correct)
2. **Sitemaps** were written to `dist/al-motammem/*.xml` ❌ (wrong - this doesn't exist during prebuild!)
3. **Verification** was checking `dist/al-motammem/search-index.json` ❌ (wrong - should be `browser/search-index.json`)

For Angular 19 SSR builds:
- Output structure is: `dist/al-motammem/{browser, server}`
- Static assets from `public/` are copied to `dist/al-motammem/browser/` by Angular build
- The `browser/` directory is what gets deployed and served

---

## 🔧 **Solution Applied**

### **Strategy: Use `public/` as Single Source of Truth**

All generated files (`search-index.json`, `sitemap*.xml`) now go into `public/` directory **before** the build runs. Angular's build process automatically copies them to `dist/al-motammem/browser/` where they belong.

**Benefits:**
- ✅ Scripts run in correct order (prebuild → build)
- ✅ No race conditions with dist directory creation
- ✅ Angular handles asset copying automatically
- ✅ Single source of truth for static assets
- ✅ Consistent with Angular best practices

---

## 📝 **Changes Made**

### **1. Updated `scripts/generate-sitemaps.mjs`**

**Changed:** Output directory from `dist/al-motammem/` → `public/`

```javascript
// Before:
const OUT_DIR = "./dist/al-motammem";

// After:
const OUT_DIR = "./public";
```

**Result:** All sitemap files now written to:
- `public/sitemap.xml`
- `public/sitemap-static.xml`
- `public/sitemap-blogs.xml`

---

### **2. Updated `.github/workflows/deploy.yml`**

#### **Removed Redundancy:**
- Deleted redundant script execution steps (prebuild hook already runs them)
- Simplified build step naming

#### **Enhanced Verification:**
Added comprehensive checks with diagnostics:

```yaml
- name: Verify generated files in browser output
  run: |
    # 🔍 Diagnostic: Find all generated files
    find dist/al-motammem -maxdepth 3 -type f \( -name "search-index.json" -o -name "sitemap*.xml" \) -ls || true
    
    # 📂 Show dist structure
    ls -la dist/al-motammem
    ls -la dist/al-motammem/browser | head -20
    
    # ✅ Verify search-index.json (REQUIRED)
    test -f dist/al-motammem/browser/search-index.json && echo "✅ search-index.json OK" || (echo "❌ MISSING search-index.json" && exit 1)
    
    # ✅ Verify sitemaps (REQUIRED)
    test -f dist/al-motammem/browser/sitemap.xml && echo "✅ sitemap.xml OK" || (echo "❌ sitemap.xml not found" && exit 1)
    test -f dist/al-motammem/browser/sitemap-static.xml && echo "✅ sitemap-static.xml OK" || echo "⚠️ sitemap-static.xml not found"
    test -f dist/al-motammem/browser/sitemap-blogs.xml && echo "✅ sitemap-blogs.xml OK" || echo "⚠️ sitemap-blogs.xml not found"
    
    # 📊 Show search index stats
    node -e "const fs=require('fs'); const p='dist/al-motammem/browser/search-index.json'; const s=fs.statSync(p).size; const j=JSON.parse(fs.readFileSync(p,'utf8')); console.log('size(bytes)=',s,'docs=',(j.docs||[]).length)"
```

**Key Improvements:**
- ✅ Checks correct path: `dist/al-motammem/browser/`
- ✅ Diagnostic `find` command shows exactly where files are
- ✅ Clear success (✅) and failure (❌) indicators
- ✅ Exits with error code if critical files missing
- ✅ Shows search index document count for validation

---

### **3. Verified `angular.json` Configuration**

**No changes needed** - already correctly configured:

```json
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  }
]
```

This ensures **ALL** files from `public/` are copied to `dist/al-motammem/browser/`.

---

## 🎯 **Build Flow (After Fix)**

```
1. prebuild hook executes:
   ├─ npm run build:search-index → writes to public/search-index.json
   └─ node scripts/generate-sitemaps.mjs → writes to public/sitemap*.xml

2. npm run build executes:
   └─ Angular copies public/** → dist/al-motammem/browser/**

3. Verify step checks:
   ├─ dist/al-motammem/browser/search-index.json ✅
   ├─ dist/al-motammem/browser/sitemap.xml ✅
   ├─ dist/al-motammem/browser/sitemap-static.xml ✅
   └─ dist/al-motammem/browser/sitemap-blogs.xml ✅

4. Deploy uploads:
   └─ dist/al-motammem/ → FTP server (includes browser/ with all static files)
```

---

## 📦 **Deployed Structure**

After deployment, the FTP server contains:

```
/dist/al-motammem/
├── 3rdpartylicenses.txt
├── prerendered-routes.json
├── browser/
│   ├── index.html
│   ├── search-index.json          ← ✅ Available for search
│   ├── sitemap.xml                ← ✅ Available for crawlers
│   ├── sitemap-static.xml         ← ✅ Static pages sitemap
│   ├── sitemap-blogs.xml          ← ✅ Dynamic blog sitemap
│   ├── [other browser assets]
└── server/
    └── [SSR server files]
```

All static files are now correctly served from the browser output directory.

---

## 🧪 **Testing Locally**

To verify the fix works locally:

```bash
# Clean build
rm -rf dist/

# Run build (prebuild executes automatically)
npm run build

# Verify files are in correct location
ls -la public/search-index.json         # Should exist
ls -la public/sitemap*.xml              # Should exist (3 files)
ls -la dist/al-motammem/browser/search-index.json  # Should exist
ls -la dist/al-motammem/browser/sitemap*.xml       # Should exist (3 files)

# Count search index entries
node -e "const j=require('./dist/al-motammem/browser/search-index.json'); console.log('Docs:', j.docs.length)"
```

---

## 🚨 **Critical Notes**

1. **DO NOT** delete `public/search-index.json` or `public/sitemap*.xml` from version control - they're needed as source files
2. **DO NOT** add explicit build steps for search-index or sitemaps in workflows - the `prebuild` hook handles this automatically
3. **Always check** `dist/al-motammem/browser/` for static assets, never `dist/al-motammem/` root
4. The browser output is what gets served by your web server, so all public-facing files must be there

---

## ✅ **Verification Checklist**

After deploying:

- [ ] GitHub Actions build completes successfully
- [ ] Verify step shows: "✅ search-index.json OK"
- [ ] Verify step shows: "✅ sitemap.xml OK"
- [ ] Verify step shows document count > 0
- [ ] Visit `https://almotammem.com/sitemap.xml` (should load)
- [ ] Visit `https://almotammem.com/search-index.json` (should load)
- [ ] Search functionality works on site
- [ ] Google Search Console accepts sitemap

---

## 📚 **References**

- Angular SSR Build: https://angular.dev/guide/ssr
- Assets Configuration: https://angular.dev/reference/configs/workspace-config#assets-object
- Sitemap Protocol: https://www.sitemaps.org/protocol.html

---

**Fixed by:** Senior Angular 19 SSR Build Engineer
**Date:** 2026-02-08
**Status:** ✅ Ready for deployment
