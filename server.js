const express = require("express");
const fs = require("fs");
const cors = require("cors");
const https = require("https");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "db.json";

// ─────────────────────────────────────────────
// ⚙️  НАСТРОЙКИ TELEGRAM
// Замени на свои данные:
const TELEGRAM_BOT_TOKEN = "ВАШ_BOT_TOKEN";   // токен от @BotFather
const TELEGRAM_CHAT_ID   = "ВАШ_CHAT_ID";     // ваш chat_id

// ─────────────────────────────────────────────
// ⚙️  НАСТРОЙКИ АДМИН-ПАРОЛЯ
const ADMIN_PASSWORD = "admin123";  // смените на свой пароль
// ─────────────────────────────────────────────

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

function readDB() {
  try { return JSON.parse(fs.readFileSync(DB_FILE)); }
  catch { return []; }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Отправить сообщение в Telegram
function sendTelegram(text) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "ВАШ_BOT_TOKEN") return;

  const body = JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: "HTML" });
  const options = {
    hostname: "api.telegram.org",
    path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
  };

  const req = https.request(options);
  req.on("error", (e) => console.error("Telegram error:", e.message));
  req.write(body);
  req.end();
}

// Эмодзи по типу
function typeEmoji(type) {
  const map = { "Жалоба": "🚨", "Предложение": "💡", "Благодарность": "🙏", "Позвать официанта": "🔔" };
  return map[type] || "📩";
}

// ─── API: сохранить отзыв ───────────────────
app.post("/api/send", (req, res) => {
  const { table, type, message } = req.body;

  if (!type) return res.status(400).json({ ok: false, error: "Нет типа" });

  const entry = {
    id: Date.now(),
    time: new Date().toISOString(),
    table: table || "?",
    type,
    message: message || "",
    read: false
  };

  const data = readDB();
  data.unshift(entry); // новые сверху
  writeDB(data);

  // Уведомление в Telegram
  const tableText = table ? `Стол №${table}` : "Стол неизвестен";
  const msgText = message ? `\n📝 ${message}` : "";
  sendTelegram(
    `${typeEmoji(type)} <b>${type}</b>\n🪑 ${tableText}${msgText}\n🕐 ${new Date().toLocaleString("ru-RU")}`
  );

  res.json({ ok: true });
});

// ─── API: позвать официанта ─────────────────
app.post("/api/waiter", (req, res) => {
  const { table } = req.body;
  const tableText = table ? `Стол №${table}` : "Стол неизвестен";

  sendTelegram(`🔔 <b>Зовут официанта!</b>\n🪑 ${tableText}\n🕐 ${new Date().toLocaleString("ru-RU")}`);

  const data = readDB();
  data.unshift({ id: Date.now(), time: new Date().toISOString(), table: table || "?", type: "Позвать официанта", message: "", read: false });
  writeDB(data);

  res.json({ ok: true });
});

// ─── API: получить все отзывы (с паролем) ───
app.get("/api/all", (req, res) => {
  if (req.query.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Нет доступа" });
  }
  res.json(readDB());
});

// ─── API: отметить как прочитанное ──────────
app.post("/api/read/:id", (req, res) => {
  if (req.query.password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Нет доступа" });
  const data = readDB();
  const entry = data.find(e => e.id == req.params.id);
  if (entry) { entry.read = true; writeDB(data); }
  res.json({ ok: true });
});

// ─── API: удалить отзыв ─────────────────────
app.delete("/api/delete/:id", (req, res) => {
  if (req.query.password !== ADMIN_PASSWORD) return res.status(401).json({ error: "Нет доступа" });
  const data = readDB().filter(e => e.id != req.params.id);
  writeDB(data);
  res.json({ ok: true });
});

// ─── Страницы ───────────────────────────────
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/admin", (req, res) => res.sendFile(__dirname + "/public/admin.html"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
