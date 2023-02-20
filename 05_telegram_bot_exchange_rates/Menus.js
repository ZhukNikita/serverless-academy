export const MainMenu = {
    reply_markup: JSON.stringify({
        resize_keyboard: true,
        keyboard: [
            [{text: 'Weather Nice'}],
            [{text: 'Exchange Rates'}]
        ]
    })
};
export const WeatherMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'Every 3 hours'}, {text: 'Every 6 hours'}],
            [{text: 'Previous menu'}]
        ]
    }
};

export const ExchangeMenu = {
    reply_markup: {
        resize_keyboard: true,
        keyboard: [
            [{text: 'USD'}, {text: 'EUR'}],
            [{text: 'Previous menu'}]
        ]
    }
};