const google = require('google-it')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("구글검색")
    .setDescription("구글에서 나와있는 정보를 1~10까지 보여줍니다")
    .addStringOption(options => options
        .setName("검색어")
        .setDescription("검색어를 입력해주세요.")
        .setRequired(true)
    ),
    async execute(interaction) {
      const args = interaction.options.getString("검색어")

        interaction.reply("검색중입니다..")

        google({ 'query': args }).then(rufrhk => {
            rufrhk.forEach(function (item, index) {
                const embed = new EmbedBuilder()
                    .setTitle(`${args}에 대한 검색결과입니다`)
                    .addFields(
                        { name: "제목", value: `${item.title}`, inline: true },
                        { name: "링크", value: `[바로가기](${item.link})`, inline: true },
                    )
                //interaction.channel.send(item.title + " " + item.link)
                // const Embed = new EmbedBuilder()
                // .setTitle(`${args}에 대한 검색결과`)
                // .addFields(
                //     { name: "제목", value: `${item.title}, [바로가기](${item.link})`, inline: true },
                // )
                // //.setColor("PURPLE")
                // .setTimestamp()

                // interaction.reply({ embeds: [Embed] })
                interaction.channel.send({ embeds: [embed], content: " " })
            })
        }).catch(e => {
            return interaction.reply(`오류가 발생했습니다 ${e}`)
        })
    }
}