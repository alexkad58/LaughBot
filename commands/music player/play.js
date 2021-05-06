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

        if (!message.member.voice.channel) {
            message.react('🚫')
            return
        }
        
        if (client.player.isPlaying(message)) {
            
            if (!(client.voice.connections.get(message.guild.id).channel.id === message.member.voice.channel.id)) return message.react('🚫')

            let song = await client.player.addToQueue(message, {
                search: text,
                requestedBy
            })

            embed
            .setDescription(`Добавил в очередь [${song.name}](${song.url}) [<@${requestedBy}>]`)
            message.channel.send(embed)
        } else {
            let song = await client.player.play(message, {
                search: text,
                requestedBy
            })

            embed
            .setTitle('Сейчас играет')
            .setDescription(`[${song.name}](${song.url}) [<@${requestedBy}>]`)
            message.channel.send(embed)
            
            client.player.on('songChanged', (oldSong, newSong, skipped, repeatMode, repeatQueue) => {
                embed
                .setDescription(`[${newSong.name}](${newSong.url}) [<@${newSong.requestedBy}>]`)
                message.channel.send(embed)
            })
        }
    }
}