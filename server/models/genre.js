const mongoose = require("mongoose");

var genreSchema = mongoose.Schema(
    {
        name: String,
        location: String
    }
)

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;