import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRightLong } from "react-icons/fa6";

const Error = () => {
    return (
        <div className='w-screen h-[90vh] flex justify-center items-center text-3xl text-white'>
            <div className='items-center text-center flex flex-col gap-4'>
                <p><span className='text-7xl'>404</span> <br /> Page Not Found!</p>
                <Link to='/' className='flex flex-row items-center gap-2 py-3 px-8 bg-yellow-50 text-black text-xl rounded-md hover:scale-95 transition-all duration-300'>
                    Go to Home Page <FaArrowRightLong />
                </Link>
            </div>
        </div>
    );
};

export default Error;
