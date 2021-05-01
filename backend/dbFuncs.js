const bcrypt = require("bcrypt");
const Joi = require("joi");
const uuid = require("uuid");

const genCode = () => {
    const randInt = m => Math.floor(Math.random() * m);
    const letters = "ACDEFGHJKMNPQRTWXY34679";
    let code = "";
    for (let i = 0; i < 4; i++) {
        code += letters[randInt(letters.length)];
    }
    code += "-";
    for (let i = 0; i < 4; i++) {
        code += letters[randInt(letters.length)];
    }
    return code;
}

const createBag = (db, name) => {
    const collection = db.collection("bags");
    return new Promise(async (resolve, reject) => {
        let attempts = 0;
        let code = genCode();
        let validCode = false;
        while (attempts < 10) {
            const c = await collection.countDocuments({ code });
            if (c === 0) {
                validCode = true;
                break;
            }
            code = genCode();
            attemps += 1;
        }
        if (validCode === true) {
            collection.insertOne({
                code,
                bag: {
                    items: [],
                    name
                },
                meta: {
                    history: [],
                    logins: [],
                    creationDate: Date()
                }
            }, (err, res) => {
                if (err) return reject(err);
                if (res.insertedCount !== 1) return reject("Failed to create new bag.");
                return resolve(code, { items: [], name });
            })
        } else {
            return reject("Failed to create bag. Please try again.")
        }
    })
}

const findBag = (db, code) => {
    const collection = db.collection("bags");
    return new Promise((resolve, reject) => {
        collection.find({ code }).toArray((err, bags) => {
            if (err !== null) {
                return reject(err);
            }
            if (bags.length === 0) {
                return reject(`Bag with code ${code} does not exist!`);
            }
            if (bags.length > 1) {
                return reject(`Internal database error: more than 1 bag with code ${code}`);
            }
            return resolve(bags[0]);
        });
    });
}

const updateBag = (db, code, updates) => {
    const collection = db.collection("bags");
    console.log(`updating ${code} with`);
    console.log(updates);
    return new Promise((resolve, reject) => {
        if (updates.name !== undefined) {
            if (updates.name.length > 100 || updates.name.length < 1) {
                return reject("The bag name must be between 1 and 100 characters.");
            }
        }

        // TODO: add things like password here
        let _updates = {};
        if (updates.name) _updates["bag.name"] = updates.name;

        collection.findOneAndUpdate(
            { code }, { "bag": { $set: { ..._updates } } }, { returnOriginal: false },
            (err, bag) => {
                if (err !== null) {
                    return reject(err);
                }
                return resolve(bag.value);
            });
    });
}


const removeItem = (db, code, name) => {
    const collection = db.collection("bags");
    return new Promise((resolve, reject) => {
        collection.findOneAndUpdate(
            { code }, { $pull: { "bag.items": { name } } }, { returnOriginal: false },
            (err, bag) => {
                if (err !== null) {
                    return reject(err);
                }
                return resolve(bag.value);
            }
        );
    });
}

const updateItem = (db, code, name, item) => {
    // todo check first for duplicate names in items
    const collection = db.collection("bags");
    return new Promise(async (resolve, reject) => {
        if (name !== item.name) {
            const n = await collection.countDocuments({ code, "bag.items.name": item.name })
            if (n !== 0) {
                return reject(`There was already an item in the bag called ${item.name}.`)
            }
        }
        collection.findOneAndUpdate(
            { code, "bag.items.name": name }, { $set: { "bag.items.$": item } }, { returnOriginal: false },
            (err, bag) => {
                if (err !== null) {
                    return reject(err);
                }
                return resolve(bag.value);
            }
        )
    });
}

const addItem = (db, code, item) => {
    // todo: check first for duplicate names of items in array
    console.log(`addItem: ${code}`);
    console.log(item);
    return new Promise(async (resolve, reject) => {
        const itemCount = db.collection("itemCount")
        const doc = await itemCount.findOne({ code });
        if (doc && doc.count) {
            if (doc.count >= 256) {
                return reject(`Bag ${code} has reached its item capacity. Please remove some items before adding more.`);
            }
        } else {
            return reject(`Could not find a bag with code ${code}`);
        }
        const collection = db.collection("bags");
        const n = await collection.countDocuments({ code, "bag.items.name": item.name });
        if (n !== 0) {
            console.log(`error: already item called ${item.name}`);
            return reject(`There was already an item in the bag called ${item.name}`)
        }
        collection.findOneAndUpdate(
            { code }, { $push: { "bag.items": item } }, { returnOriginal: false },
            (err, bag) => {
                if (err !== null) {
                    console.log(`error:`);
                    console.log(err);
                    return reject(err);
                }
                return resolve(bag.value);
            }
        )
    });
}

const findUserByUid = (db, uid) => {
    return new Promise(async (resolve, reject) => {
        const users = db.collection("users");
        const doc = await users.findOne({ uid });
        if (doc) {
            return resolve(doc);
        } else {
            return reject(`Could not find a user with uid ${uid}`);
        }
    });
};

const findUserByEmail = (db, email) => {
    return new Promise(async (resolve, reject) => {
        const users = db.collection("users");
        const doc = await users.findOne({ email });
        if (doc) {
            return resolve(doc);
        } else {
            return reject(`Could not find a user with email ${email}`);
        }
    });
}

const createUser = (db, { username, email, password, acceptEmails }) => {
    return new Promise(async (resolve, reject) => {
        const users = db.collection("users");
        const uid = uuid.v4();
        return bcrypt.hash(password, 12)
            .then(hash => {
                return users.insertOne({
                    uid,
                    username,
                    email,
                    hash,
                    acceptEmails,
                    bags: [],
                    favouriteBags: [],
                    logins: [],
                    creationDate: new Date(),
                    verified: false,
                    lastVerificationSent: null
                });
            }).then(res => {
                //console.log(res);
                return resolve(uid);
            }).catch(err => {
                console.error(err.code);
                if (err.code === 11000) {
                    return reject(`Email ${email} has already been registered.`)
                }
                return reject("Failed to create user. Please try again.");
            })
    })
};

const updateUserDetails = (db, uid, user) => {
    return new Promise(async (resolve, reject) => {
        const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(30),
            acceptEmails: Joi.boolean(),
            verified: Joi.boolean(),
            lastVerificationSent: Joi.date(),
            bags: Joi.array(),
            favouriteBags: Joi.array()
        }).min(1);
        const { error, value } = schema.validate(user);
        if (error) {
            return reject(error);
        }
        console.log(`updating user ${uid}:`);
        console.log(value);
        const users = db.collection("users");
        users.findOneAndUpdate(
            { uid },
            { $set: { ...value } }
        ).then(result => {
            if (result.ok === 1) {
                console.log(`user ${uid} updated`)
                return resolve();
            } else {
                console.error(result);
                return reject(`failed to update user ${uid}`);
            }
        }).catch(err => {
            console.error(err);
            return reject(err);
        })
    })
}

module.exports = {
    addItem,
    removeItem,
    updateBag,
    updateItem,
    findBag,
    createBag,
    createUser,
    findUserByEmail,
    findUserByUid,
    updateUserDetails,
};