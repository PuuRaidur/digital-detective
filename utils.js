import chalk from "chalk"
import { writeFile, mkdir } from "node:fs/promises"

export function showHelp() {
const ORANGE = chalk.hex("#FFA500");
console.log(`${ORANGE.bold("Gather publicly available information")}
${chalk.green.bold("Usage:")} node data_digger.js ${chalk.yellow("[OPTION] <input>")}
${chalk.yellow.bold("OPTIONS:")}
${chalk.green("-h; --help")} - Show help info
${chalk.green("-n; --name")} - Perform a full name search
${chalk.green("-ip; --ip-address")} - Perform an IP search
${chalk.green("-un; --username")} - Perform an username search`);
}

// write to file. if file exists, then append number to the end
export async function writeToFile(file, output) {
    const RED_BOLD = chalk.red.bold

    for(let i = 0; ;i++) {
        const fileName = `${file}${i === 0 ? '' : `(${i})`}.txt`

        try {
            await writeFile(fileName, output, {flag: 'wx'})
            return fileName
        } catch (err) {
            if (err.code !== 'EEXIST') {
                console.log(`${RED_BOLD("Error occurred writing to file: ")} ${err.message}`)
            }
        }
    }
}