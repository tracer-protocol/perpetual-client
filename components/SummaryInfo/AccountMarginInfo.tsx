import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import { Section } from './';

interface IProps {
    marginRatio: number;
    balance: any;
}

export const AccountMarginInfo: React.FC<IProps> = ({ marginRatio, balance }: IProps) => {
    if (!balance) {
        return <div>Loading</div>;
    } else {
        return (
            <div className="px-5 border-t-2 border-gray-100">
                <Section label={'Tracer Margin'} fontSize={'text-lg'}>
                    {toApproxCurrency(balance.margin)}
                </Section>
                <Section label={'Deposited'} fontSize={'text-lg'}>
                    {toApproxCurrency(balance.deposited)}
                </Section>
                <Section label={'Borrowed'} fontSize={'text-lg'}>
                    {toApproxCurrency(balance.totalLeveragedValue)}
                </Section>
                <Section label={'Margin Ratio'} fontSize={'text-lg'}>
                    {marginRatio?.toLocaleString()}%
                </Section>
            </div>
        );
    }
};
