const mongoose = require("mongoose");

var artistSchema = mongoose.Schema(
    {
        name: String, 
        tracks: String
    }
)

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
