const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

// db functions
const {
    getUserById,
    createUser,
    login,
    getUserByEmail,
    createResetCode,
    getCodeByEmail,
    updateUser,
    updateUserProfilePicture,
    updateUserBio,
    getRecentUsers,
    searchUsers,
} = require("./db");

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

// Route: find people
app.get("/api/users/recent", (request, response) => {
    if (!request.session.userID) {
        response.json(null);
        return;
    }

    console.log("get /api/users/recent?limit=5", request.query);

    getRecentUsers(request.query).then((users) => {
        response.json(users);
    });
});

app.get("/api/users/search", async (request, response) => {
    if (!request.session.userID) {
        response.json(null);
        return;
    }
    const searchResults = await searchUsers(request.query);
    response.json(
        searchResults.filter((user) => user.id !== request.session.userID)
    );
});

// Route: register
app.get("/api/users/me", (request, response) => {
    // console.log("request.session.userID", request.session.userID);
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

// router: profile picture load
app.post("/api/users/profile", (request, response) => {
    // fake url, need to replace it with multer and s3 middlewares
    const url = `PIC_URL`;
    // console.log("POST /api/users/profile", url);

    updateUserProfilePicture({
        ...request.session,
        profile_picture_url: url,
    })
        .then((user) => {
            response.json(user.profile_picture_url);
        })
        .catch((error) => {
            console.log("POST /api/users/profile", error);
            response.statusCode(500).json({ error: "upload image fails" });
        });
});

// router: update user bio
app.post("/api/users/bio", (request, response) => {
    updateUserBio({
        id: request.session.userID,
        ...request.body,
    })
        .then((bio) => {
            response.json(bio);
        })
        .catch((error) => {
            console.log("POST /api/users/bio", error);
            response.statusCode(500).json({ error: "upload bio fails" });
        });
});

// router: reset
app.post("/api/reset/email", (request, response) => {
    console.log("POST /api/reset/email");

    getUserByEmail(request.body)
        .then((user) => {
            // console.log("user", user);
            if (!user) {
                response
                    .status(401)
                    .json({ error: "this email is not registered" });
                return;
            }

            // store the email in the cookies for verify step
            request.session.currentEmail = user.email;

            // generate code
            const code = "31415";

            createResetCode(user.email, code)
                .then((currentCode) => {
                    response.json(currentCode);
                })
                .catch((error) => {
                    console.log("create reset code", error);

                    response
                        .status(500)
                        .json({ error: "Something went wrong" });
                });
        })
        .catch((error) => {
            console.log("POST /api/reset/email", error);

            response.status(500).json({ error: "Something went wrong" });
        });
});

app.post("/api/reset/verify", (request, response) => {
    console.log("POST /api/reset/verify");
    console.log(request.body);

    let currentEmail = request.session.currentEmail;

    getCodeByEmail({ email: currentEmail })
        .then((fundCode) => {
            console.log("fundCode", fundCode);
            if (!fundCode) {
                response
                    .status(401)
                    .json({ error: "no user for this code found" });
                return;
            }

            let verifyCode = fundCode.code;
            if (request.body.code !== verifyCode) {
                response.status(401).json({ error: "this code not match" });
                return;
            }

            updateUser({ email: currentEmail, password: request.body.password })
                .then((newUser) => {
                    response.json(newUser);
                })
                .catch((error) => {
                    console.log("update password", error);

                    response
                        .status(500)
                        .json({ error: "Something went wrong" });
                });
        })
        .catch((error) => {
            console.log("POST /api/reset/verify", error);

            response.status(500).json({ error: "Something went wrong" });
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
