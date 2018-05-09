const mongoose = require("mongoose");

var userSchema = mongoose.Schema(
    {
        username: String,
        email: String, 
        location: String, 
        country: String,
        topTracks: [String],
        topGenres: [String],
        topArtists: [String],
        url: String, 
        imageURL: String
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;
