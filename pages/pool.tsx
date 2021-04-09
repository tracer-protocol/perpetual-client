import React from 'react';
import NavBar from '@components/Nav/NavBar';
import Pools from '@components/Pool';

const Pool: React.FC = () => {
    return (
        <div className="page">
            <NavBar />
            <Pools />
        </div>
    );
};

export default Pool;
