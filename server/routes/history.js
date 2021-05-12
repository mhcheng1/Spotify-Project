const router = require('express').Router();
let History = require('../models/historyModel');

router.route('/').get((req, res) => {
  History.find()
    .then(history => res.json(history))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const artist = req.body.artist;
  const albumCover = req.body.albumCover;

  const newHistory = new History({title, artist, albumCover});

  newHistory.save()
    .then(() => res.json('added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;