// ========== ГЛОБАЛЬНОЕ ХРАНИЛИЩЕ НАСТРОЕК ==========
let appSettings = {
    prices: {},           // цена для каждого чая (по имени)
    texts: {
        mainSubtitle: "г. Кропоткин, Красная ул., 168/1",
        atmosphereText: "ДИП — это не просто место, это состояние. Уютный полумрак, приглушённый свет, комфортные зоны для отдыха.",
        mixText: "Большой выбор ароматных миксов, чайная карта. Уделяем внимание каждой детали.",
        mainDescription: "Атмосфера, люди и уют, которые создают особое пространство вне времени."
    },
    contacts: {
        address: "г. Кропоткин, Красная ул., 168/1",
        telegram: "dayanameow",
        hours: "ЕЖЕДНЕВНО 17:00 - 00:00",
        email: "sanilon217@gmail.com"
    },
    sliderImages: [
        "https://avatars.mds.yandex.net/get-altay/14185024/2a000001941925734eb98261248330c551d2/XXXL",
        "https://avatars.mds.yandex.net/get-altay/19876101/2a0000019b6140feb2f1da048375cad4f29b/XXXL",
        "https://avatars.mds.yandex.net/get-altay/15285359/2a00000193fd7f74f0211baaa065ed0f89fa/XXXL",
        "https://avatars.mds.yandex.net/get-altay/6550540/2a00000190033b7467aa842830aa42f1ffc9/XXXL"
    ],
    reviews: []  // копия reviewsData для редактирования
};

// ========== ЗАГРУЗКА/СОХРАНЕНИЕ НАСТРОЕК ==========
function loadSettings() {
    const saved = localStorage.getItem('dip_admin_settings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appSettings = { ...appSettings, ...parsed };
            // Синхронизируем цены с menuData
            if (appSettings.prices) {
                for (let category of menuData) {
                    for (let item of category.items) {
                        if (appSettings.prices[item.name]) {
                            item.price = appSettings.prices[item.name];
                        }
                    }
                }
            }
            // Синхронизируем teasData
            if (appSettings.prices) {
                for (let tea of teasData) {
                    if (appSettings.prices[tea.name]) {
                        tea.price = appSettings.prices[tea.name];
                    }
                }
            }
            // Загружаем отзывы
            if (appSettings.reviews && appSettings.reviews.length > 0) {
                window.reviewsData = appSettings.reviews;
            } else {
                window.reviewsData = reviewsData;
                appSettings.reviews = [...reviewsData];
            }
        } catch(e) { console.error('Ошибка загрузки настроек', e); }
    } else {
        // Инициализируем цены из menuData
        appSettings.prices = {};
        for (let category of menuData) {
            for (let item of category.items) {
                appSettings.prices[item.name] = item.price;
            }
        }
        appSettings.reviews = [...reviewsData];
        window.reviewsData = [...reviewsData];
        saveSettings();
    }
    applySettingsToUI();
}

function saveSettings() {
    // Сохраняем актуальные цены из menuData
    for (let category of menuData) {
        for (let item of category.items) {
            appSettings.prices[item.name] = item.price;
        }
    }
    localStorage.setItem('dip_admin_settings', JSON.stringify(appSettings));
    showToast('✅ Настройки сохранены', false);
}

function applySettingsToUI() {
    // Применяем тексты
    const mainSubtitle = document.getElementById('mainSubtitle');
    if (mainSubtitle) mainSubtitle.textContent = appSettings.texts.mainSubtitle;
    const atmosphereText = document.getElementById('atmosphereText');
    if (atmosphereText) atmosphereText.textContent = appSettings.texts.atmosphereText;
    const mixText = document.getElementById('mixText');
    if (mixText) mixText.textContent = appSettings.texts.mixText;
    const mainDescription = document.getElementById('mainDescriptionText');
    if (mainDescription) mainDescription.textContent = appSettings.texts.mainDescription;
    
    // Применяем контакты
    const addressElements = document.querySelectorAll('#addressText, #contactsAddress, #contactsAddressSmall');
    addressElements.forEach(el => { if(el) el.textContent = appSettings.contacts.address; });
    const hoursElements = document.querySelectorAll('#hoursText, #contactsHoursText');
    hoursElements.forEach(el => { if(el) el.textContent = `🕒 ${appSettings.contacts.hours}`; });
    const tgLinks = document.querySelectorAll('#contactsTelegramLink, #policyTelegramLink');
    tgLinks.forEach(link => {
        if(link) {
            link.textContent = `@${appSettings.contacts.telegram}`;
            link.href = `https://t.me/${appSettings.contacts.telegram}`;
        }
    });
    const policyEmail = document.getElementById('policyEmail');
    if(policyEmail) policyEmail.textContent = appSettings.contacts.email;
    
    // Обновляем слайдер, если он уже инициализирован
    if (typeof updateSliderImages === 'function') {
        updateSliderImages();
    }
}

// ========== АДМИН-ПАНЕЛЬ ==========
let adminClickCount = 0;
let adminClickTimer = null;
let isAdminMode = false;

function initAdminMode() {
    const logo = document.getElementById('brandLogo');
    if (!logo) return;
    
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', function(e) {
        e.stopPropagation();
        adminClickCount++;
        if (adminClickTimer) clearTimeout(adminClickTimer);
        adminClickTimer = setTimeout(() => {
            adminClickCount = 0;
        }, 1000);
        
        if (adminClickCount >= 5 && !isAdminMode) {
            adminClickCount = 0;
            openAdminPanel();
        }
    });
}

function openAdminPanel() {
    isAdminMode = true;
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.classList.add('active');
        loadAdminData();
    }
}

function closeAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.classList.remove('active');
    }
    isAdminMode = false;
}

function loadAdminData() {
    // Загружаем цены в редактор
    const pricesEditor = document.getElementById('pricesEditor');
    if (pricesEditor) {
        let html = '';
        for (let category of menuData) {
            html += `<div class="admin-price-category"><h4>${category.title}</h4>`;
            for (let item of category.items) {
                html += `
                    <div class="admin-price-item">
                        <span>${item.name}</span>
                        <input type="number" class="admin-price-input" data-tea-name="${item.name}" value="${item.price}" step="10" min="0">
                        <span>₽</span>
                    </div>
                `;
            }
            html += `</div>`;
        }
        pricesEditor.innerHTML = html;
    }
    
    // Загружаем тексты
    const subtitleTa = document.getElementById('editMainSubtitle');
    if (subtitleTa) subtitleTa.value = appSettings.texts.mainSubtitle;
    const atmosphereTa = document.getElementById('editAtmosphereText');
    if (atmosphereTa) atmosphereTa.value = appSettings.texts.atmosphereText;
    const mixTa = document.getElementById('editMixText');
    if (mixTa) mixTa.value = appSettings.texts.mixText;
    const mainDescTa = document.getElementById('editMainDescription');
    if (mainDescTa) mainDescTa.value = appSettings.texts.mainDescription;
    
    // Загружаем контакты
    const addressInput = document.getElementById('editAddress');
    if (addressInput) addressInput.value = appSettings.contacts.address;
    const telegramInput = document.getElementById('editTelegram');
    if (telegramInput) telegramInput.value = appSettings.contacts.telegram;
    const hoursInput = document.getElementById('editHours');
    if (hoursInput) hoursInput.value = appSettings.contacts.hours;
    const emailInput = document.getElementById('editEmail');
    if (emailInput) emailInput.value = appSettings.contacts.email;
    
    // Загружаем слайдер
    loadSliderEditor();
    
    // Загружаем отзывы
    loadReviewsEditor();
}

function loadSliderEditor() {
    const editor = document.getElementById('sliderEditor');
    if (!editor) return;
    let html = '';
    appSettings.sliderImages.forEach((img, index) => {
        html += `
            <div class="admin-slider-item">
                <label>Слайд ${index + 1}</label>
                <input type="text" class="admin-slider-input" data-slider-index="${index}" value="${img}" placeholder="URL изображения">
                <div class="admin-slider-preview"><img src="${img}" style="max-width: 100px; max-height: 60px; border-radius: 8px;"></div>
            </div>
        `;
    });
    editor.innerHTML = html;
    
    // Добавляем обработчики для превью
    document.querySelectorAll('.admin-slider-input').forEach(input => {
        input.addEventListener('input', function() {
            const preview = this.parentElement.querySelector('.admin-slider-preview img');
            if (preview) preview.src = this.value;
        });
    });
}

function loadReviewsEditor() {
    const editor = document.getElementById('reviewsEditor');
    if (!editor) return;
    let html = '';
    window.reviewsData.forEach((review, index) => {
        html += `
            <div class="admin-review-item" data-review-index="${index}">
                <div class="admin-review-header">
                    <input type="text" class="admin-review-name" value="${escapeHtml(review.name)}" placeholder="Имя">
                    <input type="number" class="admin-review-rating" value="${review.rating}" min="1" max="5" step="1" style="width: 80px;">
                    <button class="admin-review-delete" data-review-index="${index}">🗑️</button>
                </div>
                <textarea class="admin-review-text" rows="2" placeholder="Текст отзыва">${escapeHtml(review.text)}</textarea>
                <input type="text" class="admin-review-avatar" value="${escapeHtml(review.avatar)}" placeholder="Аватар (1 буква)" maxlength="1" style="width: 60px;">
                <input type="text" class="admin-review-date" value="${escapeHtml(review.date)}" placeholder="Дата">
            </div>
        `;
    });
    editor.innerHTML = html;
    
    // Обработчики удаления
    document.querySelectorAll('.admin-review-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-review-index'));
            if (!isNaN(idx)) {
                window.reviewsData.splice(idx, 1);
                loadReviewsEditor();
                saveSettings();
                renderReviews();
                showToast('Отзыв удален', false);
            }
        });
    });
    
    // Обработчики изменения
    document.querySelectorAll('.admin-review-name, .admin-review-rating, .admin-review-text, .admin-review-avatar, .admin-review-date').forEach(field => {
        field.addEventListener('change', function() {
            const parent = this.closest('.admin-review-item');
            if (parent) {
                const idx = parseInt(parent.getAttribute('data-review-index'));
                if (!isNaN(idx) && window.reviewsData[idx]) {
                    if (this.classList.contains('admin-review-name')) window.reviewsData[idx].name = this.value;
                    if (this.classList.contains('admin-review-rating')) window.reviewsData[idx].rating = parseInt(this.value);
                    if (this.classList.contains('admin-review-text')) window.reviewsData[idx].text = this.value;
                    if (this.classList.contains('admin-review-avatar')) window.reviewsData[idx].avatar = this.value;
                    if (this.classList.contains('admin-review-date')) window.reviewsData[idx].date = this.value;
                    saveSettings();
                    renderReviews();
                }
            }
        });
    });
}

// Сохранение цен
function saveAllPrices() {
    const inputs = document.querySelectorAll('.admin-price-input');
    inputs.forEach(input => {
        const teaName = input.getAttribute('data-tea-name');
        const newPrice = parseInt(input.value);
        if (teaName && !isNaN(newPrice)) {
            // Обновляем в menuData
            for (let category of menuData) {
                for (let item of category.items) {
                    if (item.name === teaName) {
                        item.price = newPrice;
                    }
                }
            }
            // Обновляем в teasData
            for (let tea of teasData) {
                if (tea.name === teaName) {
                    tea.price = newPrice;
                }
            }
            appSettings.prices[teaName] = newPrice;
        }
    });
    saveSettings();
    renderMenu(document.getElementById('searchInput')?.value || '');
    showToast('Цены сохранены!', false);
}

// Сохранение текстов
function saveTexts() {
    appSettings.texts.mainSubtitle = document.getElementById('editMainSubtitle')?.value || '';
    appSettings.texts.atmosphereText = document.getElementById('editAtmosphereText')?.value || '';
    appSettings.texts.mixText = document.getElementById('editMixText')?.value || '';
    appSettings.texts.mainDescription = document.getElementById('editMainDescription')?.value || '';
    saveSettings();
    applySettingsToUI();
    showToast('Тексты сохранены!', false);
}

// Сохранение контактов
function saveContacts() {
    appSettings.contacts.address = document.getElementById('editAddress')?.value || '';
    appSettings.contacts.telegram = document.getElementById('editTelegram')?.value || '';
    appSettings.contacts.hours = document.getElementById('editHours')?.value || '';
    appSettings.contacts.email = document.getElementById('editEmail')?.value || '';
    saveSettings();
    applySettingsToUI();
    showToast('Контакты сохранены!', false);
}

// Сохранение слайдера
function saveSlider() {
    const inputs = document.querySelectorAll('.admin-slider-input');
    const newImages = [];
    inputs.forEach(input => {
        const url = input.value.trim();
        if (url) newImages.push(url);
    });
    if (newImages.length > 0) {
        appSettings.sliderImages = newImages;
        saveSettings();
        updateSliderImages();
        showToast('Слайдер обновлен!', false);
    } else {
        showToast('Добавьте хотя бы одно изображение', true);
    }
}

// Обновление слайдера на странице
function updateSliderImages() {
    const slider = document.getElementById('slider');
    if (!slider) return;
    
    let slidesHtml = '';
    appSettings.sliderImages.forEach((img, index) => {
        slidesHtml += `
            <div class="slide" data-full-img="${img}">
                <img src="${img}" alt="ДИП слайд ${index + 1}" loading="lazy">
                <div class="slide-number">${index + 1}/${appSettings.sliderImages.length}</div>
            </div>
        `;
    });
    slider.innerHTML = slidesHtml;
    
    // Переинициализируем слайдер
    if (typeof reinitSlider === 'function') {
        reinitSlider();
    }
}

// Добавление отзыва
function addReview() {
    const newReview = {
        name: "Новый гость",
        rating: 5,
        text: "Текст нового отзыва",
        date: new Date().toLocaleDateString('ru-RU'),
        avatar: "★"
    };
    window.reviewsData.push(newReview);
    appSettings.reviews = [...window.reviewsData];
    saveSettings();
    loadReviewsEditor();
    renderReviews();
    showToast('Отзыв добавлен!', false);
}

// Экспорт данных
function exportData() {
    const exportData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        settings: appSettings,
        menuData: menuData,
        teasData: teasData
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dip_backup_${new Date().toISOString().slice(0,19)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Данные экспортированы!', false);
}

// Импорт данных
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.settings) {
                appSettings = { ...appSettings, ...imported.settings };
                // Синхронизируем цены
                if (appSettings.prices) {
                    for (let category of menuData) {
                        for (let item of category.items) {
                            if (appSettings.prices[item.name]) {
                                item.price = appSettings.prices[item.name];
                            }
                        }
                    }
                    for (let tea of teasData) {
                        if (appSettings.prices[tea.name]) {
                            tea.price = appSettings.prices[tea.name];
                        }
                    }
                }
                if (appSettings.reviews && appSettings.reviews.length > 0) {
                    window.reviewsData = appSettings.reviews;
                }
                saveSettings();
                applySettingsToUI();
                renderMenu(document.getElementById('searchInput')?.value || '');
                renderReviews();
                updateSliderImages();
                showToast('Данные импортированы!', false);
                if (isAdminMode) loadAdminData();
            } else {
                showToast('Неверный формат файла', true);
            }
        } catch(err) {
            showToast('Ошибка при импорте', true);
        }
    };
    reader.readAsText(file);
}

// Сброс к оригиналу
function resetToDefault() {
    if (confirm('⚠️ ВНИМАНИЕ! Все изменения будут потеряны. Вы уверены, что хотите сбросить все настройки к оригиналу?')) {
        localStorage.removeItem('dip_admin_settings');
        location.reload();
    }
}

// ========== ОСТАЛЬНЫЕ ФУНКЦИИ САЙТА ==========
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'); }
function showToast(text, isError = false) { 
    const toast = document.getElementById('toastMsg');
    if(toast) { toast.textContent = text; toast.style.borderColor = isError ? '#FF8888' : '#A6ADB7'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3000); } 
}

// ========== РЕНДЕР МЕНЮ ==========
function renderMenu(filterText = '') {
    const container = document.getElementById('menuGrid');
    if (!container) return;
    
    if (filterText === '') {
        container.innerHTML = '';
        menuData.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'menu-category';
            let itemsHtml = `<h3>${category.title}</h3><img class="menu-img" src="${category.img}" alt="${category.title}" loading="lazy">`;
            category.items.forEach(item => {
                itemsHtml += `
                    <div class="menu-item" data-name="${item.name}" data-price="${item.price}" data-composition="${item.composition}" data-desc="${item.desc || ''}" data-category="${category.title}">
                        <span class="menu-item-name">${item.name}</span>
                        <span class="menu-item-price">${item.price}₽</span>
                    </div>
                `;
            });
            categoryDiv.innerHTML = itemsHtml;
            container.appendChild(categoryDiv);
        });
    } else {
        const lowerFilter = filterText.toLowerCase();
        container.innerHTML = '';
        let hasResults = false;
        
        menuData.forEach(category => {
            const categoryMatches = category.title.toLowerCase().includes(lowerFilter);
            const matchedItems = category.items.filter(item => {
                if (item.name.toLowerCase().includes(lowerFilter)) return true;
                if (item.desc && item.desc.toLowerCase().includes(lowerFilter)) return true;
                if (item.composition && item.composition.toLowerCase().includes(lowerFilter)) return true;
                if (!isNaN(parseFloat(lowerFilter)) && item.price.toString().includes(lowerFilter)) return true;
                return false;
            });
            
            if (categoryMatches || matchedItems.length > 0) {
                hasResults = true;
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'menu-category';
                let itemsToShow = categoryMatches ? category.items : matchedItems;
                let itemsHtml = `<h3>${category.title}</h3><img class="menu-img" src="${category.img}" alt="${category.title}" loading="lazy">`;
                itemsToShow.forEach(item => {
                    itemsHtml += `
                        <div class="menu-item" data-name="${item.name}" data-price="${item.price}" data-composition="${item.composition}" data-desc="${item.desc || ''}" data-category="${category.title}">
                            <span class="menu-item-name">${item.name}</span>
                            <span class="menu-item-price">${item.price}₽</span>
                        </div>
                    `;
                });
                categoryDiv.innerHTML = itemsHtml;
                container.appendChild(categoryDiv);
            }
        });
        
        if (!hasResults) {
            container.innerHTML = '<div class="no-results">Ничего не найдено. Попробуйте: "улун", "фрукт", "чай"</div>';
        }
    }
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            const composition = this.getAttribute('data-composition');
            const desc = this.getAttribute('data-desc') || '';
            if (name && price && composition) {
                openMenuDetailModal(name, price, composition, desc);
            }
        });
    });
}

function openMenuDetailModal(name, price, composition, desc) {
    const modal = document.getElementById('menuDetailModal');
    if(modal) {
        document.getElementById('modalItemName').textContent = name;
        document.getElementById('modalItemPrice').textContent = price + '₽';
        document.getElementById('modalItemComposition').textContent = composition;
        document.getElementById('modalItemDesc').textContent = desc || '';
        modal.classList.add('active');
    }
}

function closeMenuDetailModal() {
    const modal = document.getElementById('menuDetailModal');
    if(modal) modal.classList.remove('active');
}

function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    container.innerHTML = '';
    (window.reviewsData || []).forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        card.innerHTML = `<div class="review-header"><div class="review-avatar">${escapeHtml(r.avatar)}</div><div><div class="review-name">${escapeHtml(r.name)}</div><div class="review-rating">${stars}</div></div></div><div class="review-text">"${escapeHtml(r.text)}"</div><div class="review-date">${escapeHtml(r.date)}</div>`;
        container.appendChild(card);
    });
}

// ========== СЛАЙДЕР ==========
let sliderInstance = { currentIndex: 0, autoInterval: null, totalSlides: 0 };

function reinitSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('dotsContainer');
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const fullscreenClose = document.getElementById('fullscreenClose');
    const fullscreenPrev = document.getElementById('fullscreenPrev');
    const fullscreenNext = document.getElementById('fullscreenNext');
    const fullscreenCounter = document.getElementById('fullscreenCounter');
    
    sliderInstance.totalSlides = slides.length;
    sliderInstance.currentIndex = 0;
    
    if (sliderInstance.autoInterval) clearInterval(sliderInstance.autoInterval);
    
    function updateSlider() {
        const slider = document.getElementById('slider');
        if(slider) slider.style.transform = `translateX(-${sliderInstance.currentIndex * 100}%)`;
        if(dotsContainer) document.querySelectorAll('.dot').forEach((dot, idx) => dot.classList.toggle('active', idx === sliderInstance.currentIndex));
    }
    
    function createDots() { 
        if(!dotsContainer) return; 
        dotsContainer.innerHTML = ''; 
        slides.forEach((_, idx) => { 
            let dot = document.createElement('span'); 
            dot.classList.add('dot'); 
            if(idx === sliderInstance.currentIndex) dot.classList.add('active'); 
            dot.addEventListener('click', (e) => { e.stopPropagation(); sliderInstance.currentIndex = idx; updateSlider(); resetAutoSlide(); }); 
            dotsContainer.appendChild(dot); 
        }); 
    }
    
    function nextSlideFunc() { sliderInstance.currentIndex = (sliderInstance.currentIndex + 1) % sliderInstance.totalSlides; updateSlider(); resetAutoSlide(); }
    function prevSlideFunc() { sliderInstance.currentIndex = (sliderInstance.currentIndex - 1 + sliderInstance.totalSlides) % sliderInstance.totalSlides; updateSlider(); resetAutoSlide(); }
    function startAutoSlide() { if(sliderInstance.autoInterval) clearInterval(sliderInstance.autoInterval); sliderInstance.autoInterval = setInterval(nextSlideFunc, 5000); }
    function resetAutoSlide() { clearInterval(sliderInstance.autoInterval); startAutoSlide(); }
    
    function getFullImg(index) { return slides[index]?.getAttribute('data-full-img') || ''; }
    
    // ФУНКЦИИ ПОЛНОЭКРАННОГО РЕЖИМА (ИСПРАВЛЕНЫ)
    function openFullscreen(index) {
        const imgSrc = getFullImg(index);
        if (!imgSrc || !fullscreenOverlay) return;
        fullscreenImage.src = imgSrc;
        fullscreenCounter.textContent = `${index + 1} / ${sliderInstance.totalSlides}`;
        fullscreenOverlay.classList.add('active');
        fullscreenOverlay.setAttribute('data-current-fs-index', index);
        document.body.style.overflow = 'hidden';
        // Всегда показываем навигацию
        if(fullscreenPrev) fullscreenPrev.style.display = 'flex';
        if(fullscreenNext) fullscreenNext.style.display = 'flex';
    }
    
    function closeFullscreen() { 
        if(fullscreenOverlay) { 
            fullscreenOverlay.classList.remove('active'); 
            document.body.style.overflow = ''; 
        } 
    }
    
    function navigateFullscreen(direction) {
        let currentFsIndex = parseInt(fullscreenOverlay.getAttribute('data-current-fs-index') || '0');
        if (direction === 'next') currentFsIndex = (currentFsIndex + 1) % sliderInstance.totalSlides;
        else currentFsIndex = (currentFsIndex - 1 + sliderInstance.totalSlides) % sliderInstance.totalSlides;
        fullscreenOverlay.setAttribute('data-current-fs-index', currentFsIndex);
        fullscreenImage.src = getFullImg(currentFsIndex);
        fullscreenCounter.textContent = `${currentFsIndex + 1} / ${sliderInstance.totalSlides}`;
    }
    
    slides.forEach((slide, index) => {
        // Убираем старые обработчики, чтобы не дублировать
        slide.removeEventListener('click', slide._clickHandler);
        slide._clickHandler = (e) => { 
            if (!e.target.closest('.slider-btn') && !e.target.closest('.dot')) {
                openFullscreen(index); 
            } 
        };
        slide.addEventListener('click', slide._clickHandler);
    });
    
    // Полноэкранные кнопки
    if(fullscreenClose) {
        fullscreenClose.removeEventListener('click', closeFullscreen);
        fullscreenClose.addEventListener('click', closeFullscreen);
    }
    if(fullscreenOverlay) {
        fullscreenOverlay.removeEventListener('click', fullscreenOverlay._bgClick);
        fullscreenOverlay._bgClick = (e) => { if (e.target === fullscreenOverlay) closeFullscreen(); };
        fullscreenOverlay.addEventListener('click', fullscreenOverlay._bgClick);
    }
    if(fullscreenPrev) {
        fullscreenPrev.removeEventListener('click', fullscreenPrev._click);
        fullscreenPrev._click = (e) => { e.stopPropagation(); navigateFullscreen('prev'); };
        fullscreenPrev.addEventListener('click', fullscreenPrev._click);
    }
    if(fullscreenNext) {
        fullscreenNext.removeEventListener('click', fullscreenNext._click);
        fullscreenNext._click = (e) => { e.stopPropagation(); navigateFullscreen('next'); };
        fullscreenNext.addEventListener('click', fullscreenNext._click);
    }
    
    document.removeEventListener('keydown', document._fullscreenKeydown);
    document._fullscreenKeydown = (e) => {
        if (!fullscreenOverlay?.classList.contains('active')) return;
        if (e.key === 'Escape') closeFullscreen();
        else if (e.key === 'ArrowLeft') navigateFullscreen('prev');
        else if (e.key === 'ArrowRight') navigateFullscreen('next');
    };
    document.addEventListener('keydown', document._fullscreenKeydown);
    
    if(prevBtn) {
        prevBtn.removeEventListener('click', prevBtn._click);
        prevBtn._click = prevSlideFunc;
        prevBtn.addEventListener('click', prevBtn._click);
    }
    if(nextBtn) {
        nextBtn.removeEventListener('click', nextBtn._click);
        nextBtn._click = nextSlideFunc;
        nextBtn.addEventListener('click', nextBtn._click);
    }
    
    createDots();
    updateSlider();
    startAutoSlide();
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function initAllScripts() {
    loadSettings();
    renderMenu();
    renderReviews();
    initAdminMode();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', function(e) { renderMenu(e.target.value); });
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateInput = document.getElementById('bookDate');
    if (dateInput) { dateInput.value = `${yyyy}-${mm}-${dd}`; dateInput.min = `${yyyy}-${mm}-${dd}`; }
    
    const menuDetailClose = document.getElementById('menuDetailClose');
    if (menuDetailClose) menuDetailClose.addEventListener('click', closeMenuDetailModal);
    const menuDetailModal = document.getElementById('menuDetailModal');
    if (menuDetailModal) menuDetailModal.addEventListener('click', function(e) { if (e.target === menuDetailModal) closeMenuDetailModal(); });
    
    reinitSlider();
    
    // Карта
    const mapWrapper = document.getElementById('mapWrapper');
    if (mapWrapper) {
        mapWrapper.addEventListener('click', () => { window.open('https://yandex.ru/maps/10996/kropotkin/?tab=reviews&oid=126677960348', '_blank'); });
        mapWrapper.style.cursor = 'pointer';
    }
    
    // Фото в контактах (ИСПРАВЛЕНО)
    const directionPhoto = document.getElementById('directionPhoto');
    if (directionPhoto) {
        directionPhoto.removeEventListener('click', directionPhoto._clickHandler);
        directionPhoto._clickHandler = function() {
            const fsOverlay = document.getElementById('fullscreenOverlay');
            const fsImage = document.getElementById('fullscreenImage');
            const fsCounter = document.getElementById('fullscreenCounter');
            const fsClose = document.getElementById('fullscreenClose');
            const fsPrev = document.getElementById('fullscreenPrev');
            const fsNext = document.getElementById('fullscreenNext');
            
            if(fsOverlay && fsImage) {
                fsImage.src = this.src;
                if(fsCounter) fsCounter.textContent = `1 / 1`;
                fsOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Прячем навигацию для одиночного фото
                if(fsPrev) fsPrev.style.display = 'none';
                if(fsNext) fsNext.style.display = 'none';
                
                // Восстанавливаем навигацию при закрытии
                const restoreNav = () => {
                    if(fsPrev) fsPrev.style.display = 'flex';
                    if(fsNext) fsNext.style.display = 'flex';
                    fsOverlay.removeEventListener('click', restoreNav);
                };
                fsOverlay.addEventListener('click', restoreNav);
                
                // Также восстанавливаем при клике на крестик
                if(fsClose) {
                    fsClose.removeEventListener('click', fsClose._restoreNav);
                    fsClose._restoreNav = () => {
                        setTimeout(() => {
                            if(fsPrev) fsPrev.style.display = 'flex';
                            if(fsNext) fsNext.style.display = 'flex';
                        }, 100);
                    };
                    fsClose.addEventListener('click', fsClose._restoreNav);
                }
            }
        };
        directionPhoto.addEventListener('click', directionPhoto._clickHandler);
    }
    
    // Переключение страниц
    const pages = { main: document.getElementById('main-page'), menu: document.getElementById('menu-page'), booking: document.getElementById('booking-page'), reviews: document.getElementById('reviews-page'), contacts: document.getElementById('contacts-page') };
    function showPage(pageId) { 
        Object.values(pages).forEach(p => p?.classList.remove('active-page')); 
        if(pages[pageId]) pages[pageId].classList.add('active-page'); 
        document.querySelectorAll('.nav-link').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-page') === pageId)); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }
    document.querySelectorAll('.nav-link').forEach(btn => btn.addEventListener('click', () => { const p = btn.getAttribute('data-page'); if(p && pages[p]) showPage(p); }));
    document.querySelectorAll('[data-nav]').forEach(el => el.addEventListener('click', (e) => { const t = el.getAttribute('data-nav'); if(t && pages[t]) showPage(t); }));
    
    // Приватность
    const privacyModal = document.getElementById('privacyModal');
    const privacyLink = document.getElementById('privacyLink');
    const closeModal = document.getElementById('closeModal');
    if (privacyLink) privacyLink.addEventListener('click', (e) => { e.preventDefault(); if(privacyModal) privacyModal.style.display = 'flex'; });
    if (closeModal) closeModal.addEventListener('click', () => { if(privacyModal) privacyModal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === privacyModal && privacyModal) privacyModal.style.display = 'none'; });
    
    // Капча
    let currentCaptchaResult = 0;
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        currentCaptchaResult = num1 + num2;
        const captchaQuestionSpan = document.getElementById('captchaQuestion');
        if(captchaQuestionSpan) captchaQuestionSpan.innerText = `${num1} + ${num2} = ?`;
    }
    function checkCaptcha() {
        const userAnswer = parseInt(document.getElementById('captchaInput')?.value);
        return !isNaN(userAnswer) && userAnswer === currentCaptchaResult;
    }
    const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
    if (refreshCaptchaBtn) refreshCaptchaBtn.addEventListener('click', generateCaptcha);
    generateCaptcha();
    
    let lastSubmitTime = 0;
    const SUBMIT_DELAY = 30000;
    function isMaliciousInput(str) { if (!str) return false; return /[<>'"]/g.test(str); }
    function isTimeValid(timeStr, dateStr) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(timeStr)) return false;
        const hours = parseInt(timeStr.split(':')[0]);
        if (hours < 17) return false;
        const now = new Date();
        const mskTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
        const selectedDate = new Date(dateStr);
        const today = new Date(mskTime.getFullYear(), mskTime.getMonth(), mskTime.getDate());
        const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        if (selectedDay.getTime() === today.getTime()) {
            const currentTotalMinutes = mskTime.getHours() * 60 + mskTime.getMinutes();
            const selectedTotalMinutes = hours * 60 + parseInt(timeStr.split(':')[1]);
            if (selectedTotalMinutes < currentTotalMinutes) return false;
        }
        return true;
    }
    
    const sendBtn = document.getElementById('sendToTelegramBtn');
    const timeInput = document.getElementById('bookTime');
    const guestsInput = document.getElementById('bookGuests');
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const messageDiv = document.getElementById('bookingMessage');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', async function(e) {
            if(sendBtn.disabled) return;
            let date = document.getElementById('bookDate')?.value.trim();
            let time = timeInput?.value.trim();
            let guests = guestsInput?.value.trim();
            const agree = agreeCheckbox?.checked;
            if (isMaliciousInput(date) || isMaliciousInput(time) || isMaliciousInput(guests)) { if(messageDiv) messageDiv.innerHTML = 'Обнаружены недопустимые символы'; return; }
            if (!date) { if(messageDiv) messageDiv.innerHTML = 'Пожалуйста, выберите дату'; return; }
            if (!time) { if(messageDiv) messageDiv.innerHTML = 'Пожалуйста, укажите желаемое время'; return; }
            if (!isTimeValid(time, date)) { if(messageDiv) messageDiv.innerHTML = 'Нельзя забронировать стол на прошедшее время'; return; }
            if (!guests) { if(messageDiv) messageDiv.innerHTML = 'Пожалуйста, укажите количество гостей'; return; }
            const guestsNum = parseInt(guests);
            if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 20) { if(messageDiv) messageDiv.innerHTML = 'Количество гостей должно быть от 1 до 20'; return; }
            if (!agree) { if(messageDiv) messageDiv.innerHTML = 'Подтвердите согласие на обработку данных'; return; }
            if (!checkCaptcha()) { 
                if(messageDiv) messageDiv.innerHTML = 'Неправильный ответ на капчу'; 
                generateCaptcha(); 
                document.getElementById('captchaInput').value = ''; 
                return; 
            }
            const now = Date.now();
            if (now - lastSubmitTime < SUBMIT_DELAY) { const waitSeconds = Math.ceil((SUBMIT_DELAY - (now - lastSubmitTime)) / 1000); if(messageDiv) messageDiv.innerHTML = `Подождите ${waitSeconds} секунд`; return; }
            sendBtn.disabled = true;
            const originalText = sendBtn.innerHTML;
            sendBtn.innerHTML = '<span class="spinner"></span> Отправляю...';
            let formattedDate = date;
            if (date) { const dateObj = new Date(date); formattedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }); }
            const message = `НОВАЯ БРОНЬ В ДИП%0A%0A📅 Дата: ${formattedDate}%0A⏰ Время: ${time}%0A👥 Гостей: ${guests}%0A%0A📍 ${appSettings.contacts.address}`;
            setTimeout(() => {
                window.open(`https://t.me/${appSettings.contacts.telegram}?text=${message}`, '_blank');
                lastSubmitTime = Date.now();
                if(messageDiv) messageDiv.innerHTML = 'Открывается Telegram! Отправьте сообщение менеджеру.';
                if(timeInput) timeInput.value = '';
                if(guestsInput) guestsInput.value = '';
                if(agreeCheckbox) agreeCheckbox.checked = false;
                document.getElementById('captchaInput').value = '';
                generateCaptcha();
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalText;
            }, 300);
        });
    }
    
    function updateHttpsStatus() {
        const isHttps = window.location.protocol === 'https:';
        const noteElement = document.getElementById('securityNote');
        if (noteElement) {
            noteElement.innerHTML = `HTTPS: ${isHttps ? 'Включён (безопасно)' : 'Не включён'}`;
            noteElement.style.background = isHttps ? 'rgba(100,255,100,0.2)' : 'rgba(255,100,100,0.3)';
        }
    }
    updateHttpsStatus();
    
    // Админ панель кнопки
    document.getElementById('adminCloseBtn')?.addEventListener('click', closeAdminPanel);
    document.getElementById('saveAllPricesBtn')?.addEventListener('click', saveAllPrices);
    document.getElementById('saveTextsBtn')?.addEventListener('click', saveTexts);
    document.getElementById('saveContactsBtn')?.addEventListener('click', saveContacts);
    document.getElementById('saveSliderBtn')?.addEventListener('click', saveSlider);
    document.getElementById('addReviewBtn')?.addEventListener('click', addReview);
    document.getElementById('exportDataBtn')?.addEventListener('click', exportData);
    document.getElementById('importDataBtn')?.addEventListener('click', () => document.getElementById('importFileInput')?.click());
    document.getElementById('importFileInput')?.addEventListener('change', (e) => { if(e.target.files[0]) importData(e.target.files[0]); });
    document.getElementById('resetToDefaultBtn')?.addEventListener('click', resetToDefault);
    
    // Вкладки админки
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-admin-tab');
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            const targetContent = document.querySelector(`.admin-tab-content[data-admin-content="${targetTab}"]`);
            if(targetContent) targetContent.classList.add('active');
        });
    });
}

// ========== ВОЗРАСТНОЕ ОГРАНИЧЕНИЕ ==========
const ageModal = document.getElementById('ageModal');
const mainContainer = document.getElementById('mainContainer');
const ageYesBtn = document.getElementById('ageYesBtn');
const ageNoBtn = document.getElementById('ageNoBtn');
const dontAskAgainCheckbox = document.getElementById('dontAskAgainCheckbox');
const settingsIcon = document.getElementById('settingsIcon');

function shouldShowAgeModal() { return localStorage.getItem('ageModalDontAskAgain') !== 'true'; }
function confirmAge() {
    if (dontAskAgainCheckbox && dontAskAgainCheckbox.checked) localStorage.setItem('ageModalDontAskAgain', 'true');
    else localStorage.removeItem('ageModalDontAskAgain');
    if (ageModal) ageModal.style.display = 'none';
    if (mainContainer) mainContainer.style.display = 'block';
    if (typeof window.scriptsInitialized === 'undefined' || !window.scriptsInitialized) {
        initAllScripts();
        window.scriptsInitialized = true;
    }
}
function showAgeSettings() {
    if (ageModal) {
        ageModal.style.display = 'flex';
        const dontAsk = localStorage.getItem('ageModalDontAskAgain') === 'true';
        if (dontAskAgainCheckbox) dontAskAgainCheckbox.checked = dontAsk;
    }
}
if (ageNoBtn) ageNoBtn.addEventListener('click', () => { document.body.innerHTML = '<div style="background:#101214; color:#E5E2DC; display:flex; align-items:center; justify-content:center; height:100vh; font-family:Inter; text-align:center; padding:2rem;"><div><h1 style="font-size:2rem; margin-bottom:1rem;">Доступ запрещён</h1><p>Сайт предназначен только для посетителей старше 18 лет.</p><a href="https://yandex.ru" style="color:#A6ADB7; margin-top:1rem; display:inline-block;">Вернуться на главную</a></div></div>'; });
if (ageYesBtn) ageYesBtn.addEventListener('click', confirmAge);
if (settingsIcon) settingsIcon.addEventListener('click', showAgeSettings);

function handleInitialAgeCheck() {
    if (shouldShowAgeModal()) {
        if (mainContainer) mainContainer.style.display = 'none';
        if (ageModal) {
            ageModal.style.display = 'flex';
            const dontAsk = localStorage.getItem('ageModalDontAskAgain') === 'true';
            if (dontAskAgainCheckbox) dontAskAgainCheckbox.checked = dontAsk;
        }
    } else {
        if (ageModal) ageModal.style.display = 'none';
        if (mainContainer) mainContainer.style.display = 'block';
        if (typeof window.scriptsInitialized === 'undefined' || !window.scriptsInitialized) {
            initAllScripts();
            window.scriptsInitialized = true;
        }
    }
}
handleInitialAgeCheck();