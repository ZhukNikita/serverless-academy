import https from 'https'
import fs from 'fs'

async function fetchUsers() {
    let users
    const req = await https.get('https://jsonbase.com/sls-team/vacations' , (resp)=>{
            let data
            resp.setEncoding('utf8');
            resp.on("data" , (chunk)=>{
                data = JSON.parse(chunk)
            });
            resp.on('end', () => {
                let arr = []
                users = data
                users.forEach( el =>{
                    const formatArr = arr.find(elem=> elem.userName === el.user.name)
                    if(formatArr){
                        formatArr.vacations.push({start: el.startDate, end: el.endDate})
                    }else{
                        arr.push({
                            userId: el._id,
                            userName : el.user.name,
                            vacations:[{start: el.startDate, end: el.endDate}]
                        })
                    }

                })
                fs.appendFileSync('users.json' , JSON.stringify(arr))
                console.log(arr)
            });
        })
        req.on("error", (err) => {
            console.log("Error: " + err.message);
        });
        req.end()
    return users
}
fetchUsers()
