const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const serverStatSchema = mongoose.Schema({
    guildId: reqString,
    dateChannelId: reqString,
    onlineChannelId: reqString
})
    

module.exports = mongoose.model('server-stat-channels', serverStatSchema)