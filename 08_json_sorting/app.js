import https from 'https'


let countIsTrue = 0
let countIsFalse = 0

const urls = [
    "https://jsonbase.com/sls-team/json-793",
    "https://jsonbase.com/sls-team/json-955",
    "https://jsonbase.com/sls-team/json-231",
    "https://jsonbase.com/sls-team/json-931",
    "https://jsonbase.com/sls-team/json-93",
    "https://jsonbase.com/sls-team/json-342",
    "https://jsonbase.com/sls-team/json-770",
    "https://jsonbase.com/sls-team/json-491",
    "https://jsonbase.com/sls-team/json-281",
    "https://jsonbase.com/sls-team/json-718",
    "https://jsonbase.com/sls-team/json-310",
    "https://jsonbase.com/sls-team/json-806",
    "https://jsonbase.com/sls-team/json-469",
    "https://jsonbase.com/sls-team/json-258",
    "https://jsonbase.com/sls-team/json-516",
    "https://jsonbase.com/sls-team/json-79",
    "https://jsonbase.com/sls-team/json-706",
    "https://jsonbase.com/sls-team/json-521",
    "https://jsonbase.com/sls-team/json-350",
    "https://jsonbase.com/sls-team/json-64"
]

 function fetch(url, retries) {
    return new Promise((resolve, reject)=>{
        https.get(url, (resp) => {
            let data = []
            resp.on('data', chunk => {
                data = JSON.parse(chunk)
            })
            resp.on('end', () => {
                let isDone = findPropertyValue(data, 'isDone')
                isDone ? ++countIsTrue : ++countIsFalse
                console.log(`[Success] ${url}: isDone - ${isDone}`);
                resolve(isDone)

            })
        }).on('error', (err) => {
            if (retries === 0) {
                reject(err)
                console.log(`[Fail] ${url}: The endpoint is unavailable`)
            }
            retries--
            setTimeout(() => fetch(url, retries),1000)
        })
    })
}
Promise.all(urls.map(url => fetch(url , 3)))
    .then((results) => {
        console.log('Found True values:', countIsTrue)
        console.log('Found False values:', countIsFalse)
    })
    .catch((err) => {
        console.error(`Ошибка: ${err.message}`);
    });


function findPropertyValue(data, key) {
    let value;

    for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
            if (prop === key) {
                return data[prop];
            } else if (typeof data[prop] === 'object') {
                value = findPropertyValue(data[prop], key);
                if (value === true) {
                    return value;
                }
                if (value === false) {
                    return value;
                }
            }
        }
    }
}


