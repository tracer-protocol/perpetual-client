import React from 'react';

const Timer: React.FC = () => {
    return (
        <div className="h-1 bg-blue-200 w-full relative">
            <div id="refetchLoader" className={`h-1 absolute bg-blue-100 transition right-0`} />
            <style>
                {`
                @keyframes countdown-width {
                    from { width: 100%; } to { width: 0% }
                }

                #refetchLoader {
                    animation: countdown-width 5s linear infinite;
                }
            `}
            </style>
        </div>
    );
};

export default Timer;
