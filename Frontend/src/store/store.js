import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/userSlicer.js"
import { persistStore, persistReducer } from "redux-persist";
import storageSession  from "redux-persist/lib/storage/session"; 



const persistConfig = {
    key: 'root',
    storage: storageSession,
}
    


const persistedReducer = persistReducer(persistConfig, authReducer)

export const store=configureStore({
    reducer:{
        auth:  persistedReducer

    }
});

store.subscribe(() => {
    const state = store.getState();
    if (!state.auth.status) {
        storageSession.removeItem('persist:root');
    }
});

export const persistor=persistStore(store)
