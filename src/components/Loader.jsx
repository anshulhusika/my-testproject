
import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center p-4">

            <div class="loading">
                <svg width="64px" height="48px">
                    <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
                    <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
                </svg>
            </div>
        </div>
    );
};

export default Loader;