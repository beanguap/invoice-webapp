import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import data from "../assets/data/data.json";
import getForwardDate from "../functions/forwardDate";
import generateID from "../functions/generateId";

const today = moment().format("YYYY-MM-DD");

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    allInvoice: data,
    filteredInvoice: [],
    invoiceById: null,
  },
  reducers: {
    filterInvoice: (state, action) => {
      const { status } = action.payload;
      state.filteredInvoice = status 
        ? state.allInvoice.filter(invoice => invoice.status === status)
        : state.allInvoice;
    },
    getInvoiceById: (state, action) => {
      const { id } = action.payload;
      state.invoiceById = state.allInvoice.find(invoice => invoice.id === id) || null;
    },
    deleteInvoice: (state, action) => {
      const { id } = action.payload;
      state.allInvoice = state.allInvoice.filter(invoice => invoice.id !== id);
    },
    updateInvoiceStatus: (state, action) => {
      const { id, status } = action.payload;
      const invoice = state.allInvoice.find(invoice => invoice.id === id);
      if (invoice) invoice.status = status;
    },
    addInvoice: (state, action) => {
      const {
        description,
        paymentTerms,
        clientName,
        clientEmail,
        senderStreet,
        senderCity,
        senderPostCode,
        senderCountry,
        clientStreet,
        clientCity,
        clientPostCode,
        clientCountry,
        item,
      } = action.payload;

      const newInvoice = {
        id: generateID(),
        createdAt: today,
        paymentDue: getForwardDate(paymentTerms),
        description,
        paymentTerms,
        clientName,
        clientEmail,
        status: "pending",
        senderAddress: {
          street: senderStreet,
          city: senderCity,
          postCode: senderPostCode,
          country: senderCountry,
        },
        clientAddress: {
          street: clientStreet,
          city: clientCity,
          postCode: clientPostCode,
          country: clientCountry,
        },
        items: item,
        total: item.reduce((total, { total: itemTotal }) => total + Number(itemTotal), 0),
      };

      state.allInvoice.push(newInvoice);
    },
    editInvoice: (state, action) => {
      const {
        description,
        paymentTerms,
        clientName,
        clientEmail,
        senderStreet,
        senderCity,
        senderPostCode,
        senderCountry,
        clientStreet,
        clientCity,
        clientPostCode,
        clientCountry,
        item,
        id,
      } = action.payload;

      const invoiceIndex = state.allInvoice.findIndex(invoice => invoice.id === id);
      if (invoiceIndex !== -1) {
        state.allInvoice[invoiceIndex] = {
          ...state.allInvoice[invoiceIndex],
          description,
          paymentTerms,
          clientName,
          clientEmail,
          senderAddress: {
            street: senderStreet,
            city: senderCity,
            postCode: senderPostCode,
            country: senderCountry,
          },
          clientAddress: {
            street: clientStreet,
            city: clientCity,
            postCode: clientPostCode,
            country: clientCountry,
          },
          items: item,
          total: item.reduce((total, { total: itemTotal }) => total + Number(itemTotal), 0),
        };
      }
    },
  },
});

export default invoiceSlice.reducer;
