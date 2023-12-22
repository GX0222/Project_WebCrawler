
const puppeteer = require('puppeteer');
const fs = require('fs');


async function main() {
    // https://opendata.cwa.gov.tw/dist/opendata-swagger.html#/%E9%A0%90%E5%A0%B1/get_v1_rest_datastore_F_C0032_001

    // 按鈕
    // #operations-預報-get_v1_rest_datastore_F_C0032_001 > div.no-margin > div > div.opblock-section > div.opblock-section-header > div.try-out > button

    // 授權碼
    // CWA-91CBC5B9-4168-4014-8542-1DCD1C42241E

    // 執行
    // #operations-預報-get_v1_rest_datastore_F_C0032_001 > div.no-margin > div > div.execute-wrapper > button

    // 取得JSON網址 https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-91CBC5B9-4168-4014-8542-1DCD1C42241E
    // #operations-預報-get_v1_rest_datastore_F_C0032_001 > div.no-margin > div > div.responses-wrapper > div.responses-inner > div > div > div:nth-child(2) > div > pre



    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();



    await page.goto("https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-91CBC5B9-4168-4014-8542-1DCD1C42241E",
        { waitUntil: 'networkidle2' });

    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

    // await page.click("#operations-預報-get_v1_rest_datastore_F_C0032_001 > div.no-margin > div > div.opblock-section > div.opblock-section-header > div.try-out > button");

    var dataList = await page.evaluate(() => {
        let result = [{
            City: "City",
            StartTime: "開始日期",
            EndtTime: "結束日期",
            Location: "地點",
            Url: "網址",
            ImgUrl: "圖片網址",
            dataText: "活動介紹"
        }];
        const $ = window.$;
        let liList = $(city.li);

        liList.each(function (index, element) {
            var Item = {
                Title: $(element).find("a").text(),
                StartTime: $(element).find("td.column-1").text(),
                EndtTime: $(element).find("td.column-2").text(),
                Location: $(element).find("td.column-4").text(),
                Url: $(element).find("a").prop("href")
            };
            result.push(Item);
        })
        return result;
    }, SouthCity[ic])

    // div#primary > main#main > article > div > p:nth-child(3)
    // 圖片網址:div#primary > main#main > article > div > p > img

    for (let i = 1; i < dataList.length; i++) {
        let data = dataList[i];
        let dataUrl = data.Url;
        if (dataUrl.startsWith("https://strolltimes.com")) {
            await page.goto(dataUrl, { waitUntil: 'networkidle2' });
            await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
            let imgUrl = await page.evaluate(function () {
                return $("div#primary > main#main > article > div > p > img").prop("src");
            });
            data.ImgUrl = imgUrl;
        } else {
            data.ImgUrl = "請確認";
        }
        let dataText = await page.evaluate(function () {
            return $("div#primary > main#main > article > div > p:nth-child(3)").text();
        });
        data.Text = dataText;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    const csvContent = dataList.map(item => Object.values(item).join(',')).join('\n');
    let csvName = SouthCity[ic].name + "_漫步時光.csv";
    fs.writeFileSync(csvName, csvContent);
    console.log(csvName + ' 已生成');

    await browser.close();
}

main();