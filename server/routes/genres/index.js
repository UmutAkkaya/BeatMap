const Genre = require('../../models/genre');

/**
 * Creates a new track and saves it to the database
 */
const addGenre =
    (req, res) => {
        console.log(req);
        const eventData = req.body;
        console.log(`Adding event with name: ${eventData.name} and location: ${eventData.location}`);
        const newGenre =
            new Genre({
                url: eventData.url,
                name: eventData.name
            });
        console.log(newGenre);

        let genre = Genre.findOne({'name': newGenre.name}, function (err, t) {
            if (err) return null;
            return t;
        });

        if (genre === null) {
            newGenre.save((err) => {
                if (err) {
                    console.log(`Error at addGenre: ${err}`);
                    res.send(
                        500, JSON.stringify({
                            type: 1,
                            msg: 'Error saving new Genre to database'
                        }));
                    return;
                }
                console.log("New Genre added successfully");
                res.send(200, 'Genre added successfully!');
            });
        }

        res.send(200, 'Genre already exists!');
    }


module.exports = {
    addGenre
}