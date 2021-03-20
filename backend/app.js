const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const server = require('https').createServer({
    key: fs.readFileSync('./localhost.key'),
    cert: fs.readFileSync('./localhost.crt')
}, app);

const io = require('socket.io')(server, {serveClient: false});

const { v4: uuidv4 } = require('uuid');

const { client, dbName, url } = require("./secrets");
const {
    findBag,
    updateBag,
    removeItem,
    addItem,
    updateItem,
    createBag
} = require("./dbFuncs");

let db = null;

client.connect((err, _db) => {
    if (err) {
        console.log("failed to connect to database");
        console.log(err);
        client.close();
    }
    db = _db.db(dbName);
});

io.on('connection', socket => {
    console.log(`connection found ${socket.id}`);

    socket.on("join_bag", data => {
        console.log("bag joined...");
        console.log(data);
        const { code, _nickname } = data;
        const nickname = _nickname ? _nickname.substring(0,32) : "Anonymous"
        findBag(db, code.toUpperCase())
            .then(bag => {
                io.to(code).emit("toast", {
                    header: "New User",
                    content: `${nickname} connected`,
                    key: uuidv4()
                });
                socket.join(code);
                socket.emit("bag", bag.bag);
            })
            .catch(err => {
                socket.emit("error", { error: err });
            });
    });

    socket.on("create_bag", (name) => {
        createBag(db, name)
            .then((code, bag) => {
                socket.join(code);
                socket.emit("newBag", code, bag);
            })
            .catch(err => {
                console.error(err);
                socket.emit("error", err);
            })
    });

    socket.on("update_bag", (data) => {
        const { code, update, _nickname } = data;
        const nickname = _nickname ? _nickname.substring(0,32) : "Anonymous"
        updateBag(db, code.toUpperCase(), update)
            .then(bag => {
                io.to(code).emit("bag", bag.bag);
                io.to(code).emit("toast", {
                    header: "Bag Updated",
                    content: `${nickname} updated the bag`,
                    key: uuidv4()
                });
            })
            .catch(err => {
                socket.emit("error", {
                    "error": err
                });
            })
    });

    socket.on("remove_item", data => {
        const { code, name, _nickname } = data;
        const nickname = _nickname ? _nickname.substring(0,32) : "Anonymous"
        removeItem(db, code.toUpperCase(), name)
            .then(bag => {
                io.to(code).emit("bag", bag.bag);
                io.to(code).emit("toast", {
                    header: "Item Removed",
                    content: `${nickname} removed ${name}`,
                    key: uuidv4()
                });
            })
            .catch(err => {
                console.error(`error removing ${code}.item.name=${name}`);
                console.error(err);
                socket.emit("error", {
                    "error": err
                });
            })
    });

    socket.on("update_item", data => {
        const { code, name, item, _nickname } = data;
        const nickname = _nickname ? _nickname.substring(0,32) : "Anonymous"
        updateItem(db, code.toUpperCase(), name, item)
            .then(bag => {
                io.to(code).emit("bag", bag.bag);
                io.to(code).emit("toast", {
                    header: "Item Modified",
                    content: `${nickname} modified ${name} ${name !== item.name ? `=> ${item.name}` : ""}`,
                    key: uuidv4()
                });
            })
            .catch(err => {
                console.error(`error updating ${code}.item.name=${name}`);
                console.error(err);
                socket.emit("error", {
                    "error": err
                });
            });
    });

    socket.on("append_item", data => {
        console.log("append_item called");
        const { code, item, _nickname } = data;
        const nickname = _nickname ? _nickname.substring(0,32) : "Anonymous";
        addItem(db, code.toUpperCase(), item)
            .then(bag => {
                io.to(code).emit("bag", bag.bag);
                io.to(code).emit("toast", {
                    header: "Item Added",
                    content: `${nickname} added a ${item.name}.`,
                    key: uuidv4()
                });
            })
            .catch(err => {
                socket.emit("error", {
                    "error": err
                });
            });
    });
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get("*", (req, res) => {
    console.log("got page request for " + req.path);
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});


server.listen(5000, () => {
    console.info("App listening on 5000");
});
