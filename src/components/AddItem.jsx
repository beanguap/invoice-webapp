import { TrashIcon } from '@heroicons/react/24/solid';
import { validateItemCount, validateItemName, validateItemPrice } from '../functions/createInvoiceValidator';
import PropTypes from 'prop-types';

const AddItem = ({ itemDetails, isValidatorActive, onDelete, handleOnChange }) => {
  const { id, name, quantity, price, total } = itemDetails;

  const handleChange = (e) => handleOnChange(id, e);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'Item Name', name: 'name', type: 'text', value: name, validator: validateItemName },
            { label: 'Qty.', name: 'quantity', type: 'number', value: quantity, min: 0, validator: validateItemCount, maxW: '60px' },
            { label: 'Price', name: 'price', type: 'number', value: price, min: 0, validator: validateItemPrice, maxW: '100px' },
          ].map(({ label, name, type, value, min, maxW, validator }) => (
            <div key={name} className="flex flex-col items-start">
              <h1>{label}</h1>
              <input
                name={name}
                type={type}
                onChange={handleChange}
                value={value}
                min={min}
                className={`dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-purple-400 border-gray-300 focus:outline-none
                ${isValidatorActive && !validator(value) && 'border-red-500 dark:border-red-500 outline-red-500 border-2'}
                dark:border-gray-800 ${maxW ? `max-w-[${maxW}]` : ''}`}
              />
            </div>
          ))}
          <div className="flex flex-col items-start">
            <h1>Total</h1>
            <div className="dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-none focus:outline-purple-400 border-gray-300 dark:border-gray-800 dark:text-white max-w-[100px]">
              {total}
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(id)}>
          <TrashIcon className="text-gray-500 hover:text-red-500 cursor-pointer h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

AddItem.propTypes = {
  itemDetails: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  setItem: PropTypes.func,
  isValidatorActive: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
};

export default AddItem;