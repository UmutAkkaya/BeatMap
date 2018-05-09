const User = require('../../models/user');

/**
 * Creates a new track and saves it to the database
 */
const addUser =
    (req, res) => {
        console.log(req);
        const eventData = req.body;
        console.log(`Adding event with name: ${eventData.name} and location: ${eventData.location}`);
        const newUser =
            new User({
                username: eventData.username,
                email: eventData.email,
                location: eventData.location,
                country: eventData.country,
                topTracks: eventData.topTracks,
                topGenres: eventData.topGenres,
                topArtists: eventData.topArtists,
                url: eventData.url,
                imageURL: eventData.imageURL
            });
        console.log(newUser);
        newUser.save((err) => {
            if (err) {
                console.log(`Error at addUser: ${err}`);
                res.send(
                    500, JSON.stringify({
                        type: 1,
                        msg: 'Error saving new user to database'
                    }));
                return;
            }
            console.log("New user added successfully");
            res.send(200, 'User added successfully!');
        });
    }


const getUsers =
    (req, res) => {
        User.find().exec(function (err, users) {
            if (err) return console.error(err);
            res.send(users);
        })
    }
    
const getUser = (email) => {
    return new Promise(resolve => {
        User.findOne()
            .where('email').equals(email)
            .exec(function (err, user) {
                if (err) return null;
                resolve(user);
            });
    })
}    

const getAll = () => {
    return new Promise(resolve => {
        User.find()
            .exec(function (err, userList) {
                if (err) return null;
                resolve(userList);
            });
    })
}

const createFollowing = (user) => {
    User.findOne({ 'email': user.email}, function (err, user2) {
        if (err) return null;
        if (user2 === null || user2 === undefined) {
            let newUser = new User(user);
            newUser.save((err) => {
                if (err) {
                    console.log(`Error at addUser: ${err}`);
                    return null;
                }
                return newUser;
            });
        }
    });
}

module.exports = {
    addUser,
    getUsers,
    getUser,
    getAll,
    createFollowing
}