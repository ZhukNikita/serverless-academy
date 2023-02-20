const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
function WriteWords(){
readline.question('Hello. Enter 10 words or digits deviding them in spaces:', (wordsOrDigits)=>{
    let arr = wordsOrDigits.split(' ')
    let validationArr = arr.filter(el=> el !== '')
    if (validationArr.length > 10) {
        console.log( 'There are more then 10 words' );
        WriteWords()
    } else if (validationArr.length < 10 ) {
        console.log( 'There are less then 10 words' );
        WriteWords()
    } else {
        console.log('a. Sort words alphabetically - write "a"' +
                    '\nb. Show numbers from lesser to greater - write "b"' +
                    '\nc. Show numbers from bigger to smaller - write "c"' +
                    '\nd. Display words in ascending order by number of letters in the word - write "d"' +
                    '\ne. Show only unique words - write "e"' +
                    '\nf. Display only unique values from the set of words and numbers entered by the user - write "f"' +
                    '\ng. Write "exit" or "g" to exit the program.')
        function Command() {
            readline.question('What operation to do with words and numbers?', command => {
                let numbers = [];
                let strings = [];
                validationArr.forEach(e => (isNaN(e) ? strings : numbers).push(e));
            switch (command) {
                    case 'a':
                        strings.sort((a, b) => a.localeCompare(b))
                        console.log(strings.join(' '))
                        readline.close();
                        break;
                    case 'b':
                        numbers.sort((a, b) => a - b)
                        console.log(numbers.join(' '))
                        readline.close();
                        break;
                    case 'c':
                        numbers.sort((a, b) => b - a)
                        console.log(numbers.join(' '))
                        readline.close();
                        break;
                    case 'd':
                        strings.sort((a, b) => a.length - b.length)
                        console.log(strings.join(' '))
                        readline.close();
                        break;
                    case 'e':
                        console.log(Array.from(new Set(strings)).join(' '))
                        readline.close();
                        break;
                    case 'f':
                        console.log(Array.from(new Set(validationArr)).join(' '))
                        readline.close();
                        break;
                    case 'g':
                        console.log('Exit...')
                        readline.close();
                        break;
                    case 'exit':
                        console.log('Exit...')
                        readline.close();
                        break;
                    default:
                        console.log("This command doesn't exist")
                        Command()
                        break;
                }
            });
        }
        Command()
    }

});}
WriteWords();