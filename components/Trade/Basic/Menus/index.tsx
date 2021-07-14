import React from 'react';
import Menu from 'antd/lib/menu';
import { OrderAction } from '@context/OrderContext';

/** TODO these could be merged into 1 component this is hacky sorry */

export const markets: any = (orderDispatch: React.Dispatch<OrderAction> | undefined, options: string[]) => (
    <Menu
        onClick={({ key }) =>
            orderDispatch
                ? orderDispatch({ type: 'setMarket', value: key.toString() })
                : console.error('Order dispatch not set')
        }
    >
        {options.map((option: string) => {
            return <Menu.Item key={option}>{option}</Menu.Item>;
        })}
    </Menu>
);

export const collaterals: any = (orderDispatch: React.Dispatch<OrderAction> | undefined, options: string[]) => (
    <Menu
        onClick={({ key }) =>
            orderDispatch
                ? orderDispatch({ type: 'setCollateral', value: key.toString() })
                : console.error('Order dispatch not set')
        }
    >
        {options?.map((option) => {
            return <Menu.Item key={option}>{option}</Menu.Item>;
        })}
    </Menu>
);

export const walletMenu: any = (orderDispatch: React.Dispatch<OrderAction> | undefined, options: string[]) => (
    <Menu
        onClick={({ key }) =>
            orderDispatch
                ? orderDispatch({ type: 'setWallet', value: parseInt(key) })
                : console.error('Order dispatch function not set')
        }
    >
        {options?.map((option, index) => {
            return <Menu.Item key={index}>{option}</Menu.Item>;
        })}
    </Menu>
);
