const Discord = require('discord.js')
const WOKcommands = require('wokcommands')
const { Player } = require('discord-music-player')

const constance = require('./src/constance.json')

require('dotenv').config()

const client = new Discord.Client({
    partials: ['MESSAGE', 'REACTION'],
	disableEveryone: false
})

client.player = new Player(client)

client.on('ready', () => {
    console.log(`\nКлиент запущен!\n`)

    const dbOptions = {
		keepAlive: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	}

    new WOKcommands(client, {
        commandDir: 'commands',
        featuresDir: 'features',
        showWarns: false,
        messagesPath: 'src/messages.json',
        dbOptions
    })
        .setMongoPath(process.env.MONGO_URI)
        .setColor(constance.color)
        .setDefaultPrefix('lb!')
        .setCategorySettings([
            {
                name: 'Music',
                emoji: '🎶'
            },
            {
                name: 'Configuration',
                emoji: '⚙',
                hidden: true
            },
            {
                name: 'Gags',
                emoji: '😂'
            },
            {
                name: 'Development',
                emoji: '🛑',
                hidden: true
            }
        ])
})

client.login(process.env.DISCORD_TOKEN)
