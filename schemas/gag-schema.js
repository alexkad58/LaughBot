const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const gagSchema = mongoose.Schema({
    userId: reqString,
    gag: reqString
})

module.exports = mongoose.model('gag-sets', gagSchema)