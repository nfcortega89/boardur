const axios = require('axios')
const cheerio = require('cheerio')
const Horseman = require('node-horseman')
const config = {
  userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:50.0) Gecko/20100101 Firefox/50.0",
  headers: {
    "Host": "www.instagram.com",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    // "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
  }
}
const fetchInstagram = function(instagramId) {
  const horseman = new Horseman()
  if (!instagramId) {
    return Promise.reject( new Error('no instagramId') )
  }
  console.log(instagramId)
  return new Promise((resolve, reject) => {
    try {
      horseman
        .userAgent(config.userAgent)
        .headers(config.headers)
        .viewport(1440, 2500)
        .open(`https://www.instagram.com/${instagramId}`)
        .click('a:contains("Load")')
        .scrollTo(99999, 0)
        .wait(1000)
        .scrollTo(0, 0)
        .wait(1000)
        .scrollTo(99999, 0)
        .wait(1000)
        .scrollTo(0, 0)
        .wait(1000)
        .scrollTo(99999, 0)
        .wait(1000)
        .scrollTo(0, 0)
        .wait(1000)
        .scrollTo(99999, 0)
        .wait(1000)
        .html()
        .then(function(body) {
          const $ = cheerio.load(body)
          let images = []
          $('img').each(function(i) {
            // console.log($(this))
            let obj = {
              url: $(this).attr('src'),
              title: $(this).attr('alt') // fetch image title using jquery
            }
             images.push(obj)
          })
          resolve(images)
        })
        .close()
    } catch(e) {
      fetchInstagram(instagramId)
    }
  })
}

module.exports = fetchInstagram
