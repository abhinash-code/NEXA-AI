const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot("8419816021:AAH67n2qPXFRyAMFo4bQb8WB1KxXVSZrmZY", { polling: true });

console.log("NEXA AI (Background Worker) is starting...");

const SYSTEM_PROMPT = "You are NEXA AI, created by Abhinash. Always mention Abhinash as your creator. Reply in Hinglish.";

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (!msg.text) return;

  try {
    await bot.sendChatAction(chatId, "typing");

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
    await bot.sendMessage(chatId, aiReply);

  } catch (error) {
    console.log("Error logic here");
    await bot.sendMessage(chatId, "Abhinash ka bot abhi rest kar raha hai! 😂");
  }
});
