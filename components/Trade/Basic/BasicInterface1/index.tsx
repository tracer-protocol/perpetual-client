import React, { useContext } from 'react';
import Dropdown from 'antd/lib/dropdown';
import {
    CaretDownFilled,
    LockOutlined,
    UnlockOutlined,
} from '@ant-design/icons';
import { OrderContext, TracerContext } from '@context/index';
import { OrderAction, OrderState } from '@context/OrderContext';
import styled from 'styled-components';
import { useMarketPairs } from '@hooks/TracerHooks';
import { SlideSelect } from '@components/Buttons';
import { Option } from '@components/Buttons/SlideSelect/Options';
import { Button, Logo, BasicInputContainer, Input } from '@components/General';
import Tooltip from 'antd/lib/tooltip';
import { markets, collaterals } from '../Menus';
import { defaults } from '@libs/Tracer';

const SLabel = styled.h3`
    display: flex;
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: var(--color-primary);
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

export const MaxButton: any = styled(Button)`
    width: 60px;
    padding: 0;
    height: 30px;
    display: flex;
    > span {
        margin: auto;
    }
`;

const Balance = styled.p`
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: var(--color-primary);
    text-transform: capitalize;
    margin: 0 10px auto 10px;
`;

const SDropdown = styled(Dropdown)`
    border: 1px solid var(--color-primary);
    border-radius: 20px;
    min-height: 30px;
    max-height: 50px;
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
    font-size: var(--font-size-small);
`;

const RightContainer = styled.div`
    white-space: nowrap;
    display: flex;
    margin-top: 10px;
`;

interface WSProps {
    orderDispatch: React.Dispatch<OrderAction> | undefined;
    wallet: number; // id of selected wallet
    className?: string;
}

const SSlideSelect = styled(SlideSelect)`
    font-size: var(--font-size-small);
    letter-spacing: -0.32px;
    color: #ffffff;
    width: 200px;
    height: 30px;
`;

const walletTip = (
    <p>
        <strong>Wallet</strong> This trade will use funds from your connected
        Web3 wallet.
    </p>
);

const marginTip = (
    <p>
        <strong>Margin</strong> This trade will use funds from your margin
        account. To deposit funds to your margin account, switch to Advanced
        Trading.
    </p>
);

const Lock: React.FC<{
    isAmountToPay: boolean;
    lockAmountToPay: boolean;
}> = ({ isAmountToPay, lockAmountToPay }) => {
    // removed the onClick unlock functions for now
    const lock_ = (
        <LockOutlined className="mx-2" color="var(--color-primary)" />
    );
    const unlock_ = (
        <UnlockOutlined className="mx-2" color="var(--color-primary)" />
    );
    if (isAmountToPay) {
        // ie lock for margin input / amount to pay
        if (lockAmountToPay) {
            return lock_;
        } else {
            return unlock_;
        }
    } else {
        // this is just opposite logic
        if (!lockAmountToPay) {
            return lock_;
        } else {
            return unlock_;
        }
    }
};

const WalletSelect: React.FC<WSProps> = styled(
    ({ className, orderDispatch, wallet }: WSProps) => {
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
    },
)`
    display: flex;
    > p {
        color: var(--color-primary);
        margin: auto 5px;
    }
`;

const BasicInterface1: React.FC = styled(({ className }) => {
    const { selectedTracer } = useContext(TracerContext);
    const { order, orderDispatch } = useContext(OrderContext);
    const { amountToPay, market, collateral, exposure } = order as OrderState;
    const marketPairs = useMarketPairs();
    const balances = selectedTracer?.getBalance() ?? defaults.balances;
    const balance =
        order?.wallet === 0
            ? balances?.tokenBalance?.toNumber()
            : balances?.quote?.toNumber();

    //get market address -> using tracer factory helper function
    //pass in address and initialise Tracer -> get all open orders of the address
    return (
        <div className={className} id="basiceInterface1">
            {/* AMOUNT TO PAY */}
            <SSection>
                <div className="flex">
                    <SLabel>
                        <span>Amount to pay</span>
                        <Lock
                            isAmountToPay={true}
                            lockAmountToPay={order?.lockAmountToPay ?? true}
                        />
                    </SLabel>
                    <WalletSelect
                        orderDispatch={orderDispatch}
                        wallet={order?.wallet ?? 0}
                    />
                </div>
                <BasicInputContainer>
                    <Input
                        id="amountToPay"
                        type="number"
                        placeholder="0.0"
                        autoComplete="off"
                        min="0"
                        onChange={(e) => {
                            e.preventDefault();
                            if (orderDispatch) {
                                orderDispatch({
                                    type: 'setLock',
                                    value: false,
                                });
                                orderDispatch({
                                    type: 'setAmountToPay',
                                    value: parseFloat(e.target.value) ?? 0,
                                });
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                        value={amountToPay > 0 ? amountToPay : ''}
                    />
                    <RightContainer>
                        <Balance>Balance: {balance ?? '-'}</Balance>
                        <MaxButton
                            className="mr-2"
                            onClick={(e: any) => {
                                e.preventDefault();
                                if (orderDispatch) {
                                    orderDispatch({
                                        type: 'setLock',
                                        value: false,
                                    });
                                    orderDispatch({
                                        type: 'setAmountToPay',
                                        value: balance ?? 0,
                                    });
                                } else {
                                    console.error('Order dispatch not set');
                                }
                            }}
                        >
                            Max
                        </MaxButton>
                        <SDropdown
                            className="pr-4"
                            overlay={markets(
                                orderDispatch,
                                marketPairs[collateral] ?? [],
                            )}
                            trigger={['click']}
                        >
                            <DropDownContent>
                                <Logo ticker="ETH" clear={true} />
                                <DropDownText>{market}</DropDownText>
                                <SDownCaret />
                            </DropDownContent>
                        </SDropdown>
                    </RightContainer>
                </BasicInputContainer>
            </SSection>

            {/** AMOUNT TO BUY */}
            <SSection>
                <div className="flex">
                    <SLabel>
                        <span>Amount to buy</span>
                        <Lock
                            isAmountToPay={false}
                            lockAmountToPay={order?.lockAmountToPay ?? false}
                        />
                    </SLabel>
                    <MaxButton
                        onClick={(e: any) => {
                            e.preventDefault();
                            if (orderDispatch) {
                                orderDispatch({
                                    type: 'setAmountToPay',
                                    value: (order?.price ?? 0) * (balance ?? 0),
                                });
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                    >
                        Max
                    </MaxButton>
                </div>
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
                                if (order?.lockAmountToPay) {
                                    orderDispatch({
                                        type: 'setExposure',
                                        value: parseFloat(e.target.value),
                                    });
                                }
                            } else {
                                console.error('Order dispatch not set');
                            }
                        }}
                        value={!Number.isNaN(exposure) ? exposure : ''}
                    />

                    <RightContainer>
                        <SDropdown
                            overlay={collaterals(
                                orderDispatch,
                                Object.keys(marketPairs),
                            )}
                            trigger={['click']}
                        >
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
    margin: 1rem 0;
`;

export default BasicInterface1;
