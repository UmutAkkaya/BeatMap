const Artist = require('../../models/artist');

/**
 * Create a new artist and saves it to the database
 */

 const createArtist = 
    (req, res) => {
        const artistData = req.body;
        const newArtist = 
            new Artist({ 
                name: artistData.name,
                tracks: artistData.tracks
            });

        let artist = Artist.findOne({'name': newArtist.name}, function (err, t) {
            if (err) return null;
            return t;
        });

        if (artist === null) {
            newArtist.save((err) => {
                if (err) {
                    res.send(
                        500, JSON.stringify({
                            type: 1,
                            msg: 'Error saving new artist to database'
                        })
                    )
                    return;
                }
                res.send(200, 'Artist added successfully!');
            });
        }

        res.send(200, 'Artist already exists!');
    }

const createNew =
    (name, tracks) => {
        const newArtist =
            new Artist({
                name: name,
                tracks: tracks
            });

        let artist = Artist.findOne({'name': newArtist.name}, function (err, t) {
            if (err) return null;
            return t;
        });

        if (artist === null) {
            newArtist.save((err) => {
                if (err) {
                    return null;
                }
                return newArtist;
            });
        }
        
        return artist;
    }
    
module.exports = {
    createArtist,
    createNew
}