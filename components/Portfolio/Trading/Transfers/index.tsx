import React from 'react';
import { toApproxCurrency } from '@libs/utils';
import { Table, TableHeading, TableRow, TableCell, TableBody, TableHeader } from '@components/General/Table';
import { SecondaryCell } from '@components/Portfolio';
import { DateAndTime } from '@components/General';
import { useAllMarginTransactions } from '@libs/Graph/hooks/Account';
import { useWeb3 } from '@context/Web3Context/Web3Context';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import styled from 'styled-components';

const Transfers: React.FC = () => {
    const { account, config } = useWeb3();
    const { marginTransactions } = useAllMarginTransactions(account ?? '');

    const headings = ['Date', 'Type', 'Amount / Currency', 'Transaction Details'];

    const TableHeadEndTheme = {
        minWidth: '700px',
        borderBottom: '1px solid var(--color-accent)',
    };

    return (
        <Table>
            <TableHeader>
                <tr>
                    {headings.map((heading, i) =>
                        i === 3 ? (
                            <TableHeading theme={TableHeadEndTheme} key={i}>
                                {heading}
                            </TableHeading>
                        ) : (
                            <TableHeading key={i}>{heading}</TableHeading>
                        ),
                    )}
                </tr>
            </TableHeader>
            <TableBody>
                {marginTransactions.map((transaction, i) => (
                    <TableRow key={`transaction-row-${i}`}>
                        <TableCell>
                            <DateAndTime timestamp={parseInt(transaction.timestamp)} />
                        </TableCell>
                        <TableCell>{transaction.transactionType}</TableCell>
                        <TableCell>
                            {toApproxCurrency(new BigNumber(Web3.utils.fromWei(transaction.amount)))}
                            <SecondaryCell>{transaction.tracer.marketId.split('/')[1]}</SecondaryCell>
                        </TableCell>
                        <TableCell>
                            <EtherscanLink
                                href={`${config?.previewUrl}/tx/${transaction.id}`}
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                {transaction.id.slice(0, 10)}...{transaction.id.slice(-10)}
                            </EtherscanLink>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default Transfers;

const EtherscanLink = styled.a`
    &:hover {
        text-decoration: underline;
    }
`;
