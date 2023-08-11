const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");
const ket111 = "sk-BVR382wIeuX9vA6uFShUT3"
const ket222 = "BlbkFJlbUrFogBcHyz8BarKwew"
const configuration = new Configuration
  ({ apiKey: ket111 + ket222 });

var cooldown = false

openai = new OpenAIApi(configuration)

const chapGPT = async (prompt, prompt2) => {
  try {
    const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt2 + " (Reply in 1000 words or less)" }],
    });
    //if (response["data"]["choices"][0]["message"]["content"] != "Promise { <pending> }")  {
    console.log(response["data"]["choices"][0]["message"]["content"])
    prompt.channel.send(prompt2 + "(이)라는 질문에 답변: " + "**" + response["data"]["choices"][0]["message"]["content"] + "**")
  } catch (error) {
    return interaction.reply({
        content: `**chatgpt가 이미 다른 질문에 생각중입니다**`,
    });
  }
  cooldown = false
  //prompt.reply(response["data"]["choices"][0]["message"]["content"]);
  //prompt.channel.stopTyping();
  // return response["data"]["choices"][0]["message"]["content"];
  // };
  //return response["data"]["choices"][0]["message"]["content"];
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat")
    .setDescription("챗 gpt 3.5와 채팅해봐요")
    .addStringOption((f) =>
      f
        .setName("메시지")
        .setRequired(true)
        .setDescription("메시지를 입력해 주세요")
        .setMaxLength(1000)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

   // @param {import("discord.js").ChatInputCommandInteraction} interaction
  async execute(interaction) {
    if (cooldown) interaction.reply({
        content: `**chatgpt가 이미 다른 질문에 생각중입니다**`,
    }); return
    const reason_option = interaction.options.getString("메시지");

    try {
      //cooldown = true
      interaction.reply("잠시만 기다려주세요..")
      //interaction.channel.startTyping();
      console.log(reason_option)
      chapGPT(interaction, reason_option);
    } catch (error) {
      //cooldown = false
      return interaction.reply({
        content: `**메시지전송에 실패했습니다**`,
      });
    }
  },
};
