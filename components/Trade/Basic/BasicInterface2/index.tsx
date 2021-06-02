import React, { useContext } from 'react';
import Dropdown from 'antd/lib/dropdown';
import { CaretDownFilled } from '@ant-design/icons';
import { OrderContext } from '@context/index';
import { OrderState } from '@context/OrderContext';
import styled from 'styled-components';
import { useMarketPairs } from '@hooks/TracerHooks';
import { Logo, BasicInputContainer, Input } from '@components/General';
import { collaterals, markets, walletMenu } from '../Menus';

const SLabel = styled.h3`
    display: flex;
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #3da8f5;
    margin-right: auto;

    span {
        margin: auto;
    }
`;

const SSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 10px 0;
`;

const SDropdown = styled(Dropdown)`
    border: 1px solid #3da8f5;
    border-radius: 20px;
    max-height: 50px;
    min-width: 90px;
    margin-bottom: auto;

    &:hover {
        cursor: pointer;
    }
`;

const LDropdown = styled(Dropdown)`
    border: 1px solid #3da8f5;
    border-radius: 20px;
    min-height: 40px;
    min-width: 130px;
    margin-top: auto;
    margin-bottom: auto;

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
    font-size: 16px;
`;

const RightContainer = styled.div`
    white-space: nowrap;
    display: flex;
    margin-top: 5px;
`;

const BasicInterface2: React.FC = styled(({ className }) => {
    const { order, orderDispatch } = useContext(OrderContext);
    const { amountToPay, market, collateral } = order as OrderState;
    const marketPairs = useMarketPairs();
    const wallets = ['Wallet', 'Margin'];

    //get market address -> using tracer factory helper function
    //pass in address and initialise Tracer -> get all open orders of the address
    return (
        <div className={className} id="basicInterface2">
            {/* MARGIN DEPOSIT */}
            <SSection>
                <SLabel className="mb-2">Select Market</SLabel>
                <BasicInputContainer className="pb-2">
                    <SDropdown overlay={markets(orderDispatch, marketPairs[collateral] ?? [])} trigger={['click']}>
                        <DropDownContent>
                            <Logo ticker="ETH" clear={true} />
                            <DropDownText>{market}</DropDownText>
                            <SDownCaret />
                        </DropDownContent>
                    </SDropdown>
                    <div className="ml-3">
                        <SLabel>Current Price</SLabel>
                        <div>$3,302.21 USD</div>
                    </div>
                </BasicInputContainer>
            </SSection>

            {/* MARKET EXPOSURE */}
            <SSection className="mt-4 mb-4">
                <div className="flex">
                    <SLabel>
                        <span>Amount to pay</span>
                    </SLabel>
                </div>

                <BasicInputContainer className="pb-2">
                    <LDropdown
                        overlay={collaterals(orderDispatch, Object.keys(marketPairs))}
                        trigger={['click']}
                        className="mr-3"
                    >
                        <DropDownContent>
                            <DropDownText>{collateral}</DropDownText>
                            <SDownCaret />
                        </DropDownContent>
                    </LDropdown>

                    <Input
                        id="margin"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        onChange={(e) => {
                            e.preventDefault();
                            if (orderDispatch) {
                                orderDispatch({ type: 'setAmountToPay', value: parseFloat(e.target.value) ?? 0 });
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                        value={amountToPay > 0 ? amountToPay : ''}
                    />

                    <RightContainer>
                        <LDropdown overlay={walletMenu(orderDispatch, wallets)} trigger={['click']}>
                            <DropDownContent>
                                <DropDownText>{wallets[order?.wallet ?? 0]}</DropDownText>
                                <SDownCaret />
                            </DropDownContent>
                        </LDropdown>
                    </RightContainer>
                </BasicInputContainer>
            </SSection>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
`;

export default BasicInterface2;
