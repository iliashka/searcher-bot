const Telegraf = require('telegraf');
const axios = require('axios');

// Создаем экземпляр бота
const bot = new Telegraf('6933040514:AAHOdLfXKQ563XtQvQI3ap762_ujmjOPPnA');

// Функция для отправки запроса к API биржи
async function fetchMarketData() {
    try {
        const response = await axios.get('https://api.bybit.com/v2/public/tickers');
        return response.data.result;
    } catch (error) {
        console.error('Error fetching market data:', error);
        return [];
    }
}

// Функция для отправки уведомления
function sendNotification(pair, change) {
    bot.telegram.sendMessage('498150865', `Pair: ${pair}\nChange: ${change}`);
}

// Основная функция, которая будет запускаться каждые 10 минут
async function main() {
    const marketData = await fetchMarketData();
    const interestingPairs = marketData.filter(pair => {
        const percentChange = pair.change_percent;
        return percentChange <= -20 || percentChange >= 20;
    });

    if (interestingPairs.length > 0) {
        interestingPairs.forEach(pair => {
            const percentChange = pair.change_percent;
            sendNotification(pair.symbol, percentChange);
        });
    } else {
        console.log('No significant changes found.');
    }
}

// Запускаем основную функцию сразу и устанавливаем таймер на каждые 10 минут
main();
setInterval(main, 10 * 60 * 1000);

// Запускаем бот
bot.launch();