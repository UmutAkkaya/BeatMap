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
        newArtist.save((err) =>{
            if(err){
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

module.exports = {
    createArtist
}