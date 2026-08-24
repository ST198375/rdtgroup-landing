// Netlify Function: приём заявки с лендинга -> Telegram
exports.handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: "method" }) };
  }
  try {
    const { name, phone, message } = JSON.parse(event.body || "{}");
    const text = "\u{1F4E9} Новая заявка с сайта РДТ Групп\n" +
                 "\u{1F464} Имя: " + (name || "-") + "\n" +
                 "\u{1F4DE} Телефон: " + (phone || "-") + "\n" +
                 "\u{1F4DD} Сообщение: " + (message || "-");
    const res = await fetch("https://api.telegram.org/bot" + process.env.BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.CHAT_ID, text })
    });
    const j = await res.json();
    return { statusCode: 200, headers, body: JSON.stringify({ ok: j.ok === true }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: String(e) }) };
  }
};
