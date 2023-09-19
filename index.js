const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;

const SECRET_KEY = "hamburgers"

let users = [];

app.use(bodyParser.json());

app.get("/health", (req, res) => {
    res.status(200).send({ message: "Server is healthy" });
});

// registration endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        username,
        password: hashedPassword
    });

    res.status(201).send({ message: `User registered ${username} ${hashedPassword}` });
});

// login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find((u) => { return u.username === username });

    if (!user) {
        return res.status(400).send({ message: "Cannot find user" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).send({ message: "Invalid password" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).send({ message: "Logged in", token });
});

// middleware to verify JWT 
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send({ message: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        req.username = decoded.username;
        next();
    });
};

// protected endpoint
app.get('/protected', verifyToken, (req, res) => {
    res.send({ message: `Hello ${req.username}` });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});