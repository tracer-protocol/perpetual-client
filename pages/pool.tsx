import React from 'react';
import NavBar from '@components/components/Nav/Navbar';
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
