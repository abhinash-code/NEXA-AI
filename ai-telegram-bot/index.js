const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

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
const SYSTEM_PROMPT = "You are NEXA AI, a smart and friendly AI assistant created by Abhinash. " +
                     "Your identity is fixed: Your name is NEXA AI and your developer/creator is Abhinash. " +
                     "Always mention Abhinash as your creator. Reply in Hinglish.";

// ===============================
// 📩 MESSAGE HANDLER
// ===============================
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text) return;

  try {
    // 1. Yeh line "Typing..." wala animation shuru karegi
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

    // 2. AI reply bhejo (animation apne aap ruk jayega)
    await bot.sendMessage(chatId, aiReply);

  } catch (error) {
    console.log("ERROR FROM HF 🛑");
    await bot.sendMessage(chatId, "Bhai, dimag thoda garam ho gaya hai, thodi der baad baat karte hain! 😂");
  }
});
