const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

// db functions
const { getUserById, createUser, login } = require("./db");

// Middlewares

const { SESSION_SECRET } = require("../secrets.json");
// set up cookies
app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14, // two weeks of cookie validity
    })
);

app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));

// Route: register
app.get("/api/users/me", (request, response) => {
    console.log("request.session.userID", request.session.userID);
    if (!request.session.userID) {
        response.json(null);
        return;
    }

    getUserById(request.session.userID).then((user) => {
        response.json(user);
    });
});

app.post("/api/users", (request, response) => {
    createUser({ ...request.body })
        .then((newUser) => {
            request.session.userID = newUser.id;
            response.json(newUser);
        })
        .catch((error) => {
            console.log("POST /api/users", error);
            // add an error message about duplicate email
            if (error.constraint === "users_email_key") {
                response.status(400).json({ error: "Email already in use" });
                return;
            }
            response.status(500).json({ error: "Something went wrong" });
        });
});

// Route: login
app.get("/api/login", (request, response) => {
    console.log("request.session.userID", request.session.userID);
    if (!request.session.userID) {
        response.json(null);
        return;
    }

    getUserById(request.session.userID).then((user) => {
        response.json(user);
    });
});

app.post("/api/login", (request, response) => {
    login(request.body)
        .then((user) => {
            if (!user) {
                response.status(401).json({ error: "wrong credentials" });
                return;
            }

            request.session.userID = user.id;
            response.json(user);
        })
        .catch((error) => {
            console.log("POST /api/login", error);

            response.status(500).json({ error: "Something went wrong" });
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
