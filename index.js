
require('colors')
const { PermNames, Inicializador } = require('./functions/functions')
const config = require("js-yaml").load(require('fs').readFileSync(`./config.yaml`, 'utf8'))
const { Collection, Partials, ActivityType, EmbedBuilder, PermissionsBitField, Client, GatewayIntentBits, InteractionType } = require("discord.js")
const { readdirSync, readdir } = require("fs")
Inicializador().then(() => {
  const client = new Client({
    presence: {
      status: 'online',
      afk: false,
      activities: [{
        name: `HightLand`,
        type: ActivityType.Streaming,
        url: "https://twitch.tv/#"
      }],
    },
    partials: [Partials.Message],
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMessages,

      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildMembers,

      GatewayIntentBits.GuildEmojisAndStickers,
      GatewayIntentBits.GuildInvites,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.GuildScheduledEvents,
      GatewayIntentBits.GuildIntegrations,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessageTyping
    ]
  });
  client.setMaxListeners(0);
  module.exports = client

  client.on('interactionCreate', async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
      if (!interaction.commandGuildId) {
        return interaction.reply({ content: `${interaction.user}. Infelizmente não achei esse Comando`, ephemeral: true })
      }
      let cmd;
      try {
        if (client.slashCommands.has(interaction.commandName + interaction?.options.getSubcommand())) {
          cmd = client.slashCommands.get(interaction.commandName + interaction?.options.getSubcommand());
        }
      } catch {
        if (client.slashCommands.has("normal" + interaction.commandName)) {
          cmd = client.slashCommands.get("normal" + interaction.commandName);
        }
      }
      if (!cmd) return interaction.reply({ content: `${interaction.user}. Error`, ephemeral: true });
      try {
        if (cmd.perm && cmd.perm.length > 0 && !interaction?.member.permissions.has(cmd.perm)) {
          return interaction?.reply({
            ephemeral: true,
            embeds: [new EmbedBuilder()
              .setColor(config.Cor)
              .setTitle(":x: **Você não está autorizado a executar este comando!**")
              .setDescription(`**Você precisa destas permissões:**\n> \`${PermNames(new PermissionsBitField(cmd.perm))}\``)
            ]
          }).catch((err) => { client.CapturarErro(new Error(err), "Erro") });
        }
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction)
      } catch (err) { client.CapturarErro(new Error(err), "Erro") }
    }
  })

  process.on('unhandledRejection', reason => {
    console.log('\n');
    client.CapturarErro(new Error(reason), "Erro")
  });
  process.on('uncaughtException', (err, origin) => {
    console.log('Erro: ');
    client.CapturarErro(new Error(err), "Erro")
    console.log('Origem do erro: ');
    client.CapturarErro(new Error(origin), "Erro")
  });

  client.slashCommands = new Collection()
  client.TotalSlashComandos = new Collection()
  client.Addons = new Collection()
  client.DataBases = new Collection()


  readdirSync("./handlers").forEach(async (dir) => {
    if ([dir].filter((file) => file.endsWith(".js"))) {
      require(`./handlers/${dir}`)(client).catch((err) => { client.CapturarErro(new Error(err), "Erro") })
    } else { client.CapturarErro("Esse arquivo não termina em .js", "Erro") }
  })
  var _0x1993=["\x2E\x6A\x73","\x65\x6E\x64\x73\x57\x69\x74\x68","\x66\x69\x6C\x74\x65\x72","\x6C\x65\x6E\x67\x74\x68","\x65\x72\x72\x6F\x72","\x63\x61\x74\x63\x68","\x2E\x2F\x61\x64\x64\x6F\x6E\x73\x2F","\x2F","","\x4F\x20\x41\x72\x71\x75\x69\x76\x6F\x20\x22","\x22\x20\x65\x6D\x20\x22","\x22\x20\x74\x65\x6D\x20\x71\x75\x65\x20\x74\x65\x72\x6D\x69\x6E\x61\x20\x65\x6D\x20\x2E\x6A\x73","\x45\x72\x72\x6F","\x66\x6F\x72\x45\x61\x63\x68","\x2E\x2F\x61\x64\x64\x6F\x6E\x73"];readdirSync(_0x1993[14])[_0x1993[13]](async (_0x6c51x1)=>{readdirSync(`${_0x1993[6]}${_0x6c51x1}${_0x1993[8]}`)[_0x1993[13]](async (_0x6c51x2)=>{let _0x6c51x3=[_0x6c51x2][_0x1993[2]]((_0x6c51x4)=>{return _0x6c51x4[_0x1993[1]](_0x1993[0])});if(String(_0x6c51x3)[_0x1993[3]]> 0){require(`${_0x1993[6]}${_0x6c51x1}${_0x1993[7]}${_0x6c51x2}${_0x1993[8]}`)(client)[_0x1993[5]]((_0x6c51x5)=>{console[_0x1993[4]](_0x6c51x5)})}else {if([_0x6c51x2][_0x1993[2]]((_0x6c51x4)=>{return _0x6c51x4[_0x1993[1]](_0x1993[8])})){return}else {client.CapturarErro(`${_0x1993[9]}${_0x6c51x2}${_0x1993[10]}${_0x6c51x1}${_0x1993[11]}`,_0x1993[12])}}})})
  client.login(config.token)
})