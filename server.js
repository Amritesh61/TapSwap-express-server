const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api'); // Import the Telegram Bot API library
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let points = 0;
let energy = 5500;
let boosters = {
  multitap: { level: 11, cost: 200000 },
  energyLimit: { level: 11, cost: 200000 },
  rechargingSpeed: { level: 5, cost: 200000 },
  tapBot: { level: 0, cost: 200000 },
};

// Initialize Telegram Bot with your API token
const bot = new TelegramBot('7256987205:AAFT1n8pvqI3Qu7SMmgvVdUELcepYrYA87U', { polling: true });

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to TapSwap! Use /tap to earn points.');
});

// Handle /tap command
bot.onText(/\/tap/, (msg) => {
  const chatId = msg.chat.id;
  if (energy > 0) {
    points += 1;
    energy -= 1;
  }
  bot.sendMessage(chatId, `You tapped! Points: ${points}, Energy: ${energy}`);
});

// Handle other commands or messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Unknown command. Use /tap to earn points.');
});

// REST API endpoints
app.get('/api/status', (req, res) => {
  res.json({ points, energy });
});

app.post('/api/tap', (req, res) => {
  if (energy > 0) {
    points += 1;
    energy -= 1;
  }
  res.json({ points, energy });
});

app.get('/api/boosters', (req, res) => {
  res.json(boosters);
});

app.post('/api/boosters/upgrade', (req, res) => {
  const { booster } = req.body;
  if (boosters[booster] && points >= boosters[booster].cost) {
    points -= boosters[booster].cost;
    boosters[booster].level += 1;
  }
  res.json(boosters);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
