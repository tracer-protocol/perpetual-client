import React from 'react';

interface ICProps {
    image: any;
}

const Icon: React.FC<ICProps> = ({ image }: ICProps) => {
    return (
        <>
            <picture>
                <img src={image} />
            </picture>
        </>
    );
};

export default Icon;
