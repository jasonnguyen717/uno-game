var express = require("express");
var router = express.Router();
const Users = require("../../db/users");
// ~1:42:00 11/10 lecture for refactor

router.get("/login", (request, response) => {
  response.render("public/login", { title: "Log In", layout: "public/auth" });
});

router.post("/login", (request, response) => {
  const { username, password } = request.body;

  Users.login({ username, password })
    .then(({ id }) => {
      request.session.authenticated = true;
      request.session.userId = id;
      request.session.username = username;

      response.redirect("/lobby");
    })
    .catch((error) => {
      console.log({ error });
      response.redirect("/auth/login");
    });
});

router.get("/signup", (request, response) => {
  response.render("public/signup", { title: "Sign Up", layout: "public/auth" });
});

router.post("/signup", (request, response) => {
  const { username, password, email } = request.body;

  Users.register({ username, password, email })
    .then(({ id, username }) => {
      request.session.authenticated = true;
      request.session.userId = id;
      request.session.username = username;

      response.redirect("/lobby");
    })
    .catch((error) => {
      console.log({ error });
      response.render("public/signup", {
        title: "Sign Up",
        layout: "public/auth",
        error: "Username already in use",
      });
    });
});

router.get("/logout", (request, response) => {
  request.session.destroy();
  response.redirect("/");
});

module.exports = router;
