const Discord = require('discord.js')
const constance = require('../../src/constance.json')

module.exports = {
    name: 'Play', 
    aliases: ['play', 'p'], 
    category: 'Music',
    description: 'Add music to queue',
    callback: async ({ message, args, text, client, prefix, instance }) => {
        const requestedBy = message.author.id
        const embed = new Discord.MessageEmbed().setColor(constance.config)

        const { guild, channel } = message

        if (!message.member.voice.channel) {
            message.react('🚫')
            return
        }
        
        if (client.player.isPlaying(message)) {
            
            if (!(client.voice.connections.get(guild.id).channel.id === message.member.voice.channel.id)) return message.react('🚫')

            let song = await client.player.addToQueue(message, {
                search: text,
                requestedBy
            })

            embed
            .setDescription(`${instance.messageHandler.get(guild, 'ADDED_TO_QUEUE')} [${song.name}](${song.url}) [<@${requestedBy}>]`)
            channel.send(embed)
        } else {
            let song = await client.player.play(message, {
                search: text,
                requestedBy
            })

            embed
            .setTitle(instance.messageHandler.get(guild, 'PLAYING_NOW'))
            .setDescription(`[${song.name}](${song.url}) [<@${requestedBy}>]`)
            channel.send(embed).then(msg => {
                if (!client.player.messagesCache) client.player.messagesCache = {}
                client.player.messagesCache[guild.id] = [channel.id, msg.id]
            })
            
            client.player.on('songChanged', (message, newSong, oldSong) => {
                if (client.player.messagesCache) {
                    if (client.player.messagesCache[message.guild.id]) {
                        let channelId = client.player.messagesCache[message.guild.id][0]
                        let messageId = client.player.messagesCache[message.guild.id][1]

                        const reqChannel = message.guild.channels.cache.get(channelId)
                        if (reqChannel) reqMessage = channel.messages.cache.get(messageId)
                        if (reqMessage) reqMessage.delete()
                    }
                } 
                embed
                .setDescription(`[${newSong.name}](${newSong.url}) [<@${newSong.requestedBy}>]`)
                message.channel.send(embed).then(msg => {
                    if (!client.player.messagesCache) client.player.messagesCache = {}
                    client.player.messagesCache[msg.guild.id] = [msg.channel.id, msg.id]
                })
            })
        }
    }
}