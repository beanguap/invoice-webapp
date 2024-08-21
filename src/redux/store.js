// cspell:ignore reduxjs
import { configureStore } from "@reduxjs/toolkit";
import invoiceReducer from './invoiceSlice';

// Create and configure the Redux store
const store = configureStore({
    reducer: {
        invoices: invoiceReducer,
    },
});

export default store;
