import { createSlice } from '@reduxjs/toolkit';

const dummyBag = {
    code: "abcd-1234",
    name: "Happy Fun Bag!",
    items: [
        {
            description: "Longsword - Martial Melee Weapon\nDeals 1d8 Slashing damage.\nRange: 5 ft.\nProperties: Versatile\nWeight: 3 lbs.\nCost: 15 gp",
            name: "Longsword",
            quantity: 1
        },
        {
            description: "Shortbow - Simple Ranged Weapon\nDeals 1d6 Piercing damage.\nRange: 80/320 ft.\nProperties: Ammunition, Two-Handed\nWeight: 2 lbs.\nCost: 25 gp",
            name: "Shortbow",
            quantity: 1
        },
        {
            description: "Arrow - Ammunition\nWeight: 1 lbs\nCost: 1 gp",
            name: "Arrow",
            quantity: 20
        }
    ]
}


export const bagSlice = createSlice({
    name: 'bag',
    initialState: {
        bag: null,
        pending: true,
        passwordRequired: false,
        password: null,
        error: null
    },
    reducers: {
        setPending: (state, action) => {
            const { pending } = action.payload;
            state.pending = pending;
        },
        setBag: (state, action) => {
            const { bag } = action.payload;
            console.log("setting bag to");
            console.log(bag);
            state.bag = bag;
            console.log("bag is now");
            console.log(state.bag);
            console.log("and items are ");
            console.log(state.bag.items);
        },
        resetBag: (state, action) => {
            state.bag = null;
            state.pending = true
            state.passwordRequired = false;
            state.password = null;
            state.error = null;
        },
        updateName: (state, action) => {
            console.log("updateName slice: do nothing");
            /*
            if (state.bag === null) return;
            const { name } = action.payload;
            state.bag.name = name;
            */
        },
        addItem: (state, action) => {
            console.log("add item slice: do nothing");
            /*
            if (state.bag === null) return;
            if (state.bag.items === null) {
                state.bag.items = [];
            }
            // check there isn't already an item with that name
            const { item } = action.payload;
            if (state.bag.items.find(i => i.name.toLowerCase() === item.name.toLowerCase()) !== undefined) return;
            state.bag.items.push(item);
            */
        },
        removeItem: (state, action) => {
            console.log("add item slice: do nothing");
            /*
            if (state.bag === null) return;
            if (state.bag.items === null) return;
            const { name } = action.payload;
            state.bag.items = state.bag.items.filter(i => i.name.toLowerCase() !== name.toLowerCase());
            */
        },
        updateItem: (state, action) => {
            console.log("add item slice: do nothing");
            /*
            if (state.bag === null) return;
            if (state.bag.items === null) return;
            const { name, item } = action.payload;
            const itemIndex = state.bag.items.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
            if (itemIndex === -1) return;
            state.bag.items[itemIndex] = item;
            */
        },
        updatePassword: (state, action) => {
            const { password } = action.payload;
            // todo: hash the password for local storage?
            state.password = password;
        },
        updatePasswordRequired: (state,action) => {
            const { passwordRequired } = action.payload;
            state.passwordRequired = passwordRequired;
        },
        updateError: (state, action) => {
            const { error } = action.payload;
            state.error = error;
        }

    }
});

export const {
    setPending,
    setBag,
    resetBag,
    updateName,
    addItem,
    removeItem,
    updateItem,
    updatePassword,
    updatePasswordRequired,
    updateError
} = bagSlice.actions;

export const selectBag = state => state.bag.bag;
export const selectItems = state => state.bag.bag.items;
export const selectItem = (state, name) => state.bag.bag.items.find(i => i.name === name);
export const selectName = state => state.bag.bag.name;
export const selectCode = state => state.bag.bag.code;
export const selectBagPending = state => state.bag.pending;
export const selectBagExists = state => state.bag.bag !== null;
export const selectPasswordRequired = state => state.bag.passwordRequired;
export const selectPassword = state => state.bag.password;
export const selectError = state => state.bag.error;

export default bagSlice.reducer;