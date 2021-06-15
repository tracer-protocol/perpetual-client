import React, { useContext } from 'react';
import Dropdown from 'antd/lib/dropdown';
import { CaretDownFilled } from '@ant-design/icons';
import { OrderContext, TracerContext } from '@context/index';
import { OrderState } from '@context/OrderContext';
import styled from 'styled-components';
import { useMarketPairs } from '@hooks/TracerHooks';
import { Logo, BasicInputContainer, Input } from '@components/General';
import { markets, walletMenu } from '../Menus';
import { toApproxCurrency } from '@libs/utils';
import { defaults } from '@libs/Tracer';
import { MaxButton } from '../BasicInterface1';

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
    min-width: 120px;

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
    margin-top: 5px;
    color: #3da8f5;
    display: flex;
`;

const BasicInterface2: React.FC = styled(({ className }) => {
    const { order, orderDispatch } = useContext(OrderContext);
    const { selectedTracer } = useContext(TracerContext);
    const { amountToPay, market, collateral, amountToBuy } = order as OrderState;
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const balance = order?.wallet === 0 ? balances?.tokenBalance?.toNumber() : balances?.quote?.toNumber();
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
                        <div>{toApproxCurrency(selectedTracer?.getOraclePrice() ?? defaults.oraclePrice)}</div>
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
                    <span className="mt-auto mr-2">{collateral}</span>
                    <Input
                        id="margin"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        className="mt-auto"
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
                        <MaxButton
                            className="mr-2 mt-auto mb-0"
                            onClick={(e: any) => {
                                e.preventDefault();
                                if (orderDispatch) {
                                    orderDispatch({ type: 'setLock', value: false });
                                    orderDispatch({ type: 'setAmountToPay', value: balance ?? 0 });
                                } else {
                                    console.error('Order dispatch not set');
                                }
                            }}
                        >
                            <span>Max</span>
                        </MaxButton>
                        <span className="inline-block">
                            <div className="text-right mr-2 mb-2">Paying From</div>
                            <LDropdown overlay={walletMenu(orderDispatch, wallets)} trigger={['click']}>
                                <DropDownContent>
                                    <DropDownText>{wallets[order?.wallet ?? 0]}</DropDownText>
                                    <SDownCaret />
                                </DropDownContent>
                            </LDropdown>
                        </span>
                    </RightContainer>
                </BasicInputContainer>
            </SSection>
            <SSection>
                <SLabel className="mb-2">Your Exposure</SLabel>
                <BasicInputContainer className="pb-2">
                    <SDropdown overlay={markets(orderDispatch, marketPairs[collateral] ?? [])} trigger={['click']}>
                        <DropDownContent>
                            <Logo ticker="ETH" clear={true} />
                            <DropDownText>{market}</DropDownText>
                            <SDownCaret />
                        </DropDownContent>
                    </SDropdown>
                    <Input
                        id="base"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        className="ml-2 mt-auto"
                        min="0"
                        value={amountToBuy > 0 ? amountToBuy : ''}
                    />
                </BasicInputContainer>
            </SSection>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
`;

export default BasicInterface2;
