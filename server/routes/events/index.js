const Event = require('../../models/event');

/**
 * Creates a new event and saves it to the database
 */
const createEvent =
    (req, res) => {
        console.log(req);
        const eventData = req.body;
        console.log(`Adding event with name: ${eventData.name} and location: ${eventData.location}`);
        const newEvent =
            new Event({
                name: eventData.name,
                location: eventData.location
            });
        console.log(newEvent);
        newEvent.save((err) => {
            if (err) {
                console.log(`Error at createEvent: ${err}`);
                res.send(
                    500, JSON.stringify({
                        type: 1,
                        msg: 'Error saving new event to database'
                    }));
                return;
            }
            console.log("New event added successfully");
            res.send(200, 'Event added successfully!');
        });
    }


module.exports = {
    createEvent
}