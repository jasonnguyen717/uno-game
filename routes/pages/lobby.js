var express = require("express");
const Games = require("../../db/games");
var router = express.Router();

router.get('/', function (request, response) {
  const { username, userId, authenticated } = request.session;
  Games.all(userId)
  .then((games) => {
  console.log({ authenticated });
  response.render('protected/lobby', { title: "Lobby", layout: "protected/home", username, userId, games, authenticated });
  })
  .catch((error) => {
    console.log(error);
    response.redirect("error");
  })
});

module.exports = router;
