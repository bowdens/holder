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
        const doc = await itemCount.find({code});
        if (doc) {
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

module.exports = { addItem, removeItem, updateBag, updateItem, findBag, createBag };