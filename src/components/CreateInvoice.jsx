import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import invoiceSlice from '../redux/invoiceSlice';
import {
  validateSenderStreetAddress, validateSenderPostCode, validateSenderCity, validateSenderCountry,
  validateCLientEmail, validateCLientName, validateClientStreetAddress, validateClientCity, validateClientPostCode, validateClientCountry,
  validateItemCount, validateItemName, validateItemPrice
} from '../functions/createInvoiceValidator';
import FormSection from './FormSection';
import InputField from './InputField';
import SelectField from './SelectField';
import ItemComponent from './ItemComponent';

function CreateInvoice({  setOpenCreateInvoice, invoice, type }) {
  const dispatch = useDispatch();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValidatorActive, setIsValidatorActive] = useState(false);
  const [filterValue] = useState('');
  const deliveryTimes = [
    { text: 'Next 1 day', value: 1 },
    { text: 'Next 7 days', value: 7 },
    { text: 'Next 14 days', value: 14 },
    { text: 'Next 30 days', value: 30 }
  ];

  // Form State
  const [formState, setFormState] = useState({
    senderStreet: '', senderCity: '', senderPostCode: '', senderCountry: '',
    clientName: '', clientEmail: '', clientStreet: '', clientCity: '', clientPostCode: '', clientCountry: '',
    description: '', selectDeliveryDate: '', paymentTerms: deliveryTimes[0].value,
    items: [{ name: '', quantity: 1, price: 0, total: 0, id: uuidv4() }]
  });

  useEffect(() => {
    if (type === 'edit' && isFirstLoad) {
      const updatedItems = invoice.items.map((obj, index) => ({
        ...obj,
        id: index + 1
      }));
      setFormState({
        clientName: invoice.clientName,
        clientCity: invoice.clientAddress.city,
        clientStreet: invoice.clientAddress.street,
        clientPostCode: invoice.clientAddress.postCode,
        clientCountry: invoice.clientAddress.country,
        clientEmail: invoice.clientEmail,
        paymentTerms: invoice.paymentTerms,
        description: invoice.description,
        senderCity: invoice.senderAddress.city,
        senderStreet: invoice.senderAddress.street,
        senderCountry: invoice.senderAddress.country,
        senderPostCode: invoice.senderAddress.postCode,
        items: updatedItems
      });
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, invoice, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleItemChange = (id, e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      items: prevState.items.map((item) =>
        item.id === id ? { ...item, [name]: value, total: (item.quantity * item.price).toFixed(2) } : item
      )
    }));
  };

  const handleItemDelete = (id) => {
    setFormState((prevState) => ({
      ...prevState,
      items: prevState.items.filter((item) => item.id !== id)
    }));
  };

  const validateForm = () => {
    const {
      senderStreet, senderCity, senderPostCode, senderCountry,
      clientName, clientEmail, clientStreet, clientCity, clientPostCode, clientCountry, items
    } = formState;

    const validations = [
      validateSenderStreetAddress(senderStreet), validateSenderCity(senderCity), validateSenderPostCode(senderPostCode), validateSenderCountry(senderCountry),
      validateCLientName(clientName), validateCLientEmail(clientEmail), validateClientStreetAddress(clientStreet), validateClientCity(clientCity), validateClientPostCode(clientPostCode), validateClientCountry(clientCountry),
      items.every(item => validateItemName(item.name) && validateItemCount(item.quantity) && validateItemPrice(item.price))
    ];

    return validations.every(Boolean);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const actionPayload = {
        description: formState.description,
        paymentTerms: formState.paymentTerms,
        clientName: formState.clientName,
        clientEmail: formState.clientEmail,
        senderStreet: formState.senderStreet,
        senderCity: formState.senderCity,
        senderPostCode: formState.senderPostCode,
        senderCountry: formState.senderCountry,
        clientStreet: formState.clientStreet,
        clientCity: formState.clientCity,
        clientPostCode: formState.clientPostCode,
        clientCountry: formState.clientCountry,
        items: formState.items
      };

      if (type === 'edit') {
        dispatch(invoiceSlice.actions.editInvoice({ ...actionPayload, id: invoice.id }));
      } else {
        dispatch(invoiceSlice.actions.addInvoice(actionPayload));
        dispatch(invoiceSlice.actions.filterInvoice({ status: filterValue }));
      }

      setOpenCreateInvoice(false);
    } else {
      setIsValidatorActive(true);
    }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && setOpenCreateInvoice(false)} className="fixed inset-0 bg-[#000005be] flex justify-center items-center">
      <motion.div
        key="createInvoice-sidebar"
        initial={{ x: -500, opacity: 0 }}
        animate={{ opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 40, duration: 0.4 } }}
        exit={{ x: -700, transition: { duration: 0.2 } }}
        className="scrollbar-hide flex flex-col dark:text-white dark:bg-[#141625] bg-white py-16 px-6 h-screen md:w-[768px] md:rounded-r-3xl"
      >
        <h1 className="font-semibold text-3xl">{type === 'edit' ? 'Edit' : 'Create'} Invoice</h1>
        <div className="overflow-y-scroll scrollbar-hide my-14">
          {/* Bill From Section */}
          <FormSection
            title="Bill From"
            fields={['senderStreet', 'senderCity', 'senderPostCode', 'senderCountry']}
            handleChange={handleChange}
            formState={formState}
            isValidatorActive={isValidatorActive}
          />

          {/* Bill To Section */}
          <FormSection
            title="Bill To"
            fields={['clientName', 'clientStreet', 'clientCity', 'clientPostCode', 'clientCountry', 'clientEmail']}
            handleChange={handleChange}
            formState={formState}
            isValidatorActive={isValidatorActive}
          />

          {/* Invoice Date and Payment Terms */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Invoice Date"
              name="selectDeliveryDate"
              type="date"
              value={formState.selectDeliveryDate}
              onChange={handleChange}
            />
            <SelectField
              label="Payment Terms"
              name="paymentTerms"
              options={deliveryTimes}
              value={formState.paymentTerms}
              onChange={handleChange}
            />
          </div>

          {/* Items Section */}
          <div>
            {formState.items.map((item) => (
              <ItemComponent
                key={item.id}
                item={item}
                onChange={(e) => handleItemChange(item.id, e)}
                onDelete={() => handleItemDelete(item.id)}
              />
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} className="btn-primary mt-8">
          {type === 'edit' ? 'Save Changes' : 'Add Invoice'}
        </button>
      </motion.div>
    </div>
  );
}

// PropTypes validation
CreateInvoice.propTypes = {
  openCreateInvoice: PropTypes.bool.isRequired,
  setOpenCreateInvoice: PropTypes.func.isRequired,
  invoice: PropTypes.shape({
    clientName: PropTypes.string.isRequired,
    clientAddress: PropTypes.shape({
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      postCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    }).isRequired,
    clientEmail: PropTypes.string.isRequired,
    paymentTerms: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    senderAddress: PropTypes.shape({
      street: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      postCode: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired
    })).isRequired,
    id: PropTypes.string.isRequired
  }).isRequired,
  type: PropTypes.oneOf(['edit', 'create']).isRequired
};

export default CreateInvoice;
