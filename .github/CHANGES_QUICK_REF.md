# Quick Reference: Files Changed

## 1. scripts/generate-sitemaps.mjs
**Line 6:** Changed output directory

```diff
- const OUT_DIR = "./dist/al-motammem";
+ const OUT_DIR = "./public";
```

---

## 2. .github/workflows/deploy.yml
**Lines 23-48:** Removed redundant steps, fixed verification paths

### Before:
```yaml
- name: Build Angular app
  run: npm run build

- name: Verify generated files in dist
  run: |
    echo "== list dist root =="
    ls -la dist/al-motammem | head -80
    echo "== check search index =="
    test -f dist/al-motammem/sitemap.xml && echo "sitemap.xml OK" || echo "sitemap.xml not found"
    test -f dist/al-motammem/search-index.json && echo "search-index.json OK" || (echo "MISSING search-index.json" && exit 1)
```

### After:
```yaml
- name: Build Angular app (prebuild hook generates search-index & sitemaps)
  run: npm run build

- name: Verify generated files in browser output
  run: |
    echo "=== Diagnostic: Find all generated files ==="
    find dist/al-motammem -maxdepth 3 -type f \( -name "search-index.json" -o -name "sitemap*.xml" \) -ls || true
    
    echo ""
    echo "=== list dist structure ==="
    ls -la dist/al-motammem
    echo ""
    ls -la dist/al-motammem/browser | head -20
    
    echo ""
    echo "=== Verify search-index.json ==="
    test -f dist/al-motammem/browser/search-index.json && echo "✅ search-index.json OK" || (echo "❌ MISSING search-index.json" && exit 1)
    
    echo ""
    echo "=== Verify sitemaps ==="
    test -f dist/al-motammem/browser/sitemap.xml && echo "✅ sitemap.xml OK" || (echo "❌ sitemap.xml not found" && exit 1)
    test -f dist/al-motammem/browser/sitemap-static.xml && echo "✅ sitemap-static.xml OK" || echo "⚠️ sitemap-static.xml not found"
    test -f dist/al-motammem/browser/sitemap-blogs.xml && echo "✅ sitemap-blogs.xml OK" || echo "⚠️ sitemap-blogs.xml not found"
    
    echo ""
    echo "=== Search index stats ==="
    node -e "const fs=require('fs'); const p='dist/al-motammem/browser/search-index.json'; const s=fs.statSync(p).size; const j=JSON.parse(fs.readFileSync(p,'utf8')); console.log('size(bytes)=',s,'docs=',(j.docs||[]).length)"
```

---

## 3. angular.json
**No changes needed** - already correctly configured to copy `public/` → `dist/al-motammem/browser/`

---

## Key Path Changes:

| File | Old Path ❌ | New Path ✅ |
|------|-------------|-------------|
| sitemap.xml | `dist/al-motammem/sitemap.xml` | `public/sitemap.xml` → copied to `dist/al-motammem/browser/sitemap.xml` |
| sitemap-static.xml | `dist/al-motammem/sitemap-static.xml` | `public/sitemap-static.xml` → copied to `dist/al-motammem/browser/sitemap-static.xml` |
| sitemap-blogs.xml | `dist/al-motammem/sitemap-blogs.xml` | `public/sitemap-blogs.xml` → copied to `dist/al-motammem/browser/sitemap-blogs.xml` |
| search-index.json | ✅ Already correct: `public/search-index.json` | `public/search-index.json` → copied to `dist/al-motammem/browser/search-index.json` |

---

## Verify Step Path Changes:

| Check | Old Path ❌ | New Path ✅ |
|-------|-------------|-------------|
| search-index.json | `dist/al-motammem/search-index.json` | `dist/al-motammem/browser/search-index.json` |
| sitemap.xml | `dist/al-motammem/sitemap.xml` | `dist/al-motammem/browser/sitemap.xml` |
| sitemap-static.xml | Not checked | `dist/al-motammem/browser/sitemap-static.xml` |
| sitemap-blogs.xml | Not checked | `dist/al-motammem/browser/sitemap-blogs.xml` |
