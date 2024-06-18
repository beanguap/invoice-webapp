// cspell:ignore reduxjs
import { configureStore } from "@reduxjs/toolkit";
import invoiceSlice from './invoiceSlice'



const store = configureStore({
    reducer : {
        invoices : invoiceSlice.reducer
    }
})

export default store