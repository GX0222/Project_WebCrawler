
const puppeteer = require('puppeteer');
const fs = require('fs');

// article > div > table > tbody tr:eq(3) td:eq(1)

async function main() {

    var SouthCity = [{
        name: "高雄",
        url: "https://strolltimes.com/activity-lazybag/3823/",
        select: "#tablepress-kaohsiung_length > label > select",
        li: "#tablepress-kaohsiung > tbody > tr",
        hoster: 'article > div > h2:contains("活動資訊") + table > tbody > tr:eq(4) > td:eq(1) > ul > li'
    },
    {
        name: "台南",
        url: "https://strolltimes.com/activity-lazybag/6764/",
        select: "#tablepress-tainan_length > label > select",
        li: "#tablepress-tainan > tbody > tr",
        hoster: 'article > div > h2:contains("活動資訊") + table > tbody > tr:eq(4) > td:eq(1) > ul > li'
    },
    {
        name: "屏東",
        url: "https://strolltimes.com/activity-lazybag/6777/",
        select: "#tablepress-pingtung_length > label > select",
        li: "#tablepress-pingtung > tbody > tr",
        hoster: 'article > div > h2:contains("活動資訊") + table > tbody > tr:eq(4) > td:eq(1) > ul > li'
    },
    {
        name: "嘉義",
        url: "https://strolltimes.com/activity-lazybag/6763/",
        select: "#tablepress-chiayi_length > label > select",
        li: "#tablepress-chiayi > tbody > tr",
        hoster: 'article > div > h2:contains("活動資訊") + table > tbody > tr:eq(4) > td:eq(1) > ul > li'
    }];
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    for (let ic = 0; ic < SouthCity.length; ic++) {

        await page.goto(SouthCity[ic].url, { waitUntil: 'networkidle2' });

        await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

        await page.select(SouthCity[ic].select, '100');

        var dataList = await page.evaluate((city) => {
            let result = [{
                Title: "活動名稱",
                StartTime: "開始日期",
                EndtTime: "結束日期",
                Location: "地點",
                Hoster: "主辦方",
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
                    Hoster: "",
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

            //介紹
            let dataText = await page.evaluate(function () {
                return $("div#primary > main#main > article > div > p:nth-child(3)").text();
            });
            data.Text = dataText;

            //主辦方
            let dataHoster = await page.evaluate(function (city) {
                return $(city.hoster).text();
            }, SouthCity[ic]);
            data.Hoster = dataHoster.replace(/"/g, '')  ;

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        const csvContent = dataList.map(item => Object.values(item).join(',')).join('\n');
        let csvName = SouthCity[ic].name + "_漫步時光.csv";
        fs.writeFileSync(csvName, csvContent);
        console.log(csvName + ' 已生成');
    }
    await browser.close();
}

main();