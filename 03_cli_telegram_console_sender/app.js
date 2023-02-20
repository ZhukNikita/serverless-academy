const TelegramBot = require('node-telegram-bot-api')
const path = require('path')
const fs = require('fs')
const { program } = require('commander');

const token = "6138987624:AAHiuJyiMRx28bZIJibCx9k8pA4ybvjgO6Y"
const bot = new TelegramBot(token, {polling: true});

const idPath = path.join('userId.txt')

let id = JSON.parse(fs.readFileSync(idPath))
const SendMessage = () =>{
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        if(msg.text === "/start"){
            fs.writeFile(idPath, `${chatId}`,
            err => {
                if (err) throw err
            })}
    });
}
program
    .command('message <message>')
    .description('Send message to Telegram Bot')
    .alias('m')
    .action((text)=>{
        bot.sendMessage(id , text)
    })
program
    .command('photo <photo>')
    .description('Send photo to Telegram Bot. Just drag and drop your photo to console after p-flag')
    .alias('p')
    .action((path)=>{
        bot.sendPhoto(id , path)
    })


program.parse(process.argv)
SendMessage()