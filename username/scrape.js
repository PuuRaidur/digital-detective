// web scraping functions for each platform
import * as cheerio from "cheerio"

function getAnswer(username) {
    if(username) return "yes"
    else return "no"
}

export function scrapeX(body) {
    if(body.isError) return body.report

    const HTML = cheerio.load(body.html)
    const page_username = HTML('meta[property="profile:username"]').attr('content')
    
    return getAnswer(page_username)
}

export function scrapeTelegram(body) {
    if(body.isError) return body.report

    const HTML = cheerio.load(body.html)
    const page_username = HTML('div.tgme_page_extra').text()

    return getAnswer(page_username)
}

export function scrapePinterest(body) {
    if(body.isError) return body.report

    const HTML = cheerio.load(body.html)
    const page_username = HTML('div.FlexItem_x span[data-test-id="profile-username"]').text()

    return getAnswer(page_username)
}