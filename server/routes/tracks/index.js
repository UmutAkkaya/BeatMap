const Track = require('../../models/tracks');

/**
 * Creates a new track and saves it to the database
 */
const addTrack =
    (req, res) => {
        console.log(req);
        const eventData = req.body;
        console.log(`Adding event with name: ${eventData.name} and location: ${eventData.location}`);
        const newTrack =
            new Track({
                url: eventData.url,
                name: eventData.name
            });
        console.log(newTrack);
        newTrack.save((err) => {
            if (err) {
                console.log(`Error at addTrack: ${err}`);
                res.send(
                    500, JSON.stringify({
                        type: 1,
                        msg: 'Error saving new track to database'
                    }));
                return;
            }
            console.log("New track added successfully");
            res.send(200, 'Track added successfully!');
        });
    }


module.exports = {
    addTrack
}