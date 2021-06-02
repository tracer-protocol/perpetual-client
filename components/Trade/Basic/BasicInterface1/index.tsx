import React, { useContext } from 'react';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import { CaretDownFilled } from '@ant-design/icons';
import { OrderContext, TracerContext } from '@context/index';
import { OrderAction, OrderState } from '@context/OrderContext';
import styled from 'styled-components';
import { useMarketPairs } from '@hooks/TracerHooks';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Button, Logo, BasicInputContainer, Input } from '@components/General';
import Tooltip from 'antd/lib/tooltip';
import { BigNumber } from 'bignumber.js';

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

const MaxButton: any = styled(Button)`
    width: 60px;
    padding: 0;
    height: 30px;
    line-height: 28px;
`;

const Balance = styled.p`
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #3da8f5;
    text-transform: capitalize;
    margin: 0 10px auto 10px;
`;

const SDropdown = styled(Dropdown)`
    border: 1px solid #3da8f5;
    border-radius: 20px;
    min-height: 30px;
    min-width: 90px;
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
    margin: auto 0 auto auto;
    font-size: 16px;
`;

const RightContainer = styled.div`
    white-space: nowrap;
    display: flex;
    margin-top: 5px;
`;

interface WSProps {
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    wallet: number; // id of selected wallet
    className?: string;
}

const SSlideSelect = styled(SlideSelect)`
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #ffffff;
    width: 200px;
    height: 30px;
`;

const walletTip = (
    <p>
        <strong>Wallet</strong> This trade will use funds from your connected Web3 wallet.
    </p>
);

const marginTip = (
    <p>
        <strong>Margin</strong> This trade will use funds from your margin account. To deposit funds to your margin
        account, switch to Advanced Trading.
    </p>
);

const WalletSelect: React.FC<WSProps> = styled(({ className, orderDispatch, wallet }: WSProps) => {
    return (
        <div className={className}>
            <p>Paying from</p>
            <SSlideSelect
                onClick={(index: number, _e: any) =>
                    orderDispatch
                        ? orderDispatch({ type: 'setWallet', value: index })
                        : console.error('Order dispatch function not set')
                }
                value={wallet}
            >
                <Option>
                    <Tooltip title={walletTip}>Wallet</Tooltip>
                </Option>
                <Option>
                    <Tooltip title={marginTip}>Margin</Tooltip>
                </Option>
            </SSlideSelect>
        </div>
    );
})`
    display: flex;
    p {
        color: #3da8f5;
        margin: auto 5px;
    }
`;

const BasicInterface1: React.FC = styled(({ className }) => {
    const { order, orderDispatch } = useContext(OrderContext);
    const { selectedTracer } = useContext(TracerContext);
    const { orderBase, market, collateral, exposure } = order as OrderState;
    const marketPairs = useMarketPairs();
    const balance =
        order?.wallet === 0
            ? selectedTracer?.balances?.tokenBalance.toNumber()
            : selectedTracer?.balances?.quote.toNumber();
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
                <SLabel>
                    <span>Amount to buy</span>
                </SLabel>

                <BasicInputContainer>
                    <Input
                        id="exposure"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        onChange={(e) => {
                            e.preventDefault();
                            if (orderDispatch) {
                                orderDispatch({ type: 'setLock', value: false });
                                orderDispatch({ type: 'setExposure', value: new BigNumber(e.target.value) });
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                        value={exposure.gt(0) ? exposure.toString(10) : ''}
                    />

                    <div className="flex">
                        <MaxButton
                            className="mr-2 my-auto"
                            onClick={(e: any) => {
                                e.preventDefault();
                                if (orderDispatch) {
                                    orderDispatch({ type: 'setLock', value: false });
                                    orderDispatch({ type: 'setExposure', value: new BigNumber(e.target.value) });
                                } else {
                                    console.error('Order dispatch not set');
                                }
                            }}
                        >
                            Max
                        </MaxButton>

                        <SDropdown className="mt-1 pr-4" overlay={markets} trigger={['click']}>
                            <DropDownContent>
                                <Logo ticker="ETH" clear={true} />
                                <DropDownText>{market}</DropDownText>
                                <SDownCaret />
                            </DropDownContent>
                        </SDropdown>
                    </div>
                </BasicInputContainer>
            </SSection>

            {/* MARKET EXPOSURE */}
            <SSection>
                <div className="flex">
                    <SLabel>
                        <span>Amount to pay</span>
                    </SLabel>
                    <WalletSelect orderDispatch={orderDispatch} wallet={order?.wallet ?? 0} />
                </div>

                <BasicInputContainer>
                    <Input
                        id="margin"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        onChange={(e) => {
                            e.preventDefault();
                            if (orderDispatch) {
                                orderDispatch({ type: 'setLock', value: true });
                                orderDispatch({ type: 'setOrderBase', value: parseFloat(e.target.value) ?? 0 });
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                        value={orderBase > 0 ? orderBase : ''}
                    />

                    <RightContainer className="mt-4">
                        <Balance>Available: {balance ?? ''}</Balance>
                        <MaxButton
                            className="mr-2"
                            onClick={(e: any) => {
                                e.preventDefault();
                                if (orderDispatch) {
                                    orderDispatch({ type: 'setLock', value: true });
                                    orderDispatch({ type: 'setOrderBase', value: balance ?? 0 });
                                } else {
                                    console.error('Order dispatch not set');
                                }
                            }}
                        >
                            Max
                        </MaxButton>
                        <SDropdown overlay={collaterals} trigger={['click']}>
                            <DropDownContent>
                                <DropDownText>{collateral}</DropDownText>
                                <SDownCaret />
                            </DropDownContent>
                        </SDropdown>
                    </RightContainer>
                </BasicInputContainer>
            </SSection>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
`;

export default BasicInterface1;
