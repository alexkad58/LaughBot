
module.exports = {
    name: 'Skip', 
    aliases: ['skip', 's'], 
    category: 'Music',
    description: 'Skip song in queue',
    callback: async ({ message, client }) => {
        if (!message.member.voice.channel) {
            message.react('🚫')
            return
        }
        if (client.player.getQueue(message)) {
            if (!(client.voice.connections.get(message.guild.id).channel.id === message.member.voice.channel.id)) return message.react('🚫')
            client.player.skip(message)
            message.react('👌')
        } else {
            message.react('🚫')
            return
        }
    }
}