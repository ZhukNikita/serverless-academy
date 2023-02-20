import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'

const dbPath = path.join('db.txt')
const addToDb = () => {
    inquirer.prompt([
        {
            name: "name",
            message: "Enter the user's name. To cancel press ENTER.",
            type: "input",
        },])
        .then(function (firstName) {
            if (!firstName.name) {
                let arrFromDb
                inquirer.prompt([
                    {
                        name: "isSearch",
                        message: "Would you to search values in DB?",
                        type: "confirm",
                    },])
                    .then((confirm) => {
                        if (confirm.isSearch) {
                            (fs.readFile(dbPath, 'utf-8', (err, content) => {
                                arrFromDb = content.split(' ').filter((el, index) => index !== 0).map(el => JSON.parse(el))
                                if (err) throw err
                                console.log(arrFromDb)
                            }))
                            setTimeout(() => {
                                if (arrFromDb.length === 0) {
                                    console.log('DB is empty.')
                                    return
                                } else {
                                    inquirer.prompt([
                                        {
                                            name: "searchName",
                                            message: "Enter user's name you want find in DB:",
                                            type: "input",
                                        },])
                                        .then((search) => {
                                            let searchArr = arrFromDb.filter(el => el.name.toLowerCase() === search.searchName.toLowerCase().trim())
                                            if (searchArr.length === 0) console.log('This user does not exist.')
                                            else {
                                                console.log(`User ${search.searchName.trim()} was found. \n`, searchArr)
                                            }
                                        })
                                }
                            }, 100)

                        } else console.log('Exit...')
                    })
            } else {
                let name = firstName.name.trim()
                let firstLetterToUpperCase = name[0].toUpperCase()
                let TrueFormatWord = firstLetterToUpperCase + name.slice(1).toLowerCase()
                inquirer.prompt([{
                    name: "gender",
                    message: "Choose your Gender:",
                    type: "list",
                    choices: ["male", "female"]
                },
                    {
                        name: "age",
                        message: "Enter you age:",
                        type: "number",
                    },
                ])
                    .then((allAnswer) => {
                        let {age, gender} = allAnswer
                        let entity =
                            {
                                name: TrueFormatWord,
                                gender: gender,
                                age: isNaN(age) ? undefined : age
                            }
                        fs.appendFile(dbPath, `\n ${JSON.stringify(entity)}`,
                            err => {
                                if (err) throw err
                            })
                        addToDb();
                    })
            }
        })
}
addToDb();

