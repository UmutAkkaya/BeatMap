const mongoose = require("mongoose");

var trackSchema = mongoose.Schema(
    {
        url: String, 
        name: String
    }
)

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;