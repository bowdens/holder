import { createSlice } from '@reduxjs/toolkit';
import dummySrd from "./equipment";

export const srdItemsSlice = createSlice({
    name: 'srdItems',
    initialState: {
        items: dummySrd,
        pending: false
    },
    reducers: {
        setItems: (state, action) => {
            const { items } = action.payload;
            state.items = items;
        },
        setPending: state => {
            state.pending = true;
        },
        unsetPending: state => {
            state.pending = false;
        }
    }
});

export const { setItems, setPenidng, unsetPending } = srdItemsSlice.actions;

export const selectSrdItems = state =>  state.srdItems.items;
export const selectSrdItemsPending = state => state.srdItems.pending;

export default srdItemsSlice.reducer;