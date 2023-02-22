import fs from 'fs';
import path from'path'

let startRead = Date.now()
const fileWords = [];
for (let i = 0; i <= 19; i++) {
    const filePath = path.join(`./words/out${i}.txt`)
    const contents = fs.readFileSync(filePath, 'utf-8');
    fileWords.push(contents);
}
console.log(`Read time ${Date.now() - startRead} ms`)


function uniqueValues(){

    let timeStart = Date.now()
    let uniqNames = new Set()
    for(const word of fileWords){
        const names = word.split('\n');
        for(const name of names){
            uniqNames.add(name)
        }
    }
    console.log(`Number of unique names in all files: ${uniqNames.size}.\n` + `Time ${Date.now() - timeStart} ms`)
}

function existInAllFiles() {

    let timeStart = Date.now()
    let namesInAllFiles;
    let temp = []
    for (const word of fileWords){
        const names = word.split('\n')
        temp.push(names)
    }
    function findNames(arr1 , arr2){
        const temp = new Set()
        for(const word of arr1){
            if(arr2.has(word)){
                temp.add(word)
            }
        }
        return temp
    }
    namesInAllFiles = new Set(temp[0])
    for (let i = 1 ; i <= 19 ; i++){
        let data = new Set(temp[i])
        namesInAllFiles = findNames(namesInAllFiles,data)
    }
    console.log(`Number of names exist in all files: ${namesInAllFiles.size}.\n` + `Time ${Date.now() - timeStart} ms`)
}

function existInAtLeastTen() {
    let timeStart = Date.now()
    let namesInTenFiles = {};
    let temp
    for (const word of fileWords){
        const names = word.split('\n')
        temp = new Set(names)
        temp.forEach(name=>{
            if(!namesInTenFiles[name]){
                namesInTenFiles[name] = 1
            }else if(namesInTenFiles[name] >= 0){
                namesInTenFiles[name] += 1
            }
        })
    }
    let count = 0
    for(const name in namesInTenFiles){
        if(namesInTenFiles[name] >= 10) count++
    }
    console.log(`Number of names exist at least ten files: ${count}.\n` + `Time ${Date.now() - timeStart} ms`)
}

uniqueValues()
existInAllFiles()
existInAtLeastTen()
