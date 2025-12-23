// تهيئة الصفحة والأنيميشنات
document.addEventListener('DOMContentLoaded', function() {
    // الشاشة الافتتاحية
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainContent = document.getElementById('mainContent');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // محاكاة التحميل
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 2;
        loadingProgress.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            // إخفاء شاشة الترحيب وإظهار المحتوى الرئيسي
            setTimeout(() => {
                welcomeScreen.classList.add('fade-out');
                
                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                    mainContent.classList.add('show');
                    
                    // بدء السلايدر تلقائياً
                    initSlider();
                    
                    // تهيئة التصفية حسب الأقسام
                    initFilter();
                    
                    // تهيئة القائمة المتحركة للأجهزة المحمولة
                    initMobileMenu();
                }, 800);
            }, 500);
        }
    }, 40);
    
    // تهيئة السلايدر
    function initSlider() {
        const slides = document.querySelectorAll('.slider-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        let currentSlide = 0;
        const slideCount = slides.length;
        let slideInterval;
        
        // عرض الشريحة المحددة
        function showSlide(index) {
            // إخفاء جميع الشرائح
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // عرض الشريحة المحددة
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }
        
        // الانتقال إلى الشريحة التالية
        function nextSlide() {
            let nextIndex = (currentSlide + 1) % slideCount;
            showSlide(nextIndex);
        }
        
        // الانتقال إلى الشريحة السابقة
        function prevSlide() {
            let prevIndex = (currentSlide - 1 + slideCount) % slideCount;
            showSlide(prevIndex);
        }
        
        // إضافة مستمعي الأحداث للأزرار
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // إضافة مستمعي الأحداث للنقاط
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideInterval();
            });
        });
        
        // بدء التبديل التلقائي
        function startSlideInterval() {
            slideInterval = setInterval(nextSlide, 5000);
        }
        
        // إعادة ضبط المؤقت التلقائي
        function resetSlideInterval() {
            clearInterval(slideInterval);
            startSlideInterval();
        }
        
        // بدء التشغيل التلقائي
        startSlideInterval();
        
        // إيقاف التبديل التلقائي عند التمرير فوق السلايدر
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            startSlideInterval();
        });
    }
    
    // تهيئة التصفية حسب الأقسام
    function initFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة النشاط من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // إضافة النشاط للزر المختار
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                // تصفية المنتجات
                productCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === category) {
                        card.style.display = 'block';
                        // إضافة أنيميشن
                        card.style.animation = 'fadeInUp 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // تهيئة القائمة المتحركة للأجهزة المحمولة
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.main-nav a');
        
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // إغلاق القائمة عند النقر على رابط
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // إضافة منتج إلى سلة التسوق
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            
            // التأكد من أن المنتج متوفر
            if (button.disabled) return;
            
            // الحصول على معلومات المنتج
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            
            // إضافة أنيميشن للسلة
            const cartIcon = document.querySelector('.cart-icon');
            const cartCount = document.querySelector('.cart-count');
            
            // زيادة العداد
            let count = parseInt(cartCount.textContent);
            cartCount.textContent = count + 1;
            
            // أنيميشن للسلة
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 300);
            
            // إظهار رسالة تأكيد
            showNotification(`تمت إضافة ${productName} إلى سلة التسوق`);
            
            // تحديث سعر المنتج
            button.textContent = 'تم الإضافة';
            button.style.backgroundColor = '#28a745';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'أضف إلى السلة';
                button.style.backgroundColor = '';
                button.disabled = false;
            }, 2000);
        }
    });
    
    // عرض إشعار
    function showNotification(message) {
        // إنصراف الإشعار إذا كان موجوداً
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // إنشاء الإشعار
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // أنيميشن الظهور
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // إخفاء الإشعار بعد 3 ثوانٍ
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // إضافة أنماط الإشعار
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // تنعيم التمرير عند النقر على الروابط الداخلية
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
