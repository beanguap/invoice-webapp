import PropTypes from 'prop-types';
import PaidStatus from './PaidStatus';
import rightArrow from '../assets/icon-arrow-right.svg';
import { Link } from 'react-router-dom';

function InvoiceCard({ invoice }) {
  return (
    <Link to={`invoice?${invoice.id}`}>
      {/* Responsive Card */}
      <div className="flex flex-col md:flex-row cursor-pointer hover:border border-purple-500 py-4 shadow-sm px-6 dark:bg-[#1E2139] bg-white rounded-lg justify-between items-start md:items-center">
        
        {/* Invoice Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-6">
          <h2 className="dark:text-white">
            <span className="text-[#7e88c3]">#</span>
            {invoice.id}
          </h2>
          <h2 className="text-sm text-gray-400 font-light mt-2 md:mt-0">Due {invoice.paymentDue}</h2>
          <h2 className="text-sm text-gray-400 font-light mt-2 md:mt-0">{invoice.clientName}</h2>
        </div>

        {/* Invoice Status */}
        <div className="flex items-center">
          <h1 className="text-xl mr-8 dark:text-white">${invoice.total}</h1>
          <PaidStatus type={invoice.status} />
          <img src={rightArrow} alt="arrow icon" className="ml-4" />
        </div>
      </div>
    </Link>
  );
}

InvoiceCard.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.string.isRequired,
    paymentDue: PropTypes.string.isRequired,
    clientName: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default InvoiceCard;
