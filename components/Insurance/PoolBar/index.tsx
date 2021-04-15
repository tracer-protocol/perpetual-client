import React, { useState } from 'react';
import styled from 'styled-components';
import { InsurancePoolInfo } from 'types';

type InfoType = 'USER_BALANCE' | 'POOL_BALANCE' | 'POOL_TARGET';

type PBIProps = {
    selected: InfoType;
    userBalance: number;
    liquidity: number;
    market: string;
    target: number;
};

const PoolBarInfo: React.FC<PBIProps> = ({ selected, userBalance, liquidity, market, target }: PBIProps) => {
    try {
        const currency = market.split('/')[1];
        switch (selected) {
            case 'USER_BALANCE':
                return (
                    <div>
                        <h1 className="text-2xl">
                            {userBalance.toLocaleString()} {currency}
                        </h1>
                        <div>Your Pool Balance</div>
                    </div>
                );
            case 'POOL_BALANCE':
                return (
                    <div>
                        <h1 className="text-blue-100 text-2xl">
                            {liquidity} {currency}
                        </h1>
                        <div>Current Liquidity</div>
                    </div>
                );
            case 'POOL_TARGET':
                return (
                    <div className="flex">
                        <div className="w-1/2">
                            <h1 className="text-2xl">
                                {target} {currency}
                            </h1>
                            <div>Pool Target</div>
                        </div>
                        <div className="w-1/2">
                            <h1 className="text-2xl">
                                {target - liquidity} {currency}
                            </h1>
                            <div>Required Till Target</div>
                        </div>
                    </div>
                );
            default:
                return <></>;
        }
    } catch (err) {
        return <></>;
    }
};

const borders: (target: number, userBalance: number, liquidty: number) => string = (target, userBalance, liquidity) => {
    let borders = '';
    if (!userBalance) {
        borders += 'rounded-l-lg ';
    }
    if (!target || target - liquidity < 0) {
        borders += 'rounded-r-lg';
    }
    return borders;
};

const Ticker = styled(({ className, children, onClick }) => {
    return (
        <div onClick={onClick} className={className}>
            {children}
        </div>
    );
})`
    padding: 5px;
    border: solid 2px ${(props) => props.color};
    border-radius: 5px;
    color: ${(props) => props.color};
    position: absolute;
    max-width: fit-content;
    bottom: -75%;
    white-space: nowrap;
    left: ${(props) => props.position}%;
    margin-top: 50px;
    z-index: 1;

    &:hover {
        cursor: pointer;
    }

    &:before {
        content: '';
        width: 2px;
        height: 100%;
        background: ${(props) => props.color};
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -2px;
    }
`;

type Section = {
    title: string;
    type: InfoType;
    width: number;
    colour: string;
    border?: string;
    color: string;
};
const PoolBar: React.FC<InsurancePoolInfo> = ({ userBalance, liquidity, target, market }: InsurancePoolInfo) => {
    const [info, setInfo] = useState<InfoType>('USER_BALANCE');

    const userBalanceWidth = () => {
        if (liquidity < target) {
            return userBalance / target;
        } else {
            return userBalance / liquidity; // else
        }
    };

    const poolBalanceWidth = () => {
        if (userBalance >= liquidity) {
            return 0; // 0%
        } else {
            if (liquidity > target) {
                return (liquidity - userBalance) / liquidity;
            } else {
                return (liquidity - userBalance) / target;
            }
        }
    };
    const sections: Section[] = [
        {
            title: !!userBalance ? 'My Balance' : '',
            type: 'USER_BALANCE',
            width: userBalanceWidth(),
            colour: 'green-200',
            color: '#3DAD39',
            border: userBalance >= liquidity && target <= liquidity ? 'rounded-l-lg rounded-r-lg' : 'rounded-l-lg',
        },
        {
            title: liquidity - userBalance > 0 ? 'Total Pool Balance' : '',
            type: 'POOL_BALANCE',
            width: poolBalanceWidth(),
            colour: 'blue-100',
            color: '#0000bd',
            border: borders(target, userBalance, liquidity),
        },
        {
            title: !!target && target - liquidity > 0 ? 'Required' : '',
            type: 'POOL_TARGET',
            width: !!target && target - liquidity > 0 ? (target - liquidity) / target : 0,
            colour: 'red-200',
            color: '#F57979',
            border: 'rounded-r-lg',
        },
    ];

    const barItem =
        'z-10 relative text-xs text-center text-black transform duration-100 transition cursor-pointer flex';
    const selected = 'z-20';

    return (
        <div className="h-full w-full text-center flex flex-col">
            <div className="mx-5 my-2">
                <PoolBarInfo
                    selected={info}
                    userBalance={userBalance}
                    liquidity={liquidity}
                    target={target}
                    market={market}
                />
            </div>
            <div className="w-full flex p-5 mt-auto h-24">
                <div className="w-full h-full flex relative">
                    {sections.map((section, index) => {
                        return (
                            <span
                                onClick={() => setInfo(section.type)}
                                key={`pool-${index}`}
                                className={`relative bg-${section.colour} ${section.border} ${barItem} ${
                                    info === section.type ? `${selected} shadow-${section.colour}` : ''
                                }`}
                                style={{
                                    width: `${section.width * 100}%`,
                                    minWidth: 'fit-content',
                                }}
                            >
                                {section.title ? <span className={`m-auto text-blue-200`}>{section.title}</span> : null}
                            </span>
                        );
                    })}
                    {!!target && target - liquidity < 0 ? (
                        <Ticker
                            color={'#F57979'}
                            position={(target / liquidity) * 100}
                            onClick={() => setInfo('POOL_TARGET')}
                        >
                            Target
                        </Ticker>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default PoolBar;
