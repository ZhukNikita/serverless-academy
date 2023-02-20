import TelegramBot from 'node-telegram-bot-api'
import axios from 'axios'
import {MainMenu, WeatherMenu} from './Menus.js'

const token = "6121123315:AAGy1uFaLknCQyxlF08Bh0jplX0AMP6AdCU"
const bot = new TelegramBot(token, {polling: true});
let forecast

const options = {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
};


const fetchForecastData = async () => {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=43.675819&lon=7.289429&appid=22b1feac19e93a3e4864c48f21a08e49')
        return forecast = response.data
    } catch (e) {
        console.log(e);
    }
}

function formatTemp(temperature){
    if(Number((temperature - 273.15).toFixed(0)) > 0) return `+${(temperature - 273.15).toFixed(0)}`;
    if(Number((temperature - 273.15).toFixed(0)) < 0) return `-${(temperature - 273.15).toFixed(0)}`;
    if(Number((temperature - 273.15).toFixed(0)) === 0) return `0`;
}

function formatDate(arr) {
    let formatArr = arr.map(el => new Date(el).toLocaleString('en-US', options))
    return formatArr
}

bot.on('message', (msg) => {
    let dateArr = []
    const filterMassiveByDate = (index) =>{
        return forecast?.list.filter(elem => elem.dt_txt.slice(0, 10) === dateArr[index])
    }
    switch (msg.text) {
        case '/start':
            bot.sendMessage(msg.chat.id, 'Hello', MainMenu);
            break;
        case 'Weather Nice':
            fetchForecastData()
            bot.sendMessage(msg.chat.id, 'Choose please intervals to return a forecast', WeatherMenu)
            break;

        //forecast cases

        case 'Every 3 hours':
            for (let str of forecast.list) {
                if (!dateArr.includes(str.dt_txt.slice(0, 10))) {
                    dateArr.push(str.dt_txt.slice(0, 10));
                }
            }
            const Message3Hour = `Weather in Nice: \n\n${formatDate(dateArr).map((el, index) => {
                return `${index === 0 ? '' : "\n\n"}${el}: \n${filterMassiveByDate(index).map((el, ind) => {
                    return `${ind === 0 ? '' : '\n'}${el.dt_txt.slice(11, 16)}, ${formatTemp(el.main.temp)} \u00B0C, feels like: ${formatTemp(el.main.feels_like)}\u00B0C, ${el.weather[0].description}`
                })}`
            })}`
            bot.sendMessage(msg.chat.id, Message3Hour)
            break;
        case 'Every 6 hours':
            for (let str of forecast.list) {
                if (!dateArr.includes(str.dt_txt.slice(0, 10))) {
                    dateArr.push(str.dt_txt.slice(0, 10));
                }
            }
            const Message6Hour = `Weather in Nice: \n${formatDate(dateArr).map((el, index) => { return `${index === 0 ? '' : "\n"}${el}: \n${filterMassiveByDate(index).filter((elem)=>Number(elem.dt_txt.slice(11,13) % 6 === 0)).map((el,ind) => {return `${ind === 0 ? '':'\n'}${el.dt_txt.slice(11,16)}, ${formatTemp(el.main.temp)} \u00B0C, feels like: ${formatTemp(el.main.feels_like)}\u00B0C, ${el.weather[0].description}`})}`})}`
            bot.sendMessage(msg.chat.id, Message6Hour)
            break;
        case 'Previous menu':
            bot.sendMessage(msg.chat.id, 'Click on "Weather in Nice" or "Exchange Rates"', MainMenu)
            break;
        default:
            bot.sendMessage(msg.chat.id, "Sorry. I don't understand you.", MainMenu)

    }
});