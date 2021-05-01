const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateAccessToken = username =>
    jwt.sign({ username }, process.env.TOKEN_SECRET, { expiresIn: 1200 });

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const [type, token] = authHeader && authHeader.split(' ') || [];
    if (type !== "Bearer") {
        res.status(401).json({ error: "Authorization must be Bearer <Token>" });
        return;
    }
    if (!token) {
        res.status(401).json({
            error: "Authorization did not include a token"
        });
        return;
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: "Forbidden"
            });
        }
        console.log(user);
        res.locals.user = user;
        next()
    })
}


module.exports = {
    generateAccessToken,
    authenticateToken
}