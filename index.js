const express = require('express')
const fs = require('fs')
const pdf = require('pdf-parse')

let fileBuffer = fs.readFileSync('./file/stockList.pdf')

const parsePdf = async () => {
    const data = await pdf(fileBuffer)
    let largeText = data.text;
    let textArray = largeText.split('\n');
    await parseStockList(textArray).then((stockList) => processResult(stockList))
}

const parseStockList = async (textArray) => {
    let stockList = [];
    let stockItem = false;
    textArray.forEach((item, index) => {
        if (item === 'item)') {
            stockItem = true;
        }
        if (stockItem) {
            stockList.push(item)
        }
    })
    stockList.shift()
    return stockList
}

const processResult = async (stockList) => {
    let result = [];
    stockList.forEach((str, index) => {
        if (str.includes("$", 0)) {
            let title = str.replace(/(.*?)\$.*/i, "$1")
            let price = str.substring(str.indexOf("$") + 1);
            result.push({ title: title, price: `$${price}` })
        } else if (str != 'Price on request') {
            result.push({ title: str, price: 'Price on request' })
        }

    })
    console.log(result);
    return result
}


const app = express();

app.use(express.json());

app.listen(3000, () => {
    parsePdf()
})


// 