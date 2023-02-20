export const MainMenu = {
    reply_markup: JSON.stringify({
        resize_keyboard: true,
        keyboard: [
            [{text: 'Weather Nice'}]
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