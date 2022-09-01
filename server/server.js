const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { Server } = require("http");
const socketConnect = require("socket.io");

const { uploader } = require("./uploader");
const { Bucket, s3Upload } = require("./s3");
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
    getCurrentFriendshipStatus,
    createFriendshipRequest,
    deleteFriendship,
    acceptFriendshipRequest,
    getFriendships,
    getRecentChatMessages,
    saveChatMessage,
} = require("./db");

// build app
const app = express();

// Middlewares

// set up cookies
const { SESSION_SECRET } = require("../secrets.json");
const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days of cookie validity
});
app.use(cookieSessionMiddleware);
// other middlewares
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));

// set up server and socket
const server = Server(app);

const io = socketConnect(server, {
    allowRequest: (request, callback) =>
        callback(
            null,
            request.headers.referer.startsWith(`http://localhost:3000`)
        ),
});

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", async (socket) => {
    // console.log("[social: socket] incoming socket connection", socket.id);
    const { userID } = socket.request.session;
    if (!userID) {
        return socket.disconnect(true);
    }

    // retrieve the latest 10 messages
    const latestMessages = await getRecentChatMessages();
    // send them when a client connects
    socket.emit("recentMessages", latestMessages.reverse());

    // listen for when the connected user send a message
    socket.on("newMessage", async (text) => {
        //store the message in the db
        const newMessage = await saveChatMessage({
            userID: userID,
            newMessage: text,
        });

        const senderInfo = await getUserById(newMessage.sender_id);
        // broadcast the message to all connected users
        io.emit("broadcastMessage", {
            ...newMessage,
            first_name: senderInfo.first_name,
            last_name: senderInfo.last_name,
            profile_picture_url: senderInfo.profile_picture_url,
        });
    });
});

// Route: find people
app.get("/api/users/recent", (request, response) => {
    // if (!request.session.userID) {
    //     response.json(null);
    //     return;
    // }

    // better to attract the unsigned user here

    // console.log("get /api/users/recent", request.query);

    getRecentUsers(request.query).then((users) => {
        response.json(users);
    });
});

app.get("/api/users/search", async (request, response) => {
    // if (!request.session.userID) {
    //     response.json(null);
    //     return;
    // }

    // better to attract the unsigned user here

    const searchResults = await searchUsers(request.query);
    response.json(
        searchResults.filter((user) => user.id !== request.session.userID)
    );
});

// Route: homepage
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

// Route: show other users
app.get("/api/users/:user_id", (request, response) => {
    // cannot see the detail of other users before log in
    if (!request.session.userID) {
        response.json(null);
        return;
    }

    // request.params.user_id is a string
    if (request.params.user_id == request.session.userID) {
        response.status(401).json({ error: "this id is current logged user" });
        return;
    }

    getUserById(request.params.user_id).then((user) => {
        if (!user) {
            response.status(401).json({ error: "no user with this id found" });
            return;
        }

        response.json(user);
    });
});

// Router: part 8 - friendship connection
app.get("/api/friendships", async (request, response) => {
    const friendships = await getFriendships(request.session.userID);

    response.json(friendships);
});

app.get("/api/friendships/:user_id", async (request, response) => {
    const friendship = await getCurrentFriendshipStatus({
        ...request.session,
        ...request.params,
    });

    if (!friendship) {
        response.json({ text: "Make Friend Request" });
        return;
    }

    if (friendship.accepted) {
        response.json({
            text: "End Friendship",
            id: friendship.id,
        });
        return;
    }

    if (friendship.recipient_id == request.session.userID) {
        response.json({ text: "Accept Friend Request", id: friendship.id });
        return;
    }

    response.json({ text: "Cancel Friend Request", id: friendship.id });
});

app.post("/api/friendships/:user_id", async (request, response) => {
    console.log("POST /api/friendships request.body", request.body);

    const { currentBtnText, currentId } = request.body;

    if (currentBtnText === "Make Friend Request") {
        const friendship = await createFriendshipRequest({
            ...request.session,
            ...request.params,
        });

        response.json({ text: "Cancel Friend Request", id: friendship.id });
        return;
    }

    if (currentBtnText === "End Friendship") {
        await deleteFriendship(currentId);
        response.json({ text: "Make Friend Request", id: 0 });
        return;
    }

    if (currentBtnText === "Cancel Friend Request") {
        await deleteFriendship(currentId);
        response.json({ text: "Make Friend Request", id: 0 });
        return;
    }

    await acceptFriendshipRequest(currentId);
    response.json({ text: "End Friendship", id: currentId });
});

// Route: register
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
app.post(
    "/api/users/profile",
    uploader.single("file"),
    s3Upload,

    (request, response) => {
        const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;

        console.log("POST /api/users/profile", url);

        updateUserProfilePicture({
            ...request.session,
            profile_picture_url: url,
        })
            .then((user) => {
                response.json(user);
            })
            .catch((error) => {
                console.log("POST /api/users/profile", error);
                response.statusCode(500).json({ error: "upload image fails" });
            });
    }
);

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

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
