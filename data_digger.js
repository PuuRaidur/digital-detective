import net from "node:net"
import dotenv from "dotenv"
import chalk from "chalk"
import { showHelp, writeToFile } from "./utils.js"
import getFullNameData from "./fullname/result.js"
import getIPdata from "./ip/result.js"
import getUsernameData from "./username/result.js"

const ARGS = process.argv;
dotenv.config({quiet: true}); //load .env variables while also suppressing load message
let flag;
let input;
let file;
const GREEN_BOLD = chalk.green.bold

// index 2 is the position of the flag
// index 3 is the position of the input
if (!ARGS[2] || ARGS[2].startsWith("-h") || ARGS[2].startsWith("--help")) {
  showHelp();
  process.exit(0);
}
else if ((ARGS[2].startsWith("-n") || ARGS[2].startsWith("--full-name")) && ARGS[3] !== undefined) {
  flag = "n"
  input = ARGS[3].trim()
  file = `${flag}_${input.replaceAll(" ", "_")}`

  var [terminalOutput, fileOutput] = await getFullNameData(input)
  console.log(terminalOutput)
  console.log(GREEN_BOLD(`Report successfully written to ${await writeToFile(file, fileOutput)}`))
}
else if ((ARGS[2].startsWith("-ip") || ARGS[2].startsWith("--ip-address")) && ARGS[3] !== undefined) {
  if (net.isIP(ARGS[3])) {
    flag = "ip"
    input = ARGS[3];
    file = `${flag}_${input.replaceAll(".", "_")}`

    var [terminalOutput, fileOutput] = await getIPdata(input)
    console.log(terminalOutput)
    console.log(GREEN_BOLD(`Report successfully written to ${await writeToFile(file, fileOutput)}`))
  }
  else {
    console.log(`${chalk.red.bold("Invalid IP address!")}\n`)
    showHelp();
    process.exit(1);
  }
}
else if ((ARGS[2].startsWith("-un") || ARGS[2].startsWith("--username")) && ARGS[3] !== undefined) {
  flag = "un"
  input = ARGS[3].trim()
  file = `${flag}_${input.replaceAll("@", "")}`

  var [terminalOutput, fileOutput] = await getUsernameData(input)
  console.log(terminalOutput)
  console.log(GREEN_BOLD(`Report successfully written to ${await writeToFile(file, fileOutput)}`))
}
else {
  showHelp();
  process.exit(1);
}
