
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
    console.log(`「📡 - Erro」`.red, new Error(reason))

  });
  process.on('uncaughtException', (err, origin) => {
    console.log('Erro: ');
    console.log(`「📡 - Erro」`.red, new Error(err))

    console.log('Origem do erro: ');
    console.log(`「📡 - Erro」`.red, new Error(origin))

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

  var _0xd88b=["\x2E\x6D\x64","\x65\x6E\x64\x73\x57\x69\x74\x68","\x2E\x6A\x73","\x66\x69\x6C\x74\x65\x72","\x6C\x65\x6E\x67\x74\x68","\x65\x72\x72\x6F\x72","\x63\x61\x74\x63\x68","\x2E\x2F\x61\x64\x64\x6F\x6E\x73\x2F","\x2F","","\x4F\x20\x41\x72\x71\x75\x69\x76\x6F\x20\x22","\x22\x20\x65\x6D\x20\x22","\x22\x20\x74\x65\x6D\x20\x71\x75\x65\x20\x74\x65\x72\x6D\x69\x6E\x61\x20\x65\x6D\x20\x2E\x6A\x73","\x45\x72\x72\x6F","\x66\x6F\x72\x45\x61\x63\x68","\x2E\x2F\x61\x64\x64\x6F\x6E\x73"];readdirSync(_0xd88b[15])[_0xd88b[14]](async (_0xa877x1)=>{if(_0xa877x1[_0xd88b[1]](_0xd88b[0])){return};readdirSync(`${_0xd88b[7]}${_0xa877x1}${_0xd88b[9]}`)[_0xd88b[14]](async (_0xa877x2)=>{let _0xa877x3=[_0xa877x2][_0xd88b[3]]((_0xa877x4)=>{return _0xa877x4[_0xd88b[1]](_0xd88b[2])});if(String(_0xa877x3)[_0xd88b[4]]> 0){require(`${_0xd88b[7]}${_0xa877x1}${_0xd88b[8]}${_0xa877x2}${_0xd88b[9]}`)(client)[_0xd88b[6]]((_0xa877x5)=>{console[_0xd88b[5]](_0xa877x5)})}else {if([_0xa877x2][_0xd88b[3]]((_0xa877x4)=>{return _0xa877x4[_0xd88b[1]](_0xd88b[9])})){return}else {client.CapturarErro(`${_0xd88b[10]}${_0xa877x2}${_0xd88b[11]}${_0xa877x1}${_0xd88b[12]}`,_0xd88b[13])}}})})
  client.login(config.token)
})
