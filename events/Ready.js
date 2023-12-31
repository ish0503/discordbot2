const { Client, Collection, EmbedBuilder } = require("discord.js");
const stock_Schema = require("../models/stock");
const raid_Sechma = require("../models/raidparty")

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    let number = 0
    setInterval(() => {
        const list = [`현재 ${client.guilds.cache.size}개의 서버에서 게임`] 
        if(number == list.length) number = 0
        client.user.setActivity(list[number],{
            type: Client.Playing
        })
        number++
    }, 10000)
    console.log(`${client.user.tag} 봇 이 준비되었습니다.`)

    await raid_Sechma.deleteMany({ __v: 0 });

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function getRandomArbitrary2() {
      const random = Math.random() * 100 // 0 ~ 100
      if (random <= 69){
        return getRandomArbitrary(-10000, 10000)
      }else if (random <= 84){
        return getRandomArbitrary(-50000, 50000)
      }else if (random <= 94){
        return getRandomArbitrary(-100000, 100000)
      }else if (random <= 100){
        return getRandomArbitrary(-1000000, 1000000)
      }
    }

    var stockone = await stock_Schema.findOne({
      name: "껌딱지 주식회사"
    })
    
    var stocktwo = await stock_Schema.findOne({
      name: "새늅 주식회사"
    })
    
    var stockthree= await stock_Schema.findOne({
      name: "로즈 주식회사"
    })
    
    var stockfour = await stock_Schema.findOne({
      name: "봇 코퍼레이션"
    })

    var stockfive = await stock_Schema.findOne({
      name: "삼성 주식회사"
    })

    var lastupdate = Date.now()
    
    setInterval(async() => {
      stockone = await stock_Schema.findOne({
        name: "껌딱지 주식회사"
      })
      
      stocktwo = await stock_Schema.findOne({
        name: "새늅 주식회사"
      })
      
      stockthree= await stock_Schema.findOne({
        name: "로즈 주식회사"
      })
      
      stockfour = await stock_Schema.findOne({
        name: "봇 코퍼레이션"
      })

      stockfive = await stock_Schema.findOne({
        name: "삼성 주식회사"
      })
      
      lastupdate = Date.now()
      num = getRandomArbitrary2() /// 100;
      await stock_Schema.updateOne(
        {name: "껌딱지 주식회사"},
        {money: Math.round((stockone?.money || 10000) + num),
        desc: `껌 생김새 만드는 회사 (마지막 업데이트: <t:${Math.round(lastupdate / 1000)}:R>)`,
        percent: (((stockone?.money || 10000) + num) / (stockone?.money || 10000) * 100 - 100).toFixed(2),
        owner: "717687620301357086",
         maxbuy: stockone?.maxbuy || 0,
        },
        {upsert:true},
      );
      
      num = getRandomArbitrary2() / 100;
      await stock_Schema.updateOne(
        {name: "새늅 주식회사"},
        {money: Math.round((stocktwo?.money || 20000) + num),
        desc: `멸종위기의 새를 보존하는 회사 (마지막 업데이트: <t:${Math.round(lastupdate / 1000)}:R>)`,
        percent: (((stocktwo?.money || 10000) + num) / (stocktwo?.money || 10000) * 100 - 100).toFixed(2),
        owner: "929974091614670938",
         maxbuy: stocktwo?.maxbuy || 0,
        },
        {upsert:true},
      );

      num = getRandomArbitrary2() / 100;
      await stock_Schema.updateOne(
        {name: "로즈 주식회사"},
        {money: Math.round((stockthree?.money || 7000) + num),
        desc: `장미를 유전자 조작하는 회사 (마지막 업데이트: <t:${Math.round(lastupdate / 1000)}:R>)`,
        percent: (((stockthree?.money || 10000) + num) / (stockthree?.money || 10000) * 100 - 100).toFixed(2),
        owner: "717687620301357086",
         maxbuy: stockthree?.maxbuy || 0,
        },
        {upsert:true},
      );

      num = getRandomArbitrary2() / 100;
      await stock_Schema.updateOne(
        {name: "봇 코퍼레이션"},
        {money: Math.round((stockfour?.money || 15000) + num),
        desc: `도토리 따는 회사 (마지막 업데이트: <t:${Math.round(lastupdate / 1000)}:R>)`,
        percent: (((stockfour?.money || 10000) + num) / (stockfour?.money || 10000) * 100 - 100).toFixed(2),
        owner: "717687620301357086",
         maxbuy: stockfour?.maxbuy || 0,
        },
        {upsert:true},
      );

      num = getRandomArbitrary2() / 100;
      await stock_Schema.updateOne(
        {name: "삼성 주식회사"},
        {money: Math.round((stockfive?.money || 200000) + num),
        desc: `삼성이지만 주식회사입니다 직원 모집함 (마지막 업데이트: <t:${Math.round(lastupdate / 1000)}:R>)`,
        percent: (((stockfive?.money || 10000) + num) / (stockfive?.money || 10000) * 100 - 100).toFixed(2),
        owner: "717687620301357086",
         maxbuy: stockfive?.maxbuy || 0,
        },
        {upsert:true},
      );

      stockone = await stock_Schema.findOne({
        name: "껌딱지 주식회사"
      })
      
      stocktwo = await stock_Schema.findOne({
        name: "새늅 주식회사"
      })
      
      stockthree= await stock_Schema.findOne({
        name: "로즈 주식회사"
      })
      
      stockfour = await stock_Schema.findOne({
        name: "봇 코퍼레이션"
      })

      stockfive = await stock_Schema.findOne({
        name: "삼성 주식회사"
      })

    var start = "```diff"
    var end = "```"

    //console.log(start + `\n` + `설명: ${stockone.desc}\n주가: ${stockone.money.toLocaleString()} (${(stockone.percent > 0 ? "+" : "-")}${Math.abs(stockone.percent)}%)` + end)
    const embed = new EmbedBuilder()
    .setTitle("주식 정보")
    .setColor("Green")
    .addFields(
        { name: stockone?.name+ `(검딱지)\n` + `설명: ${stockone?.desc}`, value: start + `\n${(stockone?.percent > 0 ? "+" : "-")}주가: ${stockone?.money.toLocaleString()} (${(stockone?.percent > 0 ? "+" : "-")}${Math.abs(stockone?.percent)}%)\n 남은 주식: ${stockone?.maxbuy}` + end , inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: stocktwo?.name+ `(새늅)\n` + `설명: ${stocktwo?.desc}`, value: start + `\n${(stocktwo?.percent > 0 ? "+" : "-")}주가: ${stocktwo?.money.toLocaleString()} (${(stocktwo?.percent > 0 ? "+" : "-")}${Math.abs(stocktwo?.percent)}%)\n 남은 주식: ${stocktwo?.maxbuy}` + end , inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: stockthree?.name+ `(검딱지)\n` + `설명: ${stockthree?.desc}`, value: start + `\n${(stockthree?.percent > 0 ? "+" : "-")}주가: ${stockthree?.money.toLocaleString()} (${(stockthree?.percent > 0 ? "+" : "-")}${Math.abs(stockthree?.percent)}%)\n 남은 주식: ${stockthree?.maxbuy}` + end , inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: stockfour?.name+ `(검딱지)\n` + `설명: ${stockfour?.desc}`, value: start + `\n${(stockfour?.percent > 0 ? "+" : "-")}주가: ${stockfour?.money.toLocaleString()} (${(stockfour?.percent > 0 ? "+" : "-")}${Math.abs(stockfour?.percent)}%)\n 남은 주식: ${stockfour?.maxbuy}` + end , inline: true },
        { name: '\u200B', value: '\u200B' },
        { name: stockfive?.name+ `(검딱지)\n` + `설명: ${stockfive?.desc}`, value: start + `\n${(stockfive?.percent > 0 ? "+" : "-")}주가: ${stockfive?.money.toLocaleString()} (${(stockfive?.percent > 0 ? "+" : "-")}${Math.abs(stockfive?.percent)}%)\n 남은 주식: ${stockfive?.maxbuy}` + end , inline: true },
    )

    //const chan = client.channels.cache.get("1157578614259339264");
    const channel = client.channels.fetch("1157578614259339264").then(res => {
        res.send({embeds: [embed]})
    });
    }, 300000);
  },
};
