const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gambling_Schema = require("../../models/stock")
const gambling_Schema2 = require("../../models/stocker")
const money_Schema = require("../../models/Money")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("주식")
        .setDescription("주식 명령어입니다!")
        .addSubcommand(subcommand =>
              subcommand
              .setName("매수")
              .setDescription("주식을 매수해보세요!")
              .addStringOption(options => options
                  .setName("이름")
                  .setDescription("매수할 주식의 이름 입력해주세요.")
                  .setRequired(true)
              )
              .addIntegerOption(options => options
                .setName("주")
                .setDescription("매수할 주식의 주를 입력해주세요.")
                .setMinValue(1)
                .setRequired(true)
              ),
            )
        .addSubcommand(subcommand =>
              subcommand
              .setName("매도")
              .setDescription("주식을 매도해보세요!")
              .addStringOption(options => options
                  .setName("이름")
                  .setDescription("매도할 주식의 이름 입력해주세요.")
                  .setRequired(true)
              )
              .addIntegerOption(options => options
                .setName("주")
                .setDescription("매도할 주식의 주를 입력해주세요.")
                .setMinValue(1)
                .setRequired(true)
              ),
            )
        .addSubcommand(subcommand =>
            subcommand
            .setName("확인")
            .setDescription("가상 주식의 정보를 확인할 수 있습니다."),
            )
        .addSubcommand(subcommand =>
            subcommand
            .setName("보유확인")
            .setDescription("가상 주식 보유한것을 확인할 수 있습니다."),
            ),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === "매수") {
        const args = interaction.options.getString("이름")
        const args2 = interaction.options.getInteger("주")
        const gambling_find = await gambling_Schema2.findOne({
            userid:interaction.user.id
        })
        console.log(gambling_find)
        const money_find = await money_Schema.findOne({
            userid:interaction.user.id
        })
        console.log(money_find)
        const stock_find = await gambling_Schema.findOne({
            name:args
        })

        if (!stock_find){
            interaction.reply({
                content: `주식을 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
            });
            return;
        }

        if (!money_find) return interaction.reply({
            embeds: [
              new (require("discord.js")).EmbedBuilder()
              .setTitle('SYSTEM API ERROR')
              .setDescription(`돈이 없습니다. /돈 으로 지원금을 받으세요.`)
              .setColor('Red')
            ],
            ephemeral: true
          })

        if (stock_find.value + args2 > 100000){
            interaction.reply({
                content: `한 주식을 100000주 초과하여 매수할수 없습니다`,
            });
            return;
        }

        if (gambling_find){
            console.log("찾음")

            var list = []
            let length = gambling_find.hashtags.length
            let isitem = -1
            for (let i = 0; i < length; i++){
                if (gambling_find.hashtags[i].name == args) {
                    isitem = i
                }else{
                    list.push(gambling_find.hashtags[i])
                }
            }
    
            if (isitem != -1){
                console.log("아이템 있음")
                list.push({ "name": args, "value": gambling_find.hashtags[isitem].value + args2, "lastvalue": gambling_find.hashtags[isitem].lastvalue + stock_find.money * args2 })
                if (money_find.money < stock_find.money * args2){
                    const embed = new EmbedBuilder()
                            .setDescription(
                                `**돈이 부족합니다.**`
                            )
                            .setColor("Red");
                        
                            interaction.reply({embeds: [embed]});
                            return;
                }

                if (stock_find.maxbuy + args2 > stock_find.maxbuy) {
            const embed = new EmbedBuilder()
                    .setDescription(
                        `**살 수 없습니다.**`
                    )
                    .setColor("Red");
                
                    interaction.reply({embeds: [embed]});
                    return;
                }
        
                await money_Schema.updateOne(
                    {userid:interaction.user.id},
                    {money:Number(money_find.money) - Number(stock_find.money) * args2}
                )
        
                await gambling_Schema2.updateOne(
                    {userid: interaction.user.id},
                    {$set: {
                       hashtags : list,
                    },
                    },
                    {upsert:true}
                );

                await gambling_Schema.updateOne(
                    {name:args},
                    {money: Math.round(stock_find?.money + stock_find?.money * (args2 / (stock_find?.money * 10000))),
                    desc: stock_find.desc,
                    percent: stock_find.percent,
                    owner: stock_find.owner,
                     maxbuy: stock_find.maxbuy + args2
                    },
                    {upsert:true},
                )

                const embed = new EmbedBuilder()
                    .setDescription(
                       `**${(stock_find.money * args2).toLocaleString()}재화를 주고 ${args} ${args2.toLocaleString()}주가 매수 되었습니다.\n남은재화: ${(Number(money_find.money) - stock_find.money * args2).toLocaleString()}**`
                    )
                    .setColor("Green");
                
                interaction.reply({embeds: [embed]});

                return
            }else{
                if (!money_find || money_find.money < stock_find.money * args2){
                    const embed = new EmbedBuilder()
                            .setDescription(
                                `**돈이 부족합니다.**`
                            )
                            .setColor("Red");
                        
                            interaction.reply({embeds: [embed]});
                            return;
                }

                if (stock_find.maxbuy + args2 > stock_find.maxbuy) {
            const embed = new EmbedBuilder()
                    .setDescription(
                        `**살 수 없습니다.**`
                    )
                    .setColor("Red");
                
                    interaction.reply({embeds: [embed]});
                    return;
                }
        
                await money_Schema.updateOne(
                    {userid:interaction.user.id},
                    {money:Number(money_find.money) - Number(stock_find.money) * args2}
                )
        
                await gambling_Schema2.updateOne(
                    {userid: interaction.user.id},
                    {$push: {
                       hashtags : 
                            [{ "name": args, "value": args2, "lastvalue": stock_find.money * args2 }],
                    },
                     },
                    {upsert:true}
                );

                await gambling_Schema.updateOne(
                    {name:args},
                    {money: Math.round(stock_find?.money + stock_find?.money * (args2 / (stock_find?.money * 10000))),
                    desc: stock_find.desc,
                    percent: stock_find.percent,
                    owner: stock_find.owner,
                     maxbuy: stock_find.maxbuy + args2
                    },
                    {upsert:true},
                )

                const embed = new EmbedBuilder()
                    .setDescription(
                        `**${(stock_find.money * args2).toLocaleString()}재화를 주고 ${args} ${args2.toLocaleString()}주가 매수 되었습니다.\n남은재화: ${(Number(money_find.money) - stock_find.money * args2).toLocaleString()}**`
                    )
                    .setColor("Green");
                
                interaction.reply({embeds: [embed]});

                return
            }
        }

        if (!money_find || money_find.money < stock_find.money * args2){
            const embed = new EmbedBuilder()
                    .setDescription(
                        `**돈이 부족합니다.**`
                    )
                    .setColor("Red");
                
                    interaction.reply({embeds: [embed]});
                    return;
        }

        if (stock_find.maxbuy + args2 > stock_find.maxbuy) {
            const embed = new EmbedBuilder()
                    .setDescription(
                        `**살 수 없습니다.**`
                    )
                    .setColor("Red");
                
                    interaction.reply({embeds: [embed]});
                    return;
        }

        await money_Schema.updateOne(
            {userid:interaction.user.id},
            {money:Number(money_find.money) - Number(stock_find.money) * args2}
        )

        await gambling_Schema2.updateOne(
            {userid: interaction.user.id},
            {$push: {
               hashtags : 
                    [{ "name": args, "value": args2, "lastvalue": stock_find.money * args2 }],
            },
            },
            {upsert:true}
        );

        await gambling_Schema.updateOne(
            {name:args},
            {money: Math.round(stock_find?.money + stock_find?.money * (args2 / (stock_find?.money * 10000))),
            desc: stock_find.desc,
            percent: stock_find.percent,
            owner: stock_find.owner,
             maxbuy: stock_find.maxbuy + args2
            },
            {upsert:true},
        )

        const embed = new EmbedBuilder()
            .setDescription(
                `**${(stock_find.money * args2).toLocaleString()}재화를 주고 ${args} ${args2.toLocaleString()}주가 매수 되었습니다.\n남은재화: ${(Number(money_find.money) - stock_find.money * args2).toLocaleString()}\n마지막 매도 전 이 주식에 투자한 수: ${gambling_find.lastvalue + stock_find.money * args2}**`
            )
            .setColor("Green");
        
        interaction.reply({embeds: [embed]});
            
        }else if (interaction.options.getSubcommand() === "매도") {
            const 매도수수료 = 10
            const args = interaction.options.getString("이름")
            const args2 = interaction.options.getInteger("주")
            const money_find = await money_Schema.findOne({
                userid:interaction.user.id
            })
            const gambling_find = await gambling_Schema2.findOne({
                userid:interaction.user.id
            })
            const stock_find = await gambling_Schema.findOne({
                name:args
            })
    
            console.log(gambling_find)

            if (!stock_find){
                interaction.reply({
                    content: `주식을 찾을수 없습니다. 제대로 입력했는지 확인해보세요.`,
                });
                return;
            }
            if (!money_find) return interaction.reply({
                embeds: [
                  new (require("discord.js")).EmbedBuilder()
                  .setTitle('SYSTEM API ERROR')
                  .setDescription(`돈이 없습니다. /돈 으로 지원금을 받으세요.`)
                  .setColor('Red')
                ],
                ephemeral: true
              })

            if (!gambling_find){
                interaction.reply({
                    content: `**주식이 없으시군요.. \`/주식 매수\` 명령어로 주식을 매수하세요.**`
                })
                return
            }
            var value2 = args2
    
            let soondeleteitem = []
    
            let length = gambling_find.hashtags.length
            let isitem = -1
            for (let i = 0; i < length; i++){
                if (gambling_find.hashtags[i].name == args) {
                    isitem = i
                    if (gambling_find.hashtags[i].value - value2 > 0) {
                        soondeleteitem.push({"name": gambling_find.hashtags[i].name, "value": gambling_find.hashtags[i].value - value2, "lastvalue": gambling_find.hashtags[i].lastvalue - stock_find.money * value2})
                    }else {
                        value2 = gambling_find.hashtags[i].value
                    }
                }else{
                    soondeleteitem.push({"name": gambling_find.hashtags[i].name, "value": gambling_find.hashtags[i].value, "lastvalue": gambling_find.hashtags[i].lastvalue})
                }
            }
    
            if (isitem == -1){
                const embed = new EmbedBuilder()
                    .setDescription(
                        `**주식을 찾을 수 없습니다.. 공기라도 팔라는 건가요?**`
                    )
                    .setColor("Red");
                
                    interaction.reply({embeds: [embed]});
                    return;
            }

            console.log(Number(money_find.money) + ((stock_find.money * value2) - (stock_find.money * value2) * (매도수수료 / 100)))
            await money_Schema.updateOne(
                {userid:interaction.user.id},
                {money:Number(money_find.money) + ((stock_find.money * value2) - (stock_find.money * value2) * (매도수수료 / 100))}
            )

            const money_find2 = await money_Schema.findOne({
                userid:stock_find.owner
            })

            if (money_find2){
                await money_Schema.updateOne(
                    {userid:stock_find.owner},
                    {money:Number(money_find2.money) + (stock_find.money * value2) * (매도수수료 / 100)}
                )
            }
    
            console.log(soondeleteitem)
    
            await gambling_Schema2.updateOne(
                {userid: interaction.user.id},
                {$set: {
                    hashtags: soondeleteitem//[{"name": null}]
                        //{ "name": args, "value": 0 },
                },
                },
                {upsert:true}
            );

            await gambling_Schema.updateOne(
                {name:args},
                {money: Math.round(stock_find?.money - stock_find?.money * (args2 / (stock_find?.money * 100000))),
                desc: stock_find.desc,
                percent: stock_find.percent,
                owner: stock_find.owner,
                },
                {upsert:true},
            )
    
            // $push: {
            //     quizzes: {
            //        $each: [ { wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 } ],
            //        $sort: { score: -1 },
            //        $slice: 3
            //     }
            //   }
    
            //{ "name": args, "value": 0}
    
            //gambling_Schema.findOneAndRemove({name : gambling_find.hashtags[isitem]})
    
            const embed = new EmbedBuilder()
                .setDescription(
                    `**${args} ${value2.toLocaleString()}주가 성공적으로 매도되었습니다.\n예상되는 받는돈: ${(stock_find.money * value2 - (stock_find.money * value2) * (매도수수료 / 100)).toLocaleString()}\n남은재화: ${(Number(money_find.money) + stock_find.money * value2 - (stock_find.money * value2) * (매도수수료 / 100)).toLocaleString()}**`
                )
                .setColor("Green");
            
            interaction.reply({embeds: [embed]});

            // if (soondeleteitem.length <= 0){
            //     gambling_Schema2.findOneAndRemove({userid : gambling_find.userid})
            // }
        }else if (interaction.options.getSubcommand() === "확인") {
            const stockone = await gambling_Schema.findOne({
                name: "껌딱지 주식회사"
              })
              
              const stocktwo = await gambling_Schema.findOne({
                name: "새늅 주식회사"
              })
              
              const stockthree= await gambling_Schema.findOne({
                name: "로즈 주식회사"
              })
              
              const stockfour = await gambling_Schema.findOne({
                name: "토리 코퍼레이션"
              })

              const stockfive = await gambling_Schema.findOne({
                name: "삼성 주식회사"
              })

            var start = "```diff"
            var end = "```"
    
            console.log(start + `\n` + `설명: ${stockone.desc}\n주가: ${stockone.money.toLocaleString()} (${(stockone.percent > 0 ? "+" : "-")}${Math.abs(stockone.percent)}%)` + end)
            const embed = new EmbedBuilder()
            .setTitle("주식 정보")
            .setColor("Green")
            .addFields(
                { name: stockone.name+ `(${await interaction.client.users.fetch(stockone.owner).username})\n` + `설명: ${stockone.desc}`, value: start + `\n${(stockone.percent > 0 ? "+" : "-")}주가: ${stockone.money.toLocaleString()} (${(stockone.percent > 0 ? "+" : "-")}${Math.abs(stockone.percent)}%)` + end , inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: stocktwo.name+ `(${await interaction.client.users.fetch(stocktwo.owner).username})\n` + `설명: ${stocktwo.desc}`, value: start + `\n${(stocktwo.percent > 0 ? "+" : "-")}주가: ${stocktwo.money.toLocaleString()} (${(stocktwo.percent > 0 ? "+" : "-")}${Math.abs(stocktwo.percent)}%)` + end , inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: stockthree.name+ `(${await interaction.client.users.fetch(stockthree.owner).username})\n` + `설명: ${stockthree.desc}`, value: start + `\n${(stockthree.percent > 0 ? "+" : "-")}주가: ${stockthree.money.toLocaleString()} (${(stockthree.percent > 0 ? "+" : "-")}${Math.abs(stockthree.percent)}%)` + end , inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: stockfour.name+ `(${await interaction.client.users.fetch(stockfour.owner).username})\n` + `설명: ${stockfour.desc}`, value: start + `\n${(stockfour.percent > 0 ? "+" : "-")}주가: ${stockfour.money.toLocaleString()} (${(stockfour.percent > 0 ? "+" : "-")}${Math.abs(stockfour.percent)}%)` + end , inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: stockfive.name+ `(${await interaction.client.users.fetch(stockfive.owner).username})\n` + `설명: ${stockfive.desc}`, value: start + `\n${(stockfive.percent > 0 ? "+" : "-")}주가: ${stockfive.money.toLocaleString()} (${(stockfive.percent > 0 ? "+" : "-")}${Math.abs(stockfive.percent)}%)` + end , inline: true },
            )
    
            interaction.reply({embeds: [embed]})
        }else if (interaction.options.getSubcommand() === "보유확인") {
            const gambling_find = await gambling_Schema2.findOne({
                userid:interaction.user.id
            })
    
            if (!gambling_find){
                interaction.reply({
                    content: `**주식이 없으시군요.. \`/주식 매수\` 명령어로 주식을 매수하세요.**`
                })
                return
            }
    
            const embed = new EmbedBuilder().setDescription(
                `**${
                    interaction.user
                }님의 주식**`
            ).setColor("Green")
    
            let length = gambling_find.hashtags.length
            for (let i = 0; i < length; i++){
                console.log("반복"+i)
                console.log(gambling_find.hashtags[i])
                if (!gambling_find.hashtags[i]) { 
                    continue
                }
                var item = gambling_find.hashtags[i]
                const gambling_find2 = await gambling_Schema.findOne({
                    name:item.name
                })
                console.log(item)
                embed.addFields({
                    name: `${i+1}. ${item.name}`,
                    value: `**${item.value}주 (${(gambling_find2.money * item.value).toLocaleString()}재화)\n(${(((Number(gambling_find2.money) * item.value) / (item.lastvalue)) * 100 - 100).toFixed(2)}%)**`
                })
            }
    
            interaction.reply({embeds: [embed]})
        }
    }
}
