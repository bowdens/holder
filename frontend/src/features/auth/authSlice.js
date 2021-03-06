import { createSlice } from "@reduxjs/toolkit";
import { getRandomName } from "./monsters";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        cachedPassword: null,
        cachedPasswordFor: null,
        currentCode: null,
        nickname: "Anonymous " + getRandomName()
    },
    reducers: {
        setCachedPassword: (state, action) => {
            const { cachedPassword } = action.payload;
            state.cachedPassword = cachedPassword;
        },
        setPasswordFor: (state, action) => {
            const { cachedPasswordFor } = action.payload;
            state.cachedPasswordFor = cachedPasswordFor;
        },
        setCurrentCode: (state, action) => {
            const { currentCode } = action.payload;
            state.currentCode = currentCode;
        },
        setNickname: (state, action) => {
            const { nickname } = action.payload;
            state.nickname = nickname;
        },
        setRandomNickname: (state, action) => {
            state.nickname = "Anonymous " + getRandomName();
        }
    }
});

export const {
    setCachedPassword,
    setPasswordFor,
    setCurrentCode,
    setNickname,
    setRandomNickname
} = authSlice.actions;

export const selectCachedPassword = state => state.auth.cachedPassword;
export const selectCachedPasswordFor = state => state.auth.cachedPasswordFor;
export const selectCurrentCode = state => state.auth.currentCode;
export const selectNickname = state => state.auth.nickname;

export default authSlice.reducer;