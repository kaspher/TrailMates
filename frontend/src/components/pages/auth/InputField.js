import React from 'react';

function InputField({ id, type, label, value, onChange }) {
    return (
        <div className="mb-4 relative">
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="bg-transparent bg-gray-100
                    h-10 w-full px-2
                    text-gray-600
                    placeholder-transparent
                    rounded-md border-gray-300
                    ring-gray-500
                    focus:ring-sky-600
                    focus:outline-none
                    focus:border-blue-500
                    peer"
                placeholder=" "/>
            <label
                htmlFor={id}
                className="absolute
                    cursor-text bg-gray-100
                    left-0 -top-3 mx-1 px-1
                    text-sm text-gray-500
                    peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500
                    peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600
                    peer-focus:text-sm
                    transition-all">
                {label}
            </label>
        </div>
    );
}

export default InputField;
