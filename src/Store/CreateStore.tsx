// import { FC, PropsWithChildren } from "react";
// import { Provider } from "react-redux";
// import { combineReducers, createStore, Reducer, UnknownAction } from "@reduxjs/toolkit";
// import AuthReducer, { TAuthReducer } from "./Reducers/AuthReducer.ts";
// import { persistReducer, persistStore } from 'redux-persist'
// import storage from "redux-persist/lib/storage";
// import { PersistGate } from "redux-persist/integration/react";
// import { encryptTransform } from "redux-persist-transform-encrypt";

// const rootReducer: Reducer<{ AuthData: TAuthReducer }, UnknownAction> = combineReducers({
//     AuthData: AuthReducer,
// });


// const persistedReducer = persistReducer(
//     {
//         key: 'root',
//         storage: storage,
//         transforms: [
//             encryptTransform({
//                 secretKey: import.meta.env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY,
//                 onError: (err) => {
//                     console.log(err)
//                 }
//             })
//         ]
//     },
//     rootReducer
// );
// export const store = createStore(persistedReducer);
// const persistor = persistStore(store);

// const CreateStore: FC<PropsWithChildren> = (props) => {


//     return (
//         <Provider store={store}>
//             <PersistGate loading={null} persistor={persistor}>
//                 {props.children}
//             </PersistGate>
//         </Provider>
//     )
// }

// export default CreateStore;

import { FC, PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { combineReducers, configureStore, Reducer, AnyAction } from "@reduxjs/toolkit";
import AuthReducer, { TAuthReducer } from "./Reducers/AuthReducer.ts";
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from "redux-persist/integration/react";
import { encryptTransform } from "redux-persist-transform-encrypt";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
    return {
        getItem(_key) {
            return Promise.resolve(null);
        },
        setItem(_key, value) {
            return Promise.resolve(value);
        },
        removeItem(_key) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const isServer = typeof window === 'undefined';

const rootReducer: Reducer<{ AuthData: TAuthReducer }, AnyAction> = combineReducers({
    AuthData: AuthReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    transforms: [
        encryptTransform({
            secretKey: import.meta.env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY,
            onError: (err) => {
                console.error('Encryption error:', err);
            },
        }),
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

const persistor = persistStore(store);

const CreateStore: FC<PropsWithChildren> = (props) => {
    return (
        <Provider store={store}>
            {/* Only use PersistGate when running in the browser */}
            {!isServer && (
                <PersistGate loading={null} persistor={persistor}>
                    {props.children}
                </PersistGate>
            )}
            {isServer && props.children}
        </Provider>
    );
};

export default CreateStore;