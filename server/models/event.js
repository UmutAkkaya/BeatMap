const mongoose = require("mongoose");

var eventSchema = mongoose.Schema(
    {
        name: String, 
        location: String
    }
)

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;