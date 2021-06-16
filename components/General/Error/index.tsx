import { InfoCircleOutlined } from '@ant-design/icons';
import { ReactTooltipStyled } from '@components/Tooltips';
import React from 'react';
import styled from 'styled-components';

type ErrorBox = {
    name: string;
    message: string;
    moreInfo?: string;
    severity?: 'warning';
};

export const OrderErrors: Record<string, ErrorBox> = {
    NO_POSITION: {
        name: 'User has position',
        message: 'You have an open trade. Switch to',
    },
    NO_WALLET_BALANCE: {
        name: 'No Wallet Balance',
        message: 'No balance found in web3 wallet',
    },
    NO_MARGIN_BALANCE: {
        name: 'No Margin Balance',
        message: 'Please deposit into your margin account',
    },
    NO_ORDERS: {
        name: 'No Orders',
        message: 'No open orders for this market',
    },
    ACCOUNT_DISCONNECTED: {
        name: 'Account Disconnected',
        message: 'Please connect your wallet',
    },
    INVALID_FUNDS: {
        name: 'Invalid Funds',
        message: 'You do not have enough funds in your wallet',
    },
    INVALID_MIN_MARGIN: {
        name: 'Invalid Minimum Margin',
        message:
            'Our liquidators are required to pay 6 times the liquidation gas costs to liquidate your account. As a result we encourage you to deposit atleast $160 as this will ensure you will be able to place a trade without instantly being liquidated',
    },
    INVALID_ORDER: {
        name: 'Invalid Order',
        message: 'Order will put you into a liquidateable state',
    },
};

export const MarginErrors: Record<string, ErrorBox> = {
    INSUFFICIENT_FUNDS: {
        name: 'Insufficient Funds',
        message: 'Insufficient funds in connected wallet',
    },
    WITHDRAW_INVALID: {
        name: 'Withdraw Invalid',
        message: 'Position will be liquidated',
        moreInfo:
            'You are attempting to withdraw funds that will cause your position to be liquidated. Decrease the amount you are trying to withdraw or close your position and then withdraw funds.',
    },
    DEPOSIT_MORE: {
        name: 'Deposit Less than 150',
        message: 'You must deposit a minimum of $150 USD',
        moreInfo:
            'The liquidation mechanism requires you to deposit a minimum of $150 USDC to ensure that you will be able to open a position without instantly being liquidated.',
    },
};

export type ErrorKey = 'NO_ERROR' | keyof typeof MarginErrors | keyof typeof OrderErrors;
const Errors: {
    orders: Record<string, ErrorBox>;
    margin: Record<string, ErrorBox>;
} = {
    orders: OrderErrors,
    margin: MarginErrors,
};

const SInfoCircleOutlined = styled(InfoCircleOutlined)`
    vertical-align: 0.125rem;
    margin-left: 0.25rem;
`;

type EProps = {
    className?: string;
    error: ErrorKey;
    context?: 'orders' | 'margin';
    message?: string; // this will override the rror message
};

const Error: React.FC<EProps> = styled(({ className, error, message, context }: EProps) => {
    const error_ =
        error !== 'NO_ERROR'
            ? Errors[context ?? 'orders'][error]
            : {
                  message: '',
                  moreInfo: '',
              };
    return (
        <div className={`${className} ${error !== 'NO_ERROR' || !!message ? 'show' : ''}`}>
            <div className="message">
                {error_?.message ?? message ?? ''}
                {error_?.moreInfo ? (
                    <>
                        <ReactTooltipStyled id="error-info-tooltip" effect="solid">
                            {error_?.moreInfo}
                        </ReactTooltipStyled>
                        <SInfoCircleOutlined data-tip="" data-for="error-info-tooltip" />
                    </>
                ) : null}
            </div>
        </div>
    );
})`
    background: #f15025;
    border-radius: 0px 0px 5px 5px;
    font-size: 16px;
    letter-spacing: -0.32px;
    color: #ffffff;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translateY(0);
    transition: all 0.4s;
    opacity: 0;
    z-index: -1;
    &.show {
        opacity: 1;
        z-index: 1;
        transform: translateY(100%);
    }

    .message {
        transition: all 0.4s;
        margin: 0px;
    }
    &.show .message {
        margin: 10px;
    }
`;

Error.defaultProps = {
    context: 'orders',
};

export default Error;
