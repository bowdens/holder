import { createSlice } from "@reduxjs/toolkit";

export const editableSlice = createSlice({
    name: "editable",
    initialState: {
        modalOpen: false,
        itemName: null,
        item: null
    },
    reducers: {
        setModalOpen: (state, action) => {
            const { open } = action.payload;
            state.modalOpen = open;
        },
        setEditItem: (state, action) => {
            const { item } = action.payload;
            state.item = item;
        },
        setEditItemName: (state, action) => {
            const { name } = action.payload;
            state.itemName = name;
        },
        mutateEditItem: (state, action) => {
            const { changes } = action.payload;
            state.item = { ...state.item, changes }
        },
        unsetEditItem: (state, action) => {
            state.item = null;
            state.itemName = null;
        }
    }
});

export const {
    setModalOpen,
    setEditItem,
    setEditItemName,
    mutateEditIte,
    unsetEditItem
} = editableSlice.actions;

export const selectEditModalOpen = state => state.editable.modalOpen;
export const selectEditName = state => state.editable.itemName;
export const selectEditItem = state => state.editable.item;

export default editableSlice.reducer;