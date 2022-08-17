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

module.exports = {
    getUserById,
    createUser,
};
