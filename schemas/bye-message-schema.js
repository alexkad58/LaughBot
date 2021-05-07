const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const byeMessageSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    text: reqString
})

module.exports = mongoose.model('bye-message-schema', byeMessageSchema)