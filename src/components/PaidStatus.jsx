import PropTypes from 'prop-types';

function PaidStatus({ type }) {
    const statusClasses = {
        paid: {
            text: 'text-[#33d69f]',
            background: 'bg-[#33d69f0f]',
            dot: 'bg-[#33d69f]',
        },
        pending: {
            text: 'text-[#ff8f00]',
            background: 'bg-[#ff8f000f]',
            dot: 'bg-[#ff8f00]',
        },
        draft: {
            text: 'text-[#dfe3fa]',
            background: 'bg-[#dfe3fa0f]',
            dot: 'bg-[#dfe3fa]',
        },
    };

    const { text, background, dot } = statusClasses[type] || statusClasses.draft;

    return (
        <div
            className={`${background} flex justify-center items-center space-x-2 rounded-lg px-4 py-2`}
        >
            <div className={`h-3 w-3 rounded-full ${dot}`} />
            <p className={text}>{type}</p>
        </div>
    );
}

// Add PropTypes validation
PaidStatus.propTypes = {
    type: PropTypes.oneOf(['paid', 'pending', 'draft']).isRequired,
};

export default PaidStatus;
