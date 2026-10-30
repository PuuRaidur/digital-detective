import getISP from "./isp.js"
import getLocation from "./location.js"

// Create an object of properties needed for the ISP and geolocation retrieval logic
async function createBody(body) {
    let message
    if (body.status === "fulfilled") {
        if(body.value.ok) {
            try {
                body = await body.value.json()
                if (body.status === "fail") {
                    body.isError = true
                    body.report = `Error - ${body.message}`
                } else if (body.as === '-') {
                    body.isError = true
                    body.report = "No data found"
                } else {
                    body.isError = false
                    body.report = "Available"
                }
                return body
            } catch(error) {
                message = `${error.name} - ${error.message}`
            }
        } else if (body.value.status === 429) {
            message = `${body.value.status} error - Too many requests. Rate-limit reached. Try again later.`
        } else if(!body.value.ok) {
            message = `${body.value.status} error - ${body.value.statusText}`
        } else {
            message = `${body.value.status} error - ${body.value.statusText}`
        } // double-guard just to be safe
        return {isError: true, report: message}
    }
    if (body.status === "rejected") {
        message = `${body.reason.name} - ${body.reason.message}`
        return {isError: true, report: message}
    }
}

// Main function to retrieve IP-related info
export default async function getIPdata(ip) {
    // Parallel API calls. Improves performance
    let [ipApiResponse, ip2LocationResponse] = await Promise.allSettled([
    fetch(`http://ip-api.com/json/${ip}`, { signal: AbortSignal.timeout(10000) }),
    fetch(`https://api.ip2location.io/?ip=${ip}&key=${process.env.IP2LOCATION_API_KEY}`, { signal: AbortSignal.timeout(10000) })
    ])

    let ipApiBody = await createBody(ipApiResponse)
    let ip2LocationBody = await createBody(ip2LocationResponse)

    let result = "";
    result += `ip-api: ${ipApiBody.report}\n`
    result += `ip2location: ${ip2LocationBody.report}\n`
    result += `ISP / Network Owner: ${getISP(ipApiBody, ip2LocationBody)}\n`
    result += `Location: ${getLocation(ipApiBody, ip2LocationBody)}\n`
    return result
}