const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

// ===============================
// 🔐 TOKENS
// ===============================

const bot = new TelegramBot("8419816021:AAH67n2qPXFRyAMFo4bQb8WB1KxXVSZrmZY", { polling: true });

// ===============================
// 🚀 BOT START
// ===============================

console.log("Bot started...");

// ===============================
// 💬 MESSAGE HANDLER
// ===============================

bot.on("message", async (msg) => {

  const chatId = msg.chat.id;

  if (!msg.text) return;

  try {

    // Waiting message bhejo aur uska id store karo
    const waitingMsg = await bot.sendMessage(chatId, "Think...");

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "user", content: msg.text }
        ]
      },
      {
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // Waiting message delete karo
    await bot.deleteMessage(chatId, waitingMsg.message_id);

    // AI reply bhejo
    await bot.sendMessage(chatId, aiReply);

  } catch (error) {

    console.log("ERROR FROM HF 👇");
    console.log(error.response?.status);
    console.log(error.response?.data);

    await bot.sendMessage(chatId, "AI abhi busy hai 😅");
  }

});

