const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVvKfRgesGEEZKIHZbxjDEAClLyeV2LAHOrYa7vz5nRn0acmPjFsa4rbNuFN06TLP4dA/exec";

// كود جلب المنتجات من المخزن لعرضها للعميل والكاشير
async function fetchProductsFromDatabase() {
    try {
        let response = await fetch(GOOGLE_SCRIPT_URL + "?action=getProducts");
        let products = await response.json();
        
        // هنا الكود هياخد المنتجات ويرسمها في الصفحة زي ما عملنا في التصميم
        console.log("تم تحميل المخزن:", products);
        renderStorefrontProducts(products); // دالة عرض المنتجات
    } catch (error) {
        console.error("خطأ في جلب البيانات، جاري محاولة استخدام النسخة الأوفلاين...", error);
        // هنا بنشغل وضع الأوفلاين من المتصفح لو النت قاطع
    }
}
