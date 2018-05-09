'use strict';

const Spotify = require('spotify-web-api-node');
const querystring = require('querystring');
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const eventRoutes = require('./routes/events');
const artistRoutes = require('./routes/artists');
const trackRoutes = require('./routes/tracks');
const userRoutes = require('./routes/users');
const genreRoutes = require('./routes/genres');

// configure the express server
const CLIENT_ID = '8f0471703d644ad694d2f1532ebf8388';
const CLIENT_SECRET = 'dd96c90193fb45958617e6447c40e994';
const REDIRECT_URI = 'http://localhost:3000/callback';
const STATE_KEY = 'spotify_auth_state';
// your application requests authorization
const scopes = ['user-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-read-email',
    'user-follow-read',
    'user-read-recently-played',
    'user-top-read'];

// configure spotify
const spotifyApi = new Spotify({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
});

/** Generates a random string containing numbers and letters of N characters */
const generateRandomString = N => (Math.random().toString(36) + Array(N).join('0')).slice(2, N + 2);

/**
 * The /login endpoint
 * Redirect the client to the spotify authorize url, but first set that user's
 * state in the cookie.
 */
router.get('/login', (_, res) => {
    const state = generateRandomString(16);
    res.cookie(STATE_KEY, state);
    res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
});


router.get('/getMarkers', (req, res) => {
    userRoutes.getAll().then(users => {
        let markers = [];

        users.forEach(u => {
            if (u.location !== null && u.location !== undefined) {

                let marker = {
                    topGenres: u.topGenres,
                    topArtists: u.topArtists,
                    topTracks: u.topTracks,
                    latitude: JSON.parse(u.location).latitude,
                    longitude: JSON.parse(u.location).longitude
                };

                markers.push(marker);
            }
        });

        res.send({markers: markers})
    })
})

/**
 * The /callback endpoint - hit after the user logs in to spotifyApi
 * Verify that the state we put in the cookie matches the state in the query
 * parameter. Then, if all is good, redirect the user to the user page. If all
 * is not good, redirect the user to an error page
 */

router.post('/setLocation', (req, res) => {
    const {email, location} = req.body;

    userRoutes.getUser(email).then(user => {
        if (user !== null || user === undefined || location === undefined) {
            user.location = JSON.stringify(location);
            user.save();
        }
    });
});

router.get('/callback', (req, res) => {
    const {code, state} = req.query;
    const storedState = req.cookies ? req.cookies[STATE_KEY] : null;
    // first do state validation
    if (state === null || state !== storedState) {
        res.redirect('/#/error/state mismatch');
        // if the state is valid, get the authorization code and pass it on to the client
    } else {
        res.clearCookie(STATE_KEY);
        // Retrieve an access token and a refresh token
        spotifyApi.authorizationCodeGrant(code).then(data => {
            const {expires_in, access_token, refresh_token} = data.body;

            // Set the access token on the API object to use it in later calls
            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);


            const newUser = {
                username: '',
                email: '',
                location: '',
                country: '',
                topTracks: [],
                topGenres: [],
                topArtists: [],
                url: '',
                imageURL: ''
            };


            // use the access token to access the Spotify Web API
            spotifyApi.getMe().then(({body}) => {
                userRoutes.getUser(body.email).then(user => {
                    if (user === null || user === undefined) {
                        createNewUser(body)
                    } else {
                        updateExisting(user);
                    }
                });
            });

            // we can also pass the token to the browser to make requests from there
            res.redirect(`/#/user/${access_token}/${refresh_token}`);
        }).catch(err => {
            res.redirect('/#/error/invalid token');
        });
    }
});

function updateExisting(user) {
    spotifyApi.getMyTopArtists().then(result => {
        user.topArtists = result.items.map(r => r.name)

        let genres = [].concat.apply([], result.items.map(r => r.genres));
        let uniqueGenres = genres.filter(function (item, pos) {
            return genres.indexOf(item) == pos;
        });

        user.topGenres = uniqueGenres;

        spotifyApi.getMyRecentlyPlayedTracks().then(tracks => {
            user.topTracks = tracks.items.map(t => [t.name, t.external_urls.spotify].join('='))

            user.save();
        })
    });
}


function createNewUser(body) {

    let newUser = {};

    newUser.username = body.id;
    newUser.email = body.email;
    newUser.location = '';
    newUser.country = body.country;
    newUser.topTracks = [];
    newUser.topGenres = [];
    newUser.topArtists = [];
    newUser.url = body.external_urls.spotify;
    newUser.imageURL = body.images[0].url;


    spotifyApi.getMyTopArtists({limit: 5}).then(result => {
        let artists = result.body;

        newUser.topArtists = artists.items.map(r => r.name)

        let genres = [].concat.apply([], artists.items.map(r => r.genres));
        let uniqueGenres = genres.filter(function (item, pos) {
            return genres.indexOf(item) == pos;
        });

        newUser.topGenres = uniqueGenres;

        spotifyApi.getMyRecentlyPlayedTracks().then(results2 => {
            let tracks = results2.body;

            newUser.topTracks = tracks.items.map(t => [t.track.name, t.track.external_urls.spotify].join('='))

            userRoutes.createFollowing(newUser);
        })
    });
}

router.post('/events', eventRoutes.createEvent);
router.post('/artist', artistRoutes.createArtist);
router.get('/events', eventRoutes.getEvents);
router.post('/tracks', trackRoutes.addTrack);
router.post('/genres', genreRoutes.addGenre);
router.post('/users', userRoutes.addUser);
router.get('/users', userRoutes.getUsers);

module.exports = router;
