import { createSlice } from "@reduxjs/toolkit";

export const toastsSlice = createSlice({
    name: 'toasts',
    initialState: {
        toasts: []
    },
    reducers: {
        addToast: (state, action) => {
            const { toast } = action.payload;
            state.toasts.push(toast);
        },
        dismissToast: (state, action) => {
            const { key } = action.payload;
            console.log("dismissing key, before:");
            console.log(state);
            state.toasts = state.toasts.filter(t => t.key !== key);
            console.log(state);
        }
    }
});

export const {
    addToast,
    dismissToast
} = toastsSlice.actions;

export const selectToasts = state => state.toasts.toasts;

export default toastsSlice.reducer;