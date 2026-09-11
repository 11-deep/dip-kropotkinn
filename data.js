// ДАННЫЕ МЕНЮ (только чаи, все цены 400₽)
const menuData = [

        {
        title: "ДЫМНЫЕ МИКСЫ",
        img: "https://i.pinimg.com/736x/0a/e4/59/0ae45984abdb3fdb47b9494d2940697d.jpg",
        items: [
            { 
                name: "Лёгкий пар", 
                price: 1300, 
                composition: "Мягкая, воздушная подача.", 
                desc: "Идеальный выбор для тех, кто ценит лёгкость и комфорт. Нежный, бархатный пар без перегруза." 
            },
            { 
                name: "Пар покрепче", 
                price: 1600, 
                composition: "Насыщенная, плотная подача.", 
                desc: "Для настоящих ценителей: густой, мощный пар с яркой отдачей и глубоким вкусом." 
            }
        ]
    },
    
    // ==========================================
    // ЛИМОНАДЫ (БЕЗ ОПИСАНИЙ)
    // ==========================================
    {
        title: " ЛИМОНАДЫ",
        img: "images/lemonades/mojito.png",
        items: [
            { name: "Мохито", price: 300, img: "images/lemonades/mojito.png", composition: "Мята, лайм, содовая.", desc: "" },
            { name: "Клубничный мохито", price: 300, img: "images/lemonades/strawberry-mojito.png", composition: "Клубника, мята, лайм.", desc: "" },
            { name: "Цитрус", price: 300, img: "images/lemonades/citrus.png", composition: "Апельсин, лимон, грейпфрут.", desc: "" },
            { name: "Тропик", price: 300, img: "images/lemonades/tropic.png", composition: "Ананас, манго, маракуйя.", desc: "" },
            { name: "Ежевика-фиалка", price: 300, img: "images/lemonades/blackberry-violet.png", composition: "Ежевика, фиалка, содовая.", desc: "" },
            { name: "Черника-лаванда", price: 300, img: "images/lemonades/blueberry-lavender.png", composition: "Черника, лаванда, содовая.", desc: "" },
            { name: "Бабл-гам", price: 300, img: "images/lemonades/bubble-gum.png", composition: "Жвачка, фрукты, содовая.", desc: "" },
            { name: "Персик-роза", price: 300, img: "images/lemonades/peach-rose.png", composition: "Персик, роза, содовая.", desc: "" },
            { name: "Яблоко-киви", price: 300, img: "images/lemonades/apple-kiwi.png", composition: "Яблоко, киви, содовая.", desc: "" },
            { name: "Вишня-смородина", price: 300, img: "images/lemonades/cherry-currant.png", composition: "Вишня, смородина, содовая.", desc: "" }
        ]
    },
    {
        title: "ЧЁРНЫЕ ЧАИ",
        img: "images/tea/english-breakfast.jpg",
        items: [
            { name: "Английский завтрак", price: 600, img: "images/tea/english-breakfast.jpg", composition: "Классический чёрный чай.", desc: "Насыщенный купаж классического чёрного чая с плотным и глубоким вкусом." },
            { name: "Эрл Грей Голубой цветок", price: 600, img: "images/tea/earl-grey-blue-flower.jpg", composition: "Чёрный чай с бергамотом и васильком.", desc: "Благородный чёрный чай с бергамотом и лёгкими цветочными нотами василька." },
            { name: "Чабрец", price: 600, img: "images/tea/thyme.jpg", composition: "Индийский чёрный чай с чабрецом.", desc: "Терпкий индийский чёрный чай с пряным ароматом дикого чабреца." }
        ]
    },
    {
        title: "ЗЕЛЁНЫЕ ЧАИ",
        img: "images/tea/sencha.jpg",
        items: [
            { name: "Сенча", price: 600, img: "images/tea/sencha.jpg", composition: "Японский зелёный чай.", desc: "Классический зелёный чай с мягким травянистым вкусом и свежим послевкусием." },
            { name: "С жасмином", price: 600, img: "images/tea/jasmine.jpg", composition: "Зелёный чай с цветами жасмина.", desc: "Зелёный чай с натуральными цветами жасмина и тонким цветочным ароматом." },
            { name: "С мятой", price: 600, img: "images/tea/mint.jpg", composition: "Зелёный чай с мятой.", desc: "Освежающий зелёный чай с прохладными мятными нотами." }
        ]
    },
    {
        title: "ТРАВЯНЫЕ ЧАИ",
        img: "images/tea/taiga-herbal.jpg",
        items: [
            { name: "Таёжный травник", price: 600, img: "images/tea/taiga-herbal.jpg", composition: "Можжевельник, лесные ягоды, травы.", desc: "Насыщенный чай с можжевельником, лесными ягодами и лёгкими хвойными нотами." },
            { name: "Монастырский сбор", price: 600, img: "images/tea/monastery-herbal.jpg", composition: "Травяной сбор с мёдом.", desc: "Мягкий травяной напиток с медовым ароматом и согревающим послевкусием." },
            { name: "Облепиховый", price: 600, img: "images/tea/sea-buckthorn.jpg", composition: "Облепиха, цитрус, мёд.", desc: "Яркий облепиховый чай с цитрусовой кислинкой и лёгкой сладостью." }
        ]
    },
    {
        title: "КИТАЙСКИЕ ЧАИ",
        img: "images/tea/milk-oolong.jpg",
        items: [
            { name: "Молочный улун", price: 600, img: "images/tea/milk-oolong.jpg", composition: "Китайский улун.", desc: "Мягкий китайский улун со сливочным вкусом и цветочным ароматом." },
            { name: "Улун с персиком", price: 600, img: "images/tea/oolong-peach.jpg", composition: "Улун с персиком.", desc: "Нежный улун с сочным персиком и фруктовым послевкусием." },
            { name: "Улун с фейхоа", price: 600, img: "images/tea/oolong-feijoa.jpg", composition: "Улун с фейхоа.", desc: "Свежий улун с экзотическими нотами фейхоа и лёгкой кислинкой." },
            { name: "Пуэр", price: 600, img: "images/tea/puer.jpg", composition: "Выдержанный китайский чай.", desc: "Выдержанный китайский чай с глубоким древесным вкусом и землистыми нотами." },
            { name: "Да Хун Пао", price: 600, img: "images/tea/da-hong-pao.jpg", composition: "Утёсный улун.", desc: "Легендарный утёсный улун с насыщенным вкусом и дымно-шоколадными оттенками." },
            { name: "Тигуаньинь", price: 600, img: "images/tea/tieguanyin.jpg", composition: "Улун.", desc: "Утончённый улун с цветочным ароматом и мягким сладковатым вкусом." }
        ]
    },
    {
        title: "ФРУКТОВЫЕ ЧАИ",
        img: "images/tea/nagly-fruit.jpg",
        items: [
            { name: "Наглый фрукт", price: 600, img: "images/tea/nagly-fruit.jpg", composition: "Фруктовый микс.", desc: "Яркий фруктовый микс с насыщенным ягодным ароматом и лёгкой кислинкой." },
            { name: "Цитрусовый", price: 600, img: "images/tea/citrus.jpg", composition: "Апельсин, лимон.", desc: "Бодрящий чай с апельсином, лимоном и свежими цитрусовыми нотами." },
            { name: "Тропический", price: 600, img: "images/tea/tropical.jpg", composition: "Ананас, тропические фрукты.", desc: "Сочный фруктовый чай с ананасом и сладкими тропическими акцентами." }
        ]
    },
    {
        title: "АВТОРСКИЕ ЧАИ",
        img: "images/tea/earl-grey-orange-ginger.jpg",
        items: [
            { name: "Эрл Грей с апельсином и имбирем", price: 600, img: "images/tea/earl-grey-orange-ginger.jpg", composition: "Бергамот, апельсин, имбирь.", desc: "Классический бергамот, дополненный цитрусом и лёгкой имбирной остротой." },
            { name: "Глинтвейн", price: 600, img: "images/tea/glintwein.jpg", composition: "Ягоды, цитрус, специи.", desc: "Пряный чай с ягодами, цитрусом и согревающими специями." },
            { name: "Ягодное ассорти", price: 600, img: "images/tea/berry-assorti.jpg", composition: "Смесь ягод.", desc: "Насыщенный ягодный чай с ярким сладко-кислым вкусом." }
        ]
    }
];

// ДАННЫЕ ЧАЕВ ДЛЯ БРОНИРОВАНИЯ (все чаи, цена 400₽)
const teasData = [
    { name: "Английский завтрак", category: "ЧЁРНЫЕ ЧАИ", price: 600 },
    { name: "Эрл Грей Голубой цветок", category: "ЧЁРНЫЕ ЧАИ", price: 600 },
    { name: "Чабрец", category: "ЧЁРНЫЕ ЧАИ", price: 600 },
    { name: "Сенча", category: "ЗЕЛЁНЫЕ ЧАИ", price: 600 },
    { name: "С жасмином", category: "ЗЕЛЁНЫЕ ЧАИ", price: 600 },
    { name: "С мятой", category: "ЗЕЛЁНЫЕ ЧАИ", price: 600 },
    { name: "Таёжный травник", category: "ТРАВЯНЫЕ ЧАИ", price: 600 },
    { name: "Монастырский сбор", category: "ТРАВЯНЫЕ ЧАИ", price: 600 },
    { name: "Облепиховый", category: "ТРАВЯНЫЕ ЧАИ", price: 600 },
    { name: "Молочный улун", category: "КИТАЙСКИЕ ЧАИ", price: 600 },
    { name: "Улун с персиком", category: "КИТАЙСКИЕ ЧАИ", price: 600 },
    { name: "Улун с фейхоа", category: "КИТАЙСКИЕ ЧАИ", price: 600 },
    { name: "Пуэр", category: "КИТАЙСКИЕ ЧАИ", price: 600 },
    { name: "Да Хун Пао", category: "КИТАЙСКИЕ ЧАИ", price: 600 },
    { name: "Тигуаньинь", category: "КИТАЙСКИЕ ЧАИ", price: 600 },
    { name: "Наглый фрукт", category: "ФРУКТОВЫЕ ЧАИ", price: 600 },
    { name: "Цитрусовый", category: "ФРУКТОВЫЕ ЧАИ", price: 600 },
    { name: "Тропический", category: "ФРУКТОВЫЕ ЧАИ", price: 600 },
    { name: "Эрл Грей с апельсином и имбирем", category: "АВТОРСКИЕ ЧАИ", price: 600 },
    { name: "Глинтвейн", category: "АВТОРСКИЕ ЧАИ", price: 600 },
    { name: "Ягодное ассорти", category: "АВТОРСКИЕ ЧАИ", price: 600 }
];

// ДАННЫЕ ОТЗЫВОВ
const reviewsData = [
    { name: "Влад Яковлев", rating: 5, text: "Лучшие чаи в городе! Отличная атмосфера!", date: "25.10.2025", avatar: "В" },
    { name: "Вера Золотарева", rating: 5, text: "Чайная нравится, приятная музыка и атмосфера, обслуживание приятное. С удовольствием ходим.", date: "03.08.2024", avatar: "В" },
    { name: "Виктория Ярославцева", rating: 5, text: "Одно из самых приятных заведений в городе. Спокойная, комфортная атмосфера, доброжелательный персонал. Всегда рекомендую!", date: "11.01.2025", avatar: "В" },
    { name: "Гость", rating: 5, text: "Отличное место, душевное и атмосферное, играет вкусная музыка, хорошие цены и адекватный администратор Даяна 🫶", date: "27.12.2025", avatar: "★" },
    { name: "Doroh", rating: 5, text: "Работает прекрасная, красивая девушка Даяна, заведение очень уютно украшено к Новому году. Долго ждать не приходится, всё отдаётся быстро и качественно.", date: "30.12.2024", avatar: "D" },
    { name: "Алексей Рухляда", rating: 5, text: "Даяна — лучший чайный мастер. Делает каждый чай с душой. Уютное, спокойное заведение, советую к посещению.", date: "08.11.2025", avatar: "А" }
];
