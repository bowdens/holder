import { getSocket } from "../socket";

const apiCaller = store => next => action => {
    console.log("in api caller!");
    console.log(action);
    let result = next(action);
    const { socket } = getSocket();
    const code = store.getState().auth.currentCode;
    const nickname = store.getState().auth.nickname || "anonymous";
    switch (action.type) {
        case "bag/updateName":
            console.log("socket is");
            console.log(socket);
            console.log("code is");
            console.log(code);
            if (socket !== null) {
                console.log(`emitting name ${action.payload.name}`);
                socket.emit("update_bag", {
                    code, 
                    update: {
                        name: action.payload.name
                    }, nickname
                });
            } else {
                console.log("socket was null");
            }
            break;
        case "bag/removeItem":
            console.log(`bag/removeItem, code=${code}`);
            console.log(action.payload.item);
            if (socket !== null) {
                socket.emit("remove_item", {
                    code,
                    name: action.payload.name,
                    nickname
                });
            } else {
                console.error("attempted bag/addItem emit but socket was null")
            }
            break;
        case "bag/addItem":
            console.log(`bag/addItem, code=${code}`);
            console.log(action.payload.item);
            if (socket !== null) {
                socket.emit("append_item", {
                    code,
                    item: action.payload.item,
                    nickname
                });
            } else {
                console.error("attempted bag/addItem emit but socket was null")
            }
            break;
        case "bag/updateItem":
            if (socket !== null) {
                socket.emit("update_item", {
                    code,
                    name: action.payload.name,
                    item: action.payload.item,
                    nickname
                });
            }
            break;
    }
    return result;
}

export default apiCaller;