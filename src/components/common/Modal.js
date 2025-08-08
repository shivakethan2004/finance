import React, { useEffect } from 'react';

const Modal = ({ visible, handleModalToggle, children }) => {
    const handleClickOutside = (event) => {
        if (event.target === event.currentTarget) {
            handleModalToggle();
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                handleModalToggle();
            }
        };

        if (visible) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [visible, handleModalToggle]);

    if (!visible) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm grid place-content-center z-20' onClick={handleClickOutside}>
            <div className='bg-white p-2 rounded'>
                {children}
            </div>
        </div>
    );
};

export default Modal;
