import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';  // Import PropTypes
import { invoiceSlice } from '../redux/invoiceSlice';
import formatDate from '../functions/formatDate';
import DeleteModal from './DeleteModal';
import CreateInvoice from './CreateInvoice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import leftArrow from '../assets/icon-arrow-left.svg';
import PaidStatus from './PaidStatus';
import logo from '../assets/logo.png';

const InvoiceInfo = ({ onDelete }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const invoiceId = location.search.substring(1);

    useEffect(() => {
        dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }));
    }, [dispatch, invoiceId]);

    const invoice = useSelector((state) => state.invoices.invoiceById);

    const handleMakePaid = () => {
        dispatch(invoiceSlice.actions.updateInvoiceStatus({ id: invoiceId, status: 'paid' }));
        dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }));
    };

    const handleDelete = () => {
        onDelete(invoiceId);
        setIsDeleteModalOpen(false);
        navigate('/');
    };

    const handleDownloadInvoice = async () => {
        const input = document.getElementById('invoice-info');
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgHeight = (canvas.height * 208) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, 208, imgHeight);
        pdf.save(`invoice_${invoice?.id}.pdf`);
    };

    if (!invoice) return <p>Loading...</p>;

    return (
        <motion.div
            id="invoice-info"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: '200%' }}
            transition={{ duration: 0.5 }}
            className="dark:bg-[#141625] bg-[#f8f8fb] mx-auto min-h-screen py-[34px] px-2 md:px-8 lg:px-12 max-w-3xl lg:py-[72px]"
        >
            <div className="space-y-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-4 group dark:text-white font-thin"
                    aria-label="Go back"
                >
                    <img src={leftArrow} alt="Back" />
                    <span className="group-hover:opacity-80">Go back</span>
                </button>

                <div className="rounded-lg w-full flex items-center justify-between px-6 py-6 bg-white dark:bg-[#1e2139]">
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="Logo" className="h-10" />
                        <h1 className="text-gray-600 dark:text-gray-400">Status</h1>
                        <PaidStatus type={invoice.status} />
                    </div>
                    <div className="hidden md:flex">
                        <button onClick={() => setIsEditOpen(true)} className="text-[#7e88c3] bg-slate-100 dark:bg-[#252945] p-3 px-7 rounded-full hover:opacity-80">
                            Edit
                        </button>
                        <button onClick={() => setIsDeleteModalOpen(true)} className="ml-3 text-white bg-red-500 p-3 px-7 rounded-full hover:opacity-80">
                            Delete
                        </button>
                        {invoice.status === 'pending' && (
                            <button onClick={handleMakePaid} className="ml-3 text-white bg-[#7c5dfa] p-3 px-7 rounded-full hover:opacity-80">
                                Mark as Paid
                            </button>
                        )}
                    </div>
                </div>

                <div className="rounded-lg w-full px-6 py-6 bg-white dark:bg-[#1e2139]">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-10">
                        <div>
                            <h1 className="text-xl font-semibold dark:text-white">
                                <span className="text-[#7e88c3]">#</span>
                                {invoice.id}
                            </h1>
                            <p className="text-sm text-gray-500">{invoice.clientName}</p>
                        </div>
                        <address className="mt-4 md:mt-0 text-sm text-gray-400 md:text-right">
                            {Object.values(invoice.senderAddress).map((value, index) => (
                                <p key={index}>{value}</p>
                            ))}
                        </address>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <div className="flex flex-col">
                            <h3 className="text-gray-400">Invoice Date</h3>
                            <h1 className="dark:text-white text-lg font-semibold">{formatDate(invoice.createdAt)}</h1>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-gray-400">Payment Due</h3>
                            <h1 className="dark:text-white text-lg font-semibold">{formatDate(invoice.paymentDue)}</h1>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-gray-400">Bill to</h3>
                            <h1 className="dark:text-white text-lg font-semibold">{invoice.clientName}</h1>
                            <address className="text-gray-400">
                                {Object.values(invoice.clientAddress).map((value, index) => (
                                    <p key={index}>{value}</p>
                                ))}
                            </address>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-gray-400">Sent to</h3>
                            <h1 className="dark:text-white text-lg font-semibold">{invoice.clientEmail}</h1>
                        </div>
                    </div>

                    <div className="mt-10 p-10 bg-[#f9fafe] dark:bg-[#252945] rounded-lg">
                        <div className="space-y-4">
                            {invoice.items.map((item) => (
                                <div key={item.name} className="flex justify-between">
                                    <span className="dark:text-white">{item.name}</span>
                                    <span className="dark:text-white">${item.total}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 bg-gray-700 dark:bg-black rounded-lg flex justify-between items-center text-white font-semibold">
                        <span className="text-xl">Amount Due</span>
                        <span className="text-3xl">${invoice.total}</span>
                    </div>
                </div>
            </div>

            {isDeleteModalOpen && <DeleteModal onDeleteButtonClick={handleDelete} setIsDeleteModalOpen={setIsDeleteModalOpen} invoiceId={invoice.id} />}
            <AnimatePresence>
                {isEditOpen && <CreateInvoice invoice={invoice} type="edit" setOpenCreateInvoice={setIsEditOpen} />}
            </AnimatePresence>

            <button
                onClick={handleDownloadInvoice}
                className="fixed bottom-10 right-10 z-10 bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded-full shadow-lg transition duration-300"
            >
                Download Invoice
            </button>
        </motion.div>
    );
};

// Add PropTypes validation
InvoiceInfo.propTypes = {
    onDelete: PropTypes.func.isRequired,
};

export default InvoiceInfo;
