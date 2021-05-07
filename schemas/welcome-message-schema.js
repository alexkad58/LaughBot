const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const welcomeMessageSchema = mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    text: reqString
})

module.exports = mongoose.model('welcome-message-schema', welcomeMessageSchema)