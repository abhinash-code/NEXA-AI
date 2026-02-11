const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const http = require("http");

// ===============================
// 🌐 DUMMY SERVER FOR RENDER (Port Fix)
// ===============================
// Isse Render ko lagega ki bot ek website hai aur wo use band nahi karega
http.createServer((req, res) => {
  res.write("NEXA AI is running 24/7");
  res.end();
}).listen(process.env.PORT || 3000);

// ===============================
// 🚀 TOKENS
// ===============================
const bot = new TelegramBot("8419816021:AAH67n2qPXFRyAMFo4bQb8WB1KxXVSZrmZY", { polling: true });

// ===============================
// 🤖 BOT START
// ===============================
console.log("NEXA AI is waking up...");

// ===============================
// 🧠 SYSTEM PROMPT
// ===============================
const SYSTEM_PROMPT = "You are NEXA AI, a smart assistant created by Abhinash. " +
                     "Always mention Abhinash as your creator. Reply in Hinglish.";

// ===============================
// 📩 MESSAGE HANDLER
// ===============================
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text) return;

  try {
    // Typing animation shuru
    await bot.sendChatAction(chatId, "typing");

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: msg.text }
        ],
        max_tokens: 500
      },
      {
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;
    await bot.sendMessage(chatId, aiReply);

  } catch (error) {
    console.log("ERROR FROM HF 🛑");
    await bot.sendMessage(chatId, "Bhai, dimag garam ho gaya hai, thodi der baad aana! 😂");
  }
});
