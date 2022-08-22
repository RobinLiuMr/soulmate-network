// connect with database social-network
const spicedPg = require("spiced-pg");
const { DATABASE_USER, DATABASE_PASSWORD } = require("../secrets.json");
const DATABASE_NAME = "social-network";

const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

// password to hash
const bcrypt = require("bcryptjs");
const hash = (password) =>
    bcrypt.genSalt().then((salt) => bcrypt.hash(password, salt));

// social-network=# SELECT * FROM users;
//  id | first_name | last_name | email | password_hash | created_at
// ----+------------+-----------+-------+---------------+------------

function getUserById(id) {
    return db
        .query(
            `
        SELECT * FROM users
        WHERE id = $1
    `,
            [id]
        )
        .then((result) => result.rows[0]);
}

function createUser({ first_name, last_name, email, password }) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                `
            INSERT INTO users (first_name, last_name, email, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
                [first_name, last_name, email, password_hash]
            )
            .then((result) => result.rows[0]);
    });
}

function login({ email, password }) {
    return getUserByEmail({ email }).then((foundUser) => {
        if (!foundUser) {
            return null; // no email found
        }

        return bcrypt
            .compare(password, foundUser.password_hash)
            .then((match) => {
                if (!match) {
                    return null; // no password match the email
                }
                return foundUser;
            });
    });
}

function getUserByEmail({ email }) {
    return db
        .query("SELECT * FROM users WHERE email = $1", [email])
        .then((result) => result.rows[0]);
}

// social-network=# SELECT * FROM reset_codes;
//  id | email | code | timestamp
// ----+-------+------+-----------

// upsert incase multi times reset and update timestamp
function createResetCode(email, code) {
    return db
        .query(
            `
            INSERT INTO reset_codes (email, code)
            VALUES ($1, $2)
            ON CONFLICT (email)
            DO UPDATE SET code = $2, created_at = CURRENT_TIMESTAMP
            RETURNING *
        `,
            [email, code]
        )
        .then((result) => result.rows[0]);
}

function getCodeByEmail({ email }) {
    return db
        .query(
            `
            SELECT * FROM reset_codes 
            WHERE email = $1
            
        `,
            [email]
        )
        .then((result) => result.rows[0]);
}

function updateUser({ email, password }) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                `
            UPDATE users SET password_hash = $2
            WHERE email = $1
            RETURNING *
        `,
                [email, password_hash]
            )
            .then((result) => result.rows[0]);
    });
}

function updateUserProfilePicture({ id, profile_picture_url }) {
    return db
        .query(
            `
            UPDATE users SET profile_picture_url = $2
            WHERE id = $1
            RETURNING *
        `,
            [id, profile_picture_url]
        )
        .then((result) => result.rows[0]);
}

function updateUserBio({ id, bio }) {
    return db
        .query(
            `
            UPDATE users SET bio = $2
            WHERE id = $1
            RETURNING *
        `,
            [id, bio]
        )
        .then((result) => result.rows[0]);
}

module.exports = {
    getUserById,
    createUser,
    login,
    getUserByEmail,
    createResetCode,
    getCodeByEmail,
    updateUser,
    updateUserProfilePicture,
    updateUserBio,
};
