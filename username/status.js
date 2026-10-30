export default function checkStatus(body) {
    if (body.isError) {
        return body.report
    }
    if (!body.isError) {
        if(body.status === 200) return "yes"

        else if(body.status === 404) return "no"

        else return "unknown"
    }
}