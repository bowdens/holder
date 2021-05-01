const Joi = require("joi");
const { generateAccessToken, authenticateToken } = require("../../authFuncs");
const { createUser, findUserByEmail, findUserByUid, updateUserDetails } = require("../../dbFuncs");
const mailgun = require("mailgun-js");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const apiPath = "/api/v1";
console.log(process.env.ED_MAILGUN_KEY);
const mg = mailgun({
    apiKey: process.env.ED_MAILGUN_KEY,
    domain: "extradimension.al"
});

const signUp = (req, res, db) => {
    console.log("in signup");
    const schema = Joi.object({
        username: Joi.string()
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .min(8)
            .max(128)
            .required(),
        email: Joi.string()
            .email()
            .lowercase()
            .required(),
        acceptEmails: Joi.boolean()
            .required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        res.status(400).json(error);
    } else {
        const { username, email, password, acceptEmails } = value;
        createUser(db, {
            username, email, password, acceptEmails
        }).then(uid => {
            //const token = generateAccessToken(value.username)
            const messageData = {
                from: "Extradimensional <noreply@extradimension.al>",
                to: email,
                subject: "Verify your extradimension.al account",
                template: "verify-email",
                'h:X-Mailgun-Variables': JSON.stringify({ uid, username })
            };
            console.log(messageData);
            mg.messages().send(messageData).then(body => {
                console.log("email sent!");
                console.log(body);
                updateUserDetails(db, uid, {
                    lastVerificationSent: Date.now()
                }).then(()=>{
                    console.log("updated last verification sent");
                }).catch(err=>{
                    console.error("failed to update last verification sent");
                    console.error(err);
                    // don't really care that much if this fails, don't do anything else
                });
            }).catch(err => {
                console.error("failed to send email");
                console.error(err);
            });
            res.status(201).json({
                message: `Your account has been created. Please check ${email} to verify your email address.`
            });
        }).catch(err => {
            console.error(err);
            if (typeof err === "string" && err.startsWith("Email")) {
                res.status(409).json({ error: err });
            } else {
                res.status(400).json({ error: "Failed to create user. Please try again." })
            }
        })

    }
}

const signIn = (req, res, db) => {
    const schema = Joi.object({
        email: Joi.string().lowercase().required(),
        password: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        res.status(400).json(error);
    } else {
        const { email, password } = value;
        findUserByEmail(db, email).then(user => {
            console.log(user);
            bcrypt.compare(password, user.hash).then(valid => {
                if (valid === true) {
                    if (user.verified === true) {
                        const token = generateAccessToken(user.uid);
                        res.status(200).json({ token });
                    } else {
                        res.status(403).json({error: "Your account has not yet been verified. Please check your inbox."})
                    }
                } else {
                    res.status(403).json({
                        error: "Incorrect username or password"
                    });
                }
            }).catch(err => {
                console.error(err);
                res.status(403).json({
                    error: "Incorrect username or password"
                });
            });
        }).catch(err => {
            console.error(err);
            res.status(403).json({
                error: "Incorrect username or password"
            });
        });
    }
};

const verifyUser = (req, res, db) => {
    const schema = Joi.object({
        uid: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        res.status(400).json(error);
    } else {
        const { uid } = value;
        findUserByUid(db, uid).then(user => {
            if (!user) {
                res.status(404).json({
                    "error": "Failed to verify: No user with that id"
                });
            } else if (user.verified === true) {
                res.status(409).json({
                    "error": "No need to verify: You were already verified!"
                });
            } else {
                updateUserDetails(db, uid, {
                    verified: true
                }).then(() => {
                    res.status(200).json({
                        "message": "Your email has been verified. Thank you"
                    });
                }).catch(err => {
                    console.error(err);
                    res.status(500).json({
                        "error": "We were unable to verify your email. Please try again."
                    });
                })
            }
        }).catch(err=>{
            console.error(err);
            if (err.startsWith("Could not find a user")) {
                res.status(404).json({
                    "error": "Failed to verify: No user with that id"
                })
            } else {
                res.status(500).json({
                    "error": "Failed to verify. Please try again."
                });
            }
        });
        
    }
}

const createBag = (req, res) => {

}

module.exports = {
    signUp,
    signIn,
    verifyUser
}