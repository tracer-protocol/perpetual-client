import React from 'react';
import styled from 'styled-components';
import { Button } from '@components/General';
import { CaretRightOutlined } from '@ant-design/icons';

const SButton = styled(Button)`
	height: 24px;
	background: #002886;
	line-height: 24px;
	font-size: 12px;
	letter-spacing: -0.24px;
	padding: 0;
	margin-right: 0;
	border: none;
	color: #fff;
    &:focus,
    &:active {
		border: none;
	}
`;

const RightArrow = styled(CaretRightOutlined)`
	vertical-align: 0;
	font-size: 14px;
	margin-left: 0.5rem;
`

type ISProps = {
    isAdjust: boolean,
    setAdjust: React.Dispatch<React.SetStateAction<boolean>>
    className?: string,
}

export default styled(({ 
    className, isAdjust, setAdjust 
}: ISProps ) => {
    return (
        <div className={className}>
            <p>{isAdjust ? 'Adjust Position' : 'Place Order'}</p>
            {isAdjust
                ? 
                    <SButton onClick={() => setAdjust(false)}>
                        Switch to Place
						<RightArrow />
                    </SButton>
                : 
                    <SButton onClick={() => setAdjust(true)}>
                        Switch to Adjust 
						<RightArrow />
                    </SButton>
            }
        </div>
    )
})`
    font-size: 20px;
    letter-spacing: -0.4px;
    color: #fff;
	display: flex;
    justify-content: space-between;
	padding: 20px;
	z-index: 1;
` as React.FC<ISProps>;