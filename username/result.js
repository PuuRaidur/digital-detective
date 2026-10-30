import chalk from "chalk"
import checkStatus from "./status.js"
import {scrapeTelegram, scrapePinterest, scrapeX} from "./scrape.js"

// create the correct kind of object
async function createBody(response) {
    if(response.status === "fulfilled") {
        try {
            const html = await response.value.text()
            return {isError: false, status: response.value.status, html}
        } catch (error) {
            return {isError: true, report: `${error.name} - ${error.message}`}
        }
    }
    if (response.status === "rejected") {
        return {isError: true, report: `${response.reason.name} - ${response.reason.message}`}
    }
}

export default async function getUsernameData(username) {
    // Parallel fetching for better performance
    const responses = await Promise.allSettled([
        fetch(`https://github.com/${username.trim().replace(/@/g, "")}`, { signal: AbortSignal.timeout(8000) }),
        fetch(`https://dev.to/${username.trim().replace(/@/g, "")}`, { signal: AbortSignal.timeout(8000)}),
        fetch(`https://x.com/${username.trim().replace(/@/g, "")}`, { signal: AbortSignal.timeout(8000)}),
        fetch(`https://t.me/${username.trim().replace(/@/g, "")}`, { signal: AbortSignal.timeout(8000)}),
        fetch(`https://pinterest.com/${username.trim().replace(/@/g, "")}`, { signal: AbortSignal.timeout(8000)})
    ])

    const [githubBody, devBody, xBody, telegramBody, pinterestBody] = await Promise.all(responses.map(createBody))

    const BLUE_BOLD = chalk.blue.bold
    let terminalOutput = "";
    let fileOutput = "";

    // terminal output
    terminalOutput += `${BLUE_BOLD("GitHub:")} ${checkStatus(githubBody)}\n`
    terminalOutput += `${BLUE_BOLD("Dev.to:")} ${checkStatus(devBody)}\n`
    terminalOutput += `${BLUE_BOLD("X:")} ${scrapeX(xBody)}\n`
    terminalOutput += `${BLUE_BOLD("Telegram:")} ${scrapeTelegram(telegramBody)}\n`
    terminalOutput += `${BLUE_BOLD("Pinterest:")} ${scrapePinterest(pinterestBody)}\n`

    // file input
    fileOutput += `GitHub: ${checkStatus(githubBody)}\n`
    fileOutput += `Dev.to: ${checkStatus(devBody)}\n`
    fileOutput += `X: ${scrapeX(xBody)}\n`
    fileOutput += `Telegram: ${scrapeTelegram(telegramBody)}\n`
    fileOutput += `Pinterest: ${scrapePinterest(pinterestBody)}\n`
    
    return [terminalOutput, fileOutput]
}