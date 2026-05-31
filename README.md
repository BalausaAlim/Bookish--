# 🍽 Restaurant Feedback App

Система обратной связи для ресторана с QR-кодами, Telegram-уведомлениями и админ-панелью.

---

## ✏️ ЧТО НУЖНО ПОМЕНЯТЬ

### 1. Название ресторана
В двух файлах найди `НАЗВАНИЕ` и замени:
- `public/index.html` — строка с `logo-name`
- `public/admin.html` — строка с `name`

### 2. Фото ресторана
В `public/index.html` найди:
```css
background-image: url('https://images.unsplash.com/...');
```
Замени на своё фото:
1. Положи фото в папку `public/` (например `restaurant.jpg`)
2. Замени на: `background-image: url('restaurant.jpg');`

### 3. Логотип
В `public/index.html` найди `.logo-icon` и замени эмодзи 🍽 на:
```html
<img src="logo.png" style="width:36px;height:36px;border-radius:50%">
```
(положи `logo.png` в папку `public/`)

### 4. Telegram-бот
В `server.js` замени:
```js
const TELEGRAM_BOT_TOKEN = "ВАШ_BOT_TOKEN";
const TELEGRAM_CHAT_ID   = "ВАШ_CHAT_ID";
```

**Как получить токен:**
1. Напиши @BotFather в Telegram
2. /newbot → дай имя → получи токен

**Как получить chat_id:**
1. Напиши своему боту /start
2. Открой: https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
3. Найди `"id"` в разделе `"chat"`

### 5. Пароль от админки
В `server.js` замени:
```js
const ADMIN_PASSWORD = "admin123";
```

---

## 🚀 КАК ЗАПУСТИТЬ НА RENDER

1. Загрузи всю папку на GitHub
2. Зайди на render.com → New + → Web Service
3. Подключи репозиторий
4. Настройки:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Нажми Deploy

Получишь ссылку типа: `https://your-app.onrender.com`

---

## 📱 QR-КОДЫ ДЛЯ СТОЛОВ

Создай ссылки для каждого стола:
```
https://your-app.onrender.com/?table=1
https://your-app.onrender.com/?table=2
...
https://your-app.onrender.com/?table=14
```

Сгенерируй QR-коды бесплатно на: https://qr-code-generator.com

---

## 🔐 АДМИН-ПАНЕЛЬ

Открой: `https://your-app.onrender.com/admin`

Функции:
- 📊 Статистика: всего / непрочитанные / жалобы / благодарности
- 🔍 Фильтры по типу
- ✓ Отметить как прочитанное
- 🗑 Удалить запись
- 🔄 Автообновление каждые 30 сек

---

## 📁 СТРУКТУРА ФАЙЛОВ

```
feedback-app/
├── server.js          ← сервер (настрой токен и пароль)
├── package.json
├── db.json            ← база данных (создаётся автоматически)
└── public/
    ├── index.html     ← страница для гостей (замени фото и название)
    └── admin.html     ← админ-панель
```
