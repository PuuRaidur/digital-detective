import chalk from "chalk"
import { ApifyClient } from "apify-client"

// find the currently used phone number
function findCurrentNumber(record) {
    let lastReported = []
    for(let i = 1; i <= 5; i++) {
        // check if parsed result is NaN
        const isReportNaN = Number.isNaN(parseInt(record[`Phone-${i} Last Reported`].replace(/\D/g, '')))
        if (isReportNaN) {
            lastReported.push(0)
        } else {
            lastReported.push(parseInt(record[`Phone-${i} Last Reported`].replace(/\D/g, '')))
        }
    }

    //find the index of the biggest number
    const indexOfBiggest = lastReported.indexOf(Math.max(...lastReported))

    return record[`Phone-${indexOfBiggest + 1}`]
}

export default async function getFullNameData(name) {
    // create apify client
    const client = new ApifyClient({
        token: process.env.APIFY_API_KEY
    })
    // apify input
    const input = {
        "name": [name]
    }
    try {
        // run the Skip Trace and wait for it to finish
        const response = await client.actor("one-api/skip-trace").call(input, {log: null});
        // fetch the results
        var {items} = await client.dataset(response.defaultDatasetId).listItems(); // using var to access outer scope
    } catch (error) {
        console.log(`${RED_BOLD(error.name)} - ${error.message}`)
        process.exit(1)
    }

    let firstName = ""
    let lastName = ""
    let born = ""
    let address = ""
    let phoneNum = ""
    
    if(items[0]["First Name"] === 'Person Not Found') {
        firstName += "Not found"
        lastName += "Not found"
        born += "Not found"
        address += "Not found"
        phoneNum += "Not found"
    } else {
        firstName += items[0]["First Name"]
        lastName += items[0]["Last Name"]
        born += `${items[0].Born} (${items[0].Age} y.o.)`
        address += `${items[0]["Street Address"]}, ${items[0]["Address Locality"]}, ${items[0]["Address Region"]}, ${items[0]["Postal Code"]}`
        phoneNum += findCurrentNumber(items[0])
    }
    
    const RED_BOLD = chalk.red.bold
    const YELLOW_BOLD = chalk.yellow.bold
    let terminalOutput = ""
    let fileOutput = ""

    // terminal output
    terminalOutput += `${YELLOW_BOLD("First name:")} ${firstName}\n`
    terminalOutput += `${YELLOW_BOLD("Last name:")} ${lastName}\n`
    terminalOutput += `${YELLOW_BOLD("Born:")} ${born}\n`
    terminalOutput += `${YELLOW_BOLD("Address:")} ${address}\n`
    terminalOutput += `${YELLOW_BOLD("Phone number:")} ${phoneNum}\n`

    // file input
    fileOutput += `First name: ${firstName}\n`
    fileOutput += `Last name: ${lastName}\n`
    fileOutput += `Born: ${born}\n`
    fileOutput += `Address: ${address}\n`
    fileOutput += `Phone number: ${phoneNum}\n`

    return [terminalOutput, fileOutput]
}