// Checks if AS number is the same
function checkASN(ipApiBody, ip2LocationBody) {
    const ipApiASN = ipApiBody.as?.match(/^AS(\d+)/)?.[1]
    const ip2LocationASN = String(ip2LocationBody.asn ?? "")
    if(!ipApiASN || !ip2LocationASN) return null
    return ipApiASN === ip2LocationASN
}

// Function to retrieve ISP / Network Owner data
export default function getISP(ipApiBody, ip2LocationBody) {
    const sameASN = checkASN(ipApiBody, ip2LocationBody)

    // Different scenarios with extra checks
    if (sameASN) {
        return `${ipApiBody.isp} | Confirmed by both sources`
    }
    else if (sameASN === false) {
        return `${ipApiBody.isp} / ${ip2LocationBody.as} | Conflicting sources`
    }
    else if (ipApiBody.isError && ip2LocationBody.isError) {
        return "Not found | Errors occurred"
    }
    else if (!ipApiBody.isError && ip2LocationBody.isError) {
        if (!ipApiBody.isp) return "Not found | No ISP data available"
        return `${ipApiBody.isp} | Unverified; ip-api only`
    }
    else if (ipApiBody.isError && !ip2LocationBody.isError) {
        if (!ip2LocationBody.as) return "Not found | No ISP data available"
        return `${ip2LocationBody.as} | Unverified; ip2location only`
    }
    else {
        return `${ipApiBody.isp} | Unverified; sources couldn't be compared`
    }
}