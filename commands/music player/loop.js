
module.exports = {
    name: 'Loop', 
    aliases: ['loop'], 
    category: 'Music',
    description: 'Loop current song',
    callback: async ({ message, client }) => {
        if (!message.member.voice.channel) {
            message.react('🚫')
            return
        }
        if (client.player.getQueue(message)) {
            if (!(client.voice.connections.get(message.guild.id).channel.id === message.member.voice.channel.id)) return message.react('🚫')
            client.player.toggleLoop(message)
            message.react('👌')
        } else {
            message.react('🚫')
            return
        }
    }
}