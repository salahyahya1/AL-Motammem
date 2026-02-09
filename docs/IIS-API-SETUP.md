# إعداد الـ API على IIS (نفس الدومين)

لو طلبات الـ API ترجع **404 مع HTML** بدل **JSON**، معناها الطلب مش واصل لتطبيق الـ API على السيرفر.

## المطلوب على السيرفر (IIS)

1. **تطبيق الـ API يكون Application تحت نفس الـ Site**
   - في IIS: Site `almotammem.com` ← Add Application
   - **Alias:** `api`
   - **Physical path:** مجلد نشر تطبيق الـ ASP.NET API

2. **المسارات**
   - الطلبات بتكون: `https://almotammem.com/api/articles/mostread` و `.../api/articles/allblogs?page=1`
   - تأكد إن الـ API عنده routes مطابقة (مثلاً `articles/mostread`, `articles/allblogs`).

3. **بعد التعديل**
   - أعد تشغيل Application Pool بتاع الـ API أو الـ Site.

الفرونت إند (هذا المشروع) بيبعت الطلبات صح؛ الـ 404 HTML من السيرفر معناه إن مسار `/api` مش موجّه لتطبيق الـ API.
