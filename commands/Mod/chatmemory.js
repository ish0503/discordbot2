const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration
  ({ apiKey: process.env.CHATGPTKEY });

const history = []

openai = new OpenAIApi(configuration)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chatmemory")
    .setDescription("서버가 재부팅 되기 전까지 chatgpt는 기억하고 있어요.")
    .addStringOption((f) =>
      f
        .setName("메시지")
        .setRequired(true)
        .setDescription("메시지를 입력해 주세요")
        //.setMaxLength(1000)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

  // @param {import("discord.js").ChatInputCommandInteraction} interaction
  async execute(interaction) {
    await interaction.deferReply(); //{ephemeral: true}
    const reason_option = interaction.options.getString("메시지");

    history.push(reason_option)

    console.log(history)
    
    try {
      const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: reason_option }],
      });
      const res = await openai.createCompletion({
          model: "text-davinci-003",
          max_tokens: 2048,
          temperature: 0.5,
          prompt: reason_option
      })

      console.log(res["data"]["choices"][0]["text"])
      console.log(response["data"]["choices"][0]["message"]["content"])

      const embed = new EmbedBuilder()
      .addFields(
              { name: "gpt-3.5-turbo", value: `**${response["data"]["choices"][0]["message"]["content"]}**`, inline: true },
              { name: "text-davinci-003", value: `${reason_option + res["data"]["choices"][0]["text"]}`, inline: true },
      )
      .setTitle(reason_option) 
      .setColor("Blue")
      //.setDescription(res["data"]["choices"][0]["text"])

      await interaction.editReply({ embeds: [embed] });
      
    } catch (error) {
      console.log(error.response)
      return await interaction.editReply({content: `오류 발생 **${error.response.status}**, **${error.response.statusText} 이같은 오류가 계속 발생한다면, 문의 넣어주세요.**`, ephemeral: true})
    }
  },
};