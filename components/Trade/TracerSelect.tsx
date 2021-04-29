import React, { useContext } from 'react';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import { CaretDownFilled } from '@ant-design/icons';
import { OrderContext, TracerContext } from '../../context';
import { OrderState } from '@context/OrderContext';
import styled from 'styled-components';

import { useMarketPairs } from '../../hooks';
import { MarginDeposit } from '../Buttons';
import { Button, Logo } from '@components/General';

export const WalletBalance: React.FC<{ marginBalance: number }> = ({ marginBalance }: { marginBalance: number }) => {
    const { orderDispatch } = useContext(OrderContext);
    return (
        <div className="px-3 text-blue-100 font-normal flex">
            <p className="mt-auto mb-auto">
                {marginBalance < 0 ? `Fetching balance...` : `Acc. Margin Balance: ${marginBalance}`}
            </p>
            <span className="mt-auto mb-auto ml-auto w-full flex justify-end">
                {marginBalance <= 0 ? (
                    <MarginDeposit />
                ) : (
                    // max rMargin will be walletBalance - 10%
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            orderDispatch
                                ? orderDispatch({ type: 'setRMargin', value: marginBalance })
                                : console.error('Order dispatch not set');
                        }}
                        className="secondary-button"
                    >
                        Max
                    </button>
                )}
            </span>
        </div>
    );
};

const SLabel = styled.h3`
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #3da8f5;
    margin-right: auto;
`;

const SSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 10px 0;
`;

const InputContainer = styled.div`
    width: full;
    display: flex;
    border-bottom: 1px solid #002886;
`;

const MaxButton = styled(Button)`
    width: 60px;
    padding: 5px 0;
`;

const Balance = styled.p`
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #3da8f5;
    text-transform: capitalize;
    margin: auto 10px;
`;

const SInput = styled.input`
    font-size: 60px;
    letter-spacing: 0px;
    color: #ffffff;
    width: 100%;

    &:focus {
        border: none;
        outline: none;
        box-shadow: none;
    }
`;

const SDropdown = styled(Dropdown)`
    border: 1px solid #3da8f5;
    border-radius: 20px;
    min-height: 40px;
    min-width: 115px;
    margin-top: auto;
    margin-bottom: 10px;
    &:hover {
        cursor: pointer;
    }
`;

const DropDownContent = styled.div`
    display: flex;
    padding: 0 5px;
    text-align: center;
`;

const SDownCaret = styled(CaretDownFilled)`
    color: rgb(61, 168, 245);
    padding: 0 5px;
    margin: auto 0;
`;

const DropDownText = styled.div`
    margin: auto;
    margin-right: 0;
    font-size: 16px;
`;

type TSProps = {
    className?: string;
};

const TracerSelect: React.FC<TSProps> = styled(({ className }: TSProps) => {
    const { exposure, tradePrice, order, orderDispatch } = useContext(OrderContext);
    const { selectedTracer } = useContext(TracerContext);
    const { rMargin, market, collateral, price } = order as OrderState;
    const marketPairs = useMarketPairs();

    const collaterals = (
        <Menu
            onClick={({ key }) =>
                orderDispatch
                    ? orderDispatch({ type: 'setCollateral', value: key.toString() })
                    : console.error('Order dispatch undefined')
            }
        >
            {Object.keys(marketPairs)?.map((option) => {
                return <Menu.Item key={option}>{option}</Menu.Item>;
            })}
        </Menu>
    );
    const markets = (
        <Menu
            onClick={({ key }) =>
                orderDispatch
                    ? orderDispatch({ type: 'setMarket', value: key.toString() })
                    : console.error('Order dispatch undefined')
            }
        >
            {marketPairs[collateral]?.map((option) => {
                return <Menu.Item key={option}>{option}</Menu.Item>;
            })}
        </Menu>
    );

    //get market address -> using tracer factory helper function
    //pass in address and initialise Tracer -> get all open orders of the address
    return (
        <div className={className}>
            {/* MARGIN DEPOSIT */}
            <SSection>
                <div className="flex">
                    <SLabel>Amount to buy</SLabel>
                    <MaxButton>Max</MaxButton>
                </div>
                <InputContainer>
                    <SInput
                        id="username"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        onChange={(e) => {
                            e.preventDefault();
                            orderDispatch
                                ? orderDispatch({ type: 'setRMargin', value: parseFloat(e.target.value) })
                                : console.error('Order dispatch not set');
                        }}
                        value={rMargin > 0 ? rMargin : ''}
                    />
                    <SDropdown overlay={markets} trigger={['click']}>
                        <DropDownContent>
                            <Logo ticker="ETH" />
                            <DropDownText>{market}</DropDownText>
                            <SDownCaret />
                        </DropDownContent>
                    </SDropdown>
                </InputContainer>
            </SSection>

            {/* MARKET EXPOSURE */}
            <SSection>
                <div className="flex">
                    <SLabel>Amount to pay</SLabel>
                    <Balance>Balance: {selectedTracer?.balances?.tokenBalance ?? 0}</Balance>
                    <MaxButton>Max</MaxButton>
                </div>
                <InputContainer>
                    <SInput
                        id="username"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        onChange={(e) => {
                            e.preventDefault();
                            orderDispatch
                                ? orderDispatch({ type: 'setRMargin', value: parseFloat(e.target.value) })
                                : console.error('Order dispatch not set');
                        }}
                        value={rMargin > 0 ? rMargin : ''}
                    />
                    <SDropdown overlay={collaterals} trigger={['click']}>
                        <DropDownContent>
                            <DropDownText>{collateral}</DropDownText>
                            <SDownCaret />
                        </DropDownContent>
                    </SDropdown>
                </InputContainer>
            </SSection>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
`;

export default TracerSelect;
