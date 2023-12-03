
const puppeteer = require('puppeteer');
const fs = require('fs');

async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://strolltimes.com/activity-lazybag/3823/', { waitUntil: 'networkidle2' });

    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' })

    await page.select('#tablepress-kaohsiung_length > label > select', '100');

    var dataList = await page.evaluate(() => {
        let result = [{
            Title: "活動名稱",
            StartTime: "開始日期",
            EndtTime: "結束日期",
            Location: "地點",
            Url: "網址",
            ImgUrl: "圖片網址"
        }];
        const $ = window.$;
        let liList = $("#tablepress-kaohsiung > tbody > tr");

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
    })
    

    // 圖片網址:div#primary > main#main > article > div > p > img

    for (let i = 1; i < dataList.length; i++) {
        let data = dataList[i];
        let dataUrl = data.Url;
        if(dataUrl.startsWith("https://strolltimes.com")){
            await page.goto(dataUrl, { waitUntil: 'networkidle2' });
            await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
            let imgUrl = await page.evaluate(function () {
                return $("div#primary > main#main > article > div > p > img").prop("src");
            });
            data.ImgUrl = imgUrl;
        }else{
            data.ImgUrl = "請確認";
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await browser.close();

    const csvContent = dataList.map(item => Object.values(item).join(',')).join('\n');
    fs.writeFileSync('高雄_漫步時光.csv', csvContent);

    console.log('CSV 文件已生成');
}

main();