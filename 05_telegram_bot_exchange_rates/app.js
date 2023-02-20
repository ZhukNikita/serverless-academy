import TelegramBot from 'node-telegram-bot-api'
import axios from 'axios'
import {ExchangeMenu, MainMenu, WeatherMenu} from './Menus.js'
import NodeCache from "node-cache";

const token = "6121123315:AAGy1uFaLknCQyxlF08Bh0jplX0AMP6AdCU"
const myCache = new NodeCache({stdTTL: 100, checkperiod: 120});
const bot = new TelegramBot(token, {polling: true});
let cacheData
let forecast
let privatRates

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
const fetchPrivatExchangeData = async () => {
    try {
        const privatApi = await axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=5')
        return privatRates = privatApi.data

    } catch (e) {
        console.log(e);
    }
}
const fetchMonoExchangeData = async () => {
    try {
        const monoApi = await axios.get('https://api.monobank.ua/bank/currency')
        return cacheData = myCache.set('mono', monoApi.data.filter(el=> el.currencyCodeA === 840 || el.currencyCodeA === 978), 240)

    } catch (e) {
        return cacheData = myCache.get('mono') || console.log('Wait a minute between requests')
    }
}


function formatTemp(temperature) {
    if (Number((temperature - 273.15).toFixed(0)) > 0) return `+${(temperature - 273.15).toFixed(0)}`;
    if (Number((temperature - 273.15).toFixed(0)) < 0) return `-${(temperature - 273.15).toFixed(0)}`;
    if (Number((temperature - 273.15).toFixed(0)) === 0) return `0`;
}

function formatDate(arr) {
    let formatArr = arr.map(el => new Date(el).toLocaleString('en-US', options))
    return formatArr
}

bot.on('message', (msg) => {
    let dateArr = []
    let monoRates = myCache.get('mono')

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
            const Message3Hour = `Weather in Nice: \n${formatDate(dateArr).map((el, index) => {
                return `${index === 0 ? '' : "\n"}${el}: \n${filterMassiveByDate(index).map((el, ind) => {
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
        case 'Exchange Rates':
            fetchPrivatExchangeData()
            fetchMonoExchangeData()
            bot.sendMessage(msg.chat.id, 'Choose please currency to return ', ExchangeMenu)
            break;
        case 'USD':
            let tempUsdPrivat = privatRates.filter(el=> el.ccy ==='USD')
            bot.sendMessage(msg.chat.id, `PrivatBank USD rate :\nBuy: ${Number(tempUsdPrivat[0].buy).toFixed(2)} UAH\nSale: ${Number(tempUsdPrivat[0].sale).toFixed(2)} UAH\nMonoBank USD rate:\nBuy: ${monoRates[0].rateBuy.toFixed(2)} UAH\nSale: ${monoRates[0].rateSell.toFixed(2)} UAH`, ExchangeMenu)
            break;
        case 'EUR':
            let tempEurPrivat = privatRates.filter(el=> el.ccy ==='EUR')
            bot.sendMessage(msg.chat.id, `PrivatBank EUR rate :\nBuy: ${Number(tempEurPrivat[0].buy).toFixed(2)} UAH\nSale: ${Number(tempEurPrivat[0].sale).toFixed(2)} UAH\nMonoBank EUR rate:\nBuy: ${monoRates[1].rateBuy.toFixed(2)} UAH\nSale: ${monoRates[1].rateSell.toFixed(2)} UAH`, ExchangeMenu)
            break;
        case 'Previous menu':
            bot.sendMessage(msg.chat.id, 'Click on "Weather in Nice" or "Exchange Rates"', MainMenu)
            break;
        default:
            bot.sendMessage(msg.chat.id, "Sorry. I don't understand you.", MainMenu)

    }
});