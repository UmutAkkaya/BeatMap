const mongoose = require("mongoose");

var artistSchema = mongoose.Schema(
    {
        name: String, 
        tracks: [mongoose.Schema.Types.ObjectId]
    }
)

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
