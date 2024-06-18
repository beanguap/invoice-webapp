import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import invoiceSlice from '../redux/invoiceSlice';
import formatDate from '../functions/formatDate';
import DeleteModal from './DeleteModal';
import CreateInvoice from './CreateInvoice';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import leftArrow from '../assets/icon-arrow-left.svg';
import PaidStatus from './PaidStatus';
import logo from '../assets/logo.png'; // Import your logo image file

function InvoiceInfo({ onDelete }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const invoiceId = location.search.substring(1);

    const onMakePaidClick = () => {
        dispatch(invoiceSlice.actions.updateInvoiceStatus({ id: invoiceId, status: 'paid' }));
        dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }));
    };

    useEffect(() => {
        dispatch(invoiceSlice.actions.getInvoiceById({ id: invoiceId }));
    }, [invoiceId]);

    const onDeleteButtonClick = () => {
        navigate('/');
        setIsDeleteModalOpen(false);
        onDelete(invoiceId);
    };

    const invoice = useSelector((state) => state.invoices.invoiceById);

    const handleDownloadInvoice = () => {
        const input = document.getElementById('invoice-info'); // Element to be converted to PDF
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgHeight = canvas.height * 208 / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, 208, imgHeight);
                pdf.save(`invoice_${invoice.id}.pdf`);
            });
    };

    return (
        <div>
            {invoice ? (
                <motion.div
                    id='invoice-info'
                    key='invoice-info'
                    initial={{ x: 0 }}
                    animate={{ x: 0 }}
                    exit={{ x: '200%' }}
                    transition={{ duration: 0.5 }}
                    className='dark:bg-[#141625] mx-auto duration-300 min-h-screen bg-[#f8f8fb] py-[34px] px-2 md:px-8 lg:px-12 max-w-3xl lg:py-[72px]'>
                    <div className=''>
                        <button onClick={() => navigate(-1)} className='flex items-center space-x-4 group dark:text-white font-thin'>
                            <img className='' src={leftArrow} alt='Left Arrow Icon' />
                            <p className='group-hover:opacity-80'>Go back</p>
                        </button>

                        <div className='mt-8 rounded-lg w-full flex items-center justify-between px-6 py-6 bg-white dark:bg-[#1e2139]'>
                            <div className='flex space-x-2 justify-between md:justify-start md:w-auto w-full items-center'>
                                <img src={logo} alt='Logo' className='h-10' /> {/* Add your logo here */}
                                <h1 className='text-gray-600 dark:text-gray-400'>Status</h1>
                                <PaidStatus type={invoice.status} />
                            </div>
                            <div className='md:block hidden'>
                                <button onClick={() => setIsEditOpen(true)} className='text-[#7e88c3] text-center dark:bg-[#252945] hover:opacity-80 bg-slate-100 p-3 px-7 rounded-full'>Edit</button>
                                <button onClick={() => setIsDeleteModalOpen(true)} className='ml-3 text-center text-white bg-red-500 hover:opacity-80 p-3 px-7 rounded-full'>Delete</button>
                                {invoice.status === 'pending' && (
                                    <button onClick={onMakePaidClick} className='ml-3 text-center text-white bg-[#7c5dfa] hover:opacity-80 p-3 px-7 rounded-full'>Mark as Paid</button>
                                )}
                            </div>
                        </div>

                        <div className='mt-4 rounded-lg w-full px-6 py-6 bg-white dark:bg-[#1e2139]'>

                            <div className='flex flex-col md:flex-row items-start justify-between w-full'>
                                <div>
                                    <h1 className='font-semibold dark:text-white text-xl'><span className='text-[#7e88c3]'>#</span>{invoice.id}</h1>
                                    <p className='text-sm text-gray-500'>{invoice.clientName}</p>
                                </div>
                                <div className='mt-4 md:mt-0 text-left text-gray-400 text-sm md:text-right flex flex-col items-center'>
                                    <p>{invoice.senderAddress.street}</p>
                                    <p>{invoice.senderAddress.city}</p>
                                    <p>{invoice.senderAddress.postCode}</p>
                                    <p>{invoice.senderAddress.country}</p>
                                </div>
                            </div>

                            <div className='mt-10 grid grid-cols-2 w-full md:grid-cols-3'>
                                <div className='flex flex-col justify-between'>
                                    <div>
                                        <h3 className='text-gray-400 font-thin'>Invoice Date</h3>
                                        <h1 className='text-lg font-semibold dark:text-white'>{formatDate(invoice.createdAt)}</h1>
                                    </div>
                                    <div>
                                        <h3 className='text-gray-400 font-thin'>Payment Due</h3>
                                        <h1 className='dark:text-white text-lg font-semibold'>{formatDate(invoice.paymentDue)}</h1>
                                    </div>
                                </div>

                                <div>
                                    <p className='text-gray-400 font-thin'>Bill to</p>
                                    <h1 className='dark:text-white text-lg font-semibold'>{invoice.clientName}</h1>
                                    <p className='text-gray-400 font-thin'>{invoice.clientAddress.street}</p>
                                    <p className='text-gray-400 font-thin'>{invoice.clientAddress.city}</p>
                                    <p className='text-gray-400 font-thin'>{invoice.clientAddress.postCode}</p>
                                    <p className='text-gray-400 font-thin'>{invoice.clientAddress.country}</p>
                                </div>

                                <div className='mt-8 md:mt-0'>
                                    <p className='text-gray-400 font-thin'>Sent to</p>
                                    <h1 className='dark:text-white text-lg font-semibold'>{invoice.clientEmail}</h1>
                                </div>
                            </div>

                            <div className='sm:hidden mt-10 bg-[#f9fafe] dark:bg-[#252945] rounded-lg rounded-b-none space-y-4 p-10'>
                                {invoice.items.map(item => (
                                    <div className='justify-between text-lg dark:text-white flex' key={item.name}>
                                        <h1>{item.name}</h1>
                                        <h1>${item.total}</h1>
                                    </div>
                                ))}
                            </div>

                            <div className='hidden sm:block mt-10 bg-[#f9fafe] dark:bg-[#252945] rounded-lg rounded-b-none space-y-4 p-10'>
                                {invoice.items.map(item => (
                                    <div key={item.name} className='flex justify-around'>
                                        <div className='space-y-4'>
                                            <p className='text-gray-400 font-thin'>Item name</p>
                                            <h1 className='dark:text-white text-base font-semibold'>{item.name}</h1>
                                        </div>
                                        <div className='space-y-4'>
                                            <p className='text-gray-400 font-thin'>Qty.</p>
                                            <h1 className='dark:text-white text-base font-semibold'>{item.quantity}</h1>
                                        </div>
                                        <div className='space-y-4'>
                                            <p className='text-gray-400 font-thin'>Item price</p>
                                            <h1 className='dark:text-white text-base font-semibold'>${item.price}</h1>
                                        </div>
                                        <div className='space-y-4'>
                                            <p className='text-gray-400 font-thin'>Total</p>
                                            <h1 className='dark:text-white text-base font-semibold'>${item.total}</h1>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='p-10 font-semibold text-white rounded-lg rounded-t-none justify-between flex dark:bg-black bg-gray-700'>
                                <h3 className='text-xl'>Amount Due</h3>
                                <h1 className='text-3xl'>${invoice.total}</h1>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <p>Loading...</p>
            )}

            {isDeleteModalOpen && <DeleteModal onDeleteButtonClick={onDeleteButtonClick} setIsDeleteModalOpen={setIsDeleteModalOpen} invoiceId={invoice.id} />}
            <AnimatePresence>
                {isEditOpen && <CreateInvoice invoice={invoice} type='edit' setOpenCreateInvoice={setIsEditOpen} />}
            </AnimatePresence>

            {/* Download Invoice Button */}
            <button onClick={handleDownloadInvoice} className='fixed bottom-10 right-10 z-10 bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded-full shadow-lg transition duration-300'>
                Download Invoice
            </button>
        </div>
    );
}

export default InvoiceInfo;
