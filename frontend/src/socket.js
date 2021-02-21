import store from "./app/store";
import socketIOClient from "socket.io-client";
import { setBag, setPending, updateError } from "./features/bag/bagSlice";
import { addToast } from "./features/toasts/toastsSlice";
import { setCurrentCode } from "./features/auth/authSlice";

let socket = null;

const addPreviousBag = (code, name) => {
    const prevBags = JSON.parse(localStorage.getItem("prevBags"));
    if (prevBags === null) {
        console.log(`set previous bag: (${code}, ${name})`);
        localStorage.setItem("prevBags", JSON.stringify([{
            code, name
        }]));
    } else if (prevBags.find(b=>b.code.toUpperCase()===code.toUpperCase()) === undefined) {
        console.log(`append previous bag: (${code}, ${name})`);
        localStorage.setItem("prevBags", JSON.stringify([
            ...prevBags,
            { code, name }
        ]));
    } else {
        console.log(`previous bag already exists: (${code}, ${name})`);
    }
};

export const createSocket = () => {
    socket = socketIOClient("/");
    socket.on("connection", socket => {
        console.log(`connection got: ${socket}`);
    });
    socket.on("newBag", (code) => {
        console.log("new bag got!");
        store.dispatch(setCurrentCode({ currentCode: code }));
    })
    socket.on("bag", data => {
        console.log("bag got!");
        console.log(data);
        store.dispatch(setBag({ bag: data }));
        store.dispatch(setPending({ pending: false }));
        addPreviousBag(store.getState().auth.currentCode, data.name);
    });
    socket.on("error", data => {
        console.log("error got");
        console.log(data);
        //store.dispatch(setBag({ bag: null }));
        store.dispatch(setPending({ pending: false }));
        store.dispatch(updateError({ error: data.error }));
        alert(`There was an error:\n${data.error}`)
    })
    socket.on("joined", joinedId => {
        console.log(`other socket ${joinedId} joined.`);
    });
    socket.on("toast", toast => {
        console.log("toast got.");
        store.dispatch(addToast({ toast }))
    })
}

export const createOrGetSocket = () => {
    if (socket !== null) return { socket };
    console.log("creating new socket");
    createSocket();
    return { socket };
}
export const getSocket = () => {
    console.log(`socket requested:`);
    console.log(socket);
    return { socket };
};