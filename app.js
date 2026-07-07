// 1. رابط السيرفر بتاعك على جوجل سكريبت
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVvKfRgesGEEZKIHZbxjDEAClLyeV2LAHOrYa7vz5nRn0acmPjFsa4rbNuFN06TLP4dA/exec";

// 2. دالة جلب المنتجات من المخزن (بتدعم الأوفلاين)
async function fetchProducts() {
    try {
        // تحديث حالة الاتصال في الشاشة
        const syncStatus = document.getElementById('syncStatus');
        if(syncStatus) syncStatus.innerHTML = '<span class="h-2 w-2 rounded-full bg-blue-300 animate-pulse"></span> جاري التحميل...';

        // محاولة جلب الداتا من جوجل
        let response = await fetch(GOOGLE_SCRIPT_URL + "?action=getProducts");
        let products = await response.json();
        
        // حفظ نسخة "أوفلاين" في المتصفح عشان لو النت قطع
        localStorage.setItem('offline_products', JSON.stringify(products));
        
        if(syncStatus) syncStatus.innerHTML = '<span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> النظام متصل بالإنترنت';
        
        // هنا هنبعت المنتجات تترسم في الصفحة (سواء للعميل أو الكاشير)
        return products;

    } catch (error) {
        console.warn("الإنترنت مقطوع! سيتم تحميل بيانات المخزن من الذاكرة المؤقتة...");
        const syncStatus = document.getElementById('syncStatus');
        if(syncStatus) syncStatus.innerHTML = '<span class="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span> يعمل الآن أوفلاين';
        
        // لو النت قاطع، بنجيب الداتا اللي متخزنة في المتصفح
        let offlineData = localStorage.getItem('offline_products');
        if(offlineData) {
            return JSON.parse(offlineData);
        } else {
            alert("لا يوجد اتصال بالإنترنت، ولا توجد بضائع محفوظة مسبقاً لعرضها!");
            return [];
        }
    }
}

// 3. دالة ترحيل الفاتورة أو الأوردر (للكاشير أو للعميل)
async function submitOrder(orderData) {
    // إضافة نوع العملية عشان جوجل سكريبت يفهمها
    orderData.action = 'addOrder';
    
    try {
        // محاولة الإرسال لجوجل شيت
        let response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(orderData),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' } // لتخطي مشكلة الـ CORS
        });
        
        let result = await response.json();
        console.log("تم ترحيل الفاتورة بنجاح:", result);
        return true;

    } catch (error) {
        console.warn("أنت أوفلاين! سيتم حفظ الفاتورة وإرسالها لاحقاً...");
        
        // حفظ الفاتورة في المتصفح عشان مفيش نت
        let pendingOrders = JSON.parse(localStorage.getItem('pending_orders') || '[]');
        pendingOrders.push(orderData);
        localStorage.setItem('pending_orders', JSON.stringify(pendingOrders));
        
        alert("تم حفظ الفاتورة محلياً بسبب انقطاع الإنترنت. سيتم ترحيلها تلقائياً عند عودة الاتصال.");
        return true; // بنرجع true عشان الكاشير يكمل شغل وميقفش
    }
}

// 4. دالة مزامنة الفواتير اللي اتعملت أوفلاين (بتشتغل أول ما النت يرجع)
async function syncPendingOrders() {
    let pendingOrders = JSON.parse(localStorage.getItem('pending_orders') || '[]');
    
    if (pendingOrders.length > 0 && navigator.onLine) {
        console.log("جاري مزامنة الفواتير المحفوظة أوفلاين...");
        
        for (let i = 0; i < pendingOrders.length; i++) {
            try {
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    body: JSON.stringify(pendingOrders[i]),
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
                });
            } catch(e) {
                console.error("فشل مزامنة فاتورة، سيتم المحاولة لاحقاً");
                return; // لو فشل يوقف المزامنة
            }
        }
        // لو كله اترفع تمام، بنمسحهم من المتصفح
        localStorage.removeItem('pending_orders');
        console.log("تم ترحيل كل الفواتير المحفوظة بنجاح!");
    }
}

// تشغيل المزامنة التلقائية كل ما تفتح الصفحة
window.addEventListener('online', syncPendingOrders);
window.onload = function() {
    syncPendingOrders(); // محاولة المزامنة أول ما يفتح
    // loadData(); // دي الدالة اللي هترسم المنتجات بعدين
};
