const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const ket111 = "sk-BVR382wIeuX9vA6uFShUT3"
const ket222 = "BlbkFJlbUrFogBcHyz8BarKwew"
const configuration = new Configuration
  ({ apiKey: ket111 + ket222 });

const openai = new OpenAIApi(configuration);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderation")
    .setDescription("콘텐츠가 OpenAI의 사용 정책을 준수하는지 확인해봐요")
    .addStringOption((f) =>
      f
        .setName("moderation")
        .setRequired(true)
        .setDescription("메시지를 입력해 주세요")
        .setMaxLength(1000)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

   // @param {import("discord.js").ChatInputCommandInteraction} interaction
  async execute(interaction) {
    await interaction.deferReply(); //{ephemeral: true}
    const reason_option = interaction.options.getString("메시지");

    try {
     const response = await openai.createModeration({
          input: reason_option,
      });

       const embed = new EmbedBuilder()
       .addFields(
         { name: "sexual", value: `**${response.category_scores["sexual"]}**`, inline: true },
         { name: "hate", value: `**${response.category_scores["hate"]}**`, inline: true },
         { name: "harassment", value: `**${response.category_scores["harassment"]}**`, inline: true },
         { name: "self-harm", value: `**${response.category_scores["self-harm"]}**`, inline: true },
         { name: "sexual/minors", value: `**${response.category_scores["sexual/minors"]}**`, inline: true },
         { name: "hate/threatening", value: `**${response.category_scores["hate/threatening"]}**`, inline: true },
         { name: "violence/graphic", value: `**${response.category_scores["violence/graphic"]}**`, inline: true },
         { name: "self-harm/intent", value: `**${response.category_scores["self-harm/intent"]}**`, inline: true },
         { name: "self-harm/instructions", value: `**${response.category_scores["self-harm/instructions"]}**`, inline: true },
         { name: "harassment/threatening", value: `**${response.category_scores["harassment/threatening"]}**`, inline: true },
         { name: "violence", value: `**${response.category_scores["violence"]}**`, inline: true },
       )
       .setTitle(reason_option) 
       .setColor("Red")
       //.setDescription(res["data"]["choices"][0]["text"])

      await interaction.editReply(response.data.data[0].url);
      
    } catch (error) {
      console.log(error.response)
      return await interaction.editReply({content: `오류 발생 **${error.response.status}**, **${error.response.statusText} 이같은 오류가 계속 발생한다면, 문의 넣어주세요.**`, ephemeral: true})
    }
  },
};