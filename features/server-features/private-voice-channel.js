
const privateVoiceChannelSchema = require('../../schemas/private-voice-channel-schema')
const { getNickName } = require('../../src/utils')

let pvcCache = {}

const fetchData = async (client) => {
    const results = await privateVoiceChannelSchema.find({})
    for (const result of results) {
        const guild = client.guilds.cache.get(result.guildId)
        if (guild) {
            const channel = guild.channels.cache.get(result.channelId)
            if (channel) {
                let envChannels = null
                if (pvcCache[result.guildId] && pvcCache[result.guildId].channels) envChannels = pvcCache[result.guildId].channels
                pvcCache[result.guildId] = { channelId: result.channelId, parentId: result.parentId }
                if (envChannels) pvcCache[result.guildId].channels = envChannels
            }
        }
    }
}

const populateCache = async (client) => {

    await fetchData(client)

    setTimeout(() => { populateCache(client) }, 1000 * 60 * 10)
}

module.exports = (client, instance) => {
    populateCache(client)

    client.on('voiceStateUpdate', (oldState, newState) => {
        if (!pvcCache[newState.guild.id] || !newState.channel) return 

        const { guild, channel, member } = newState

        if (channel.id == pvcCache[guild.id].channelId && (!oldState.channel || oldState.channel?.id != channel.id)) {
            guild.channels.create(`${getNickName(member)}`, { type: 'voice', parent: pvcCache[guild.id].parentId }).then(vc => {

                guild.channels.create(`🔐${getNickName(member)} - ${instance.messageHandler.get(guild, 'PRIVATE_ROOM_WAITING')}`, { type: 'voice', parent: pvcCache[guild.id].parentId }).then(waitVc => {
                    if (!pvcCache[guild.id].channels) pvcCache[guild.id].channels = {}
                    pvcCache[guild.id].channels[vc.id] = waitVc.id

                    waitVc.updateOverwrite(member, {
                        MOVE_MEMBERS: true
                    })
                })

                vc.updateOverwrite(guild.roles.everyone, {
                    CONNECT: false
                })
                vc.updateOverwrite(member, {
                    CONNECT: true,
                    MUTE_MEMBERS: true,
                    DEAFEN_MEMBERS: true,
                    MOVE_MEMBERS: true
                })

                newState.setChannel(vc)
            })
        }
    })

    client.on('voiceStateUpdate', (oldState, newState) => {
        if (!pvcCache[oldState.guild.id] || !oldState.channel || !pvcCache[oldState.guild.id].channels) return

        const { guild, channel } = oldState
        
        if (pvcCache[guild.id].channels[channel.id] && channel.members.size === 0) {
            channel.delete()
            guild.channels.cache.get(pvcCache[guild.id].channels[channel.id]).delete()
        }
    })
}

module.exports.config = {
    loadDBFirst: true
}

module.exports.fetch = fetchData