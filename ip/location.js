// Checks if country codes match
function checkCountry(ipApiBody, ip2LocationBody) {
    const ipApiCountryCode = ipApiBody.countryCode ?? "" 
    const ip2LocationCountryCode = ip2LocationBody.country_code ?? ""
    return ipApiCountryCode === ip2LocationCountryCode
}

// Checks if cities are the same
function checkCity(ipApiBody, ip2LocationBody) {
    const ipApiCity = ipApiBody.city?.trim().toLowerCase() || null // safe lower-case
    const ip2LocationCity = ip2LocationBody.city_name === "-" ? null :
    ip2LocationBody.city_name?.trim().toLowerCase() // safe lower-case

    if(ipApiCity?.includes(ip2LocationCity) || ip2LocationCity?.includes(ipApiCity)) return true // search for substring
    else return false
}

// Main function to conclude location data
export default function getLocation(ipApiBody, ip2LocationBody) {
    // Constants for condition checking
    const hasA = ipApiBody.lat != null && ipApiBody.lon != null
    const hasB = ip2LocationBody.latitude != null && ip2LocationBody.longitude != null
    const sameCountry = checkCountry(ipApiBody, ip2LocationBody)
    const sameCity = checkCity(ipApiBody, ip2LocationBody)

    // Different scenarios with extra checks
    if(ipApiBody.isError && ip2LocationBody.isError) {
        return "Not found | Errors occurred"
    }
    else if (!ipApiBody.isError && ip2LocationBody.isError) {
        if(!ipApiBody.lat || !ipApiBody.lon) return "Not found | Coordinates data unavailable"
        return `${ipApiBody.lat}, ${ipApiBody.lon} | Unverified; ip-api only`
    }
    else if (ipApiBody.isError && !ip2LocationBody.isError) {
        if(!ip2LocationBody.latitude || !ip2LocationBody.longitude) return "Not found | Coordinates data unavailable"
        return `${ip2LocationBody.latitude}, ${ip2LocationBody.longitude} | Unverified; ip2location only`
    }
    else if (!ipApiBody.isError && !ip2LocationBody.isError) {
        if (!hasA && !hasB) return "Not found | Coordinates data unavailable"

        else if (!hasA) return `${ip2LocationBody.latitude}, ${ip2LocationBody.longitude} | Unverified; ip2location only`

        else if (!hasB) return `${ipApiBody.lat}, ${ipApiBody.lon} | Unverified; ip-api only`

        else if (sameCountry && sameCity) return `${ip2LocationBody.latitude}, ${ip2LocationBody.longitude} | Confirmed by both sources`

        else if (sameCountry && !sameCity) {
            // Multi-line output
            return `Partially verified; country matches, city(s) differ/missing
ip-api: ${ipApiBody.lat}, ${ipApiBody.lon}
ip2location: ${ip2LocationBody.latitude}, ${ip2LocationBody.longitude}`
        }

        else if (!sameCountry) {
            // Multi-line output
            return `Conflicting sources; country differs
ip-api: ${ipApiBody.lat}, ${ipApiBody.lon}
ip2location: ${ip2LocationBody.latitude}, ${ip2LocationBody.longitude}`
        }
    }
}