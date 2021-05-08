const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const privateVoiceChannelSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    parentId: reqString
})

module.exports = mongoose.model('private-voice-channel', privateVoiceChannelSchema)