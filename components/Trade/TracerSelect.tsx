import React, { useContext } from 'react';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import { CaretDownFilled, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { OrderContext, TracerContext } from 'context';
import { OrderAction, OrderState } from '@context/OrderContext';
import styled from 'styled-components';
import { useMarketPairs } from '../../hooks';
import { MarginDeposit, SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Button, Logo } from '@components/General';
import Tooltip from 'antd/lib/tooltip';

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

const InputContainer = styled.div`
    width: full;
    display: flex;
    border-bottom: 1px solid #002886;
`;

const MaxButton: any = styled(Button)`
    width: 60px;
    padding: 0;
    height: 30px;
    margin-left: 5px;
    margin-right: 5px;
`;

const Balance = styled.p`
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #3da8f5;
    text-transform: capitalize;
    margin: auto 10px;
    margin-top: 0;
`;

const SInput = styled.input`
    font-size: 42px;
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
    margin: auto;
    margin-right: 0;
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

const Lock: React.FC<{
    margin: boolean;
    lock: boolean;
    orderDispatch: React.Dispatch<OrderAction> | undefined;
}> = ({ margin, lock, orderDispatch }) => {
    const lock_ = (
        <LockOutlined
            className="mx-2"
            color="#3da8f5"
            onClick={(e) => {
                e.preventDefault();
                orderDispatch
                    ? orderDispatch({ type: 'setLock', value: !margin })
                    : console.error('Order dispatch function not set');
            }}
        />
    );
    const unlock_ = (
        <UnlockOutlined
            className="mx-2"
            color="#3da8f5"
            onClick={(e) => {
                e.preventDefault();
                orderDispatch
                    ? orderDispatch({ type: 'setLock', value: margin })
                    : console.error('Order dispatch function not set');
            }}
        />
    );
    if (margin) {
        // ie lock for margin input
        if (lock) {
            return lock_;
        } else {
            return unlock_;
        }
    } else {
        // this is just opposite logic
        if (!lock) {
            return lock_;
        } else {
            return unlock_;
        }
    }
};
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

type TSProps = {
    className?: string;
};

const TracerSelect: React.FC<TSProps> = styled(({ className }: TSProps) => {
    const { order, orderDispatch } = useContext(OrderContext);
    const { selectedTracer } = useContext(TracerContext);
    const { rMargin, market, collateral, exposure } = order as OrderState;
    const marketPairs = useMarketPairs();
    const balance = order?.wallet === 0 ? selectedTracer?.balances?.tokenBalance : selectedTracer?.balances?.quote;
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
                    <SLabel>
                        <span>Amount to buy</span>
                        <Lock orderDispatch={orderDispatch} margin={false} lock={order?.lock ?? false} />
                    </SLabel>
                    <MaxButton
                        onClick={(e: any) => {
                            e.preventDefault();
                            if (orderDispatch) {
                                orderDispatch({ type: 'setLock', value: false });
                                orderDispatch({ type: 'setExposure', value: parseFloat(e.target.value) });
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                    >
                        Max
                    </MaxButton>
                </div>
                <InputContainer>
                    <SInput
                        id="exposure"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        onChange={(e) => {
                            e.preventDefault();
                            if (orderDispatch) {
                                orderDispatch({ type: 'setLock', value: false });
                                orderDispatch({ type: 'setExposure', value: parseFloat(e.target.value) });
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                        value={exposure > 0 ? exposure : ''}
                    />
                    <SDropdown className="mt-1 pr-4" overlay={markets} trigger={['click']}>
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
                    <SLabel>
                        <span>Amount to pay</span>
                        <Lock orderDispatch={orderDispatch} margin={true} lock={order?.lock ?? false} />
                    </SLabel>
                    <WalletSelect orderDispatch={orderDispatch} wallet={order?.wallet ?? 0} />
                </div>
                <InputContainer>
                    <SInput
                        id="margin"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        onChange={(e) => {
                            e.preventDefault();
                            if (orderDispatch) {
                                orderDispatch({ type: 'setLock', value: true });
                                orderDispatch({ type: 'setRMargin', value: parseFloat(e.target.value) });
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                        value={rMargin > 0 ? rMargin : ''}
                    />
                    <RightContainer>
                        <Balance>Balance: {balance ?? '-'}</Balance>
                        <MaxButton
                            onClick={(e: any) => {
                                e.preventDefault();
                                if (orderDispatch) {
                                    orderDispatch({ type: 'setLock', value: true });
                                    orderDispatch({ type: 'setRMargin', value: balance ?? 0 });
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
                </InputContainer>
            </SSection>
        </div>
    );
})`
    display: flex;
    flex-direction: column;
`;

export default TracerSelect;
