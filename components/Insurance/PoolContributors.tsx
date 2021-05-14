import React, { useState } from 'react';
import Table, { TableRow } from '@components/Tables';
import { SubNavBar } from '@components/Nav';
import { InsuranceButtons } from '@components/Buttons/InsuranceButtons';
import { Holding } from '@components/types';
import LightWeightChart from '@components/Charts/LightWeightChart';

const parseInsuranceData = (holdings: Holding[], liquidity: number) => {
    return !holdings
        ? []
        : holdings.map((holder) => {
              return [
                  holder.trader.id,
                  new Date(holder.timestamp * 1000).toLocaleDateString('en-US'),
                  holder.amount,
                  0,
                  `${(holder.amount / liquidity) * 100}%`,
              ];
          });
};

type PCProps = {
    holdings: Holding[];
    liquidity: number;
};

const PoolContributors: React.FC<PCProps> = ({ holdings, liquidity }: PCProps) => {
    const headings = ['Contributor', 'Date', 'Deposited', 'Net Rewards', 'Pool Share'];
    const [tab, setTab] = useState(0);
    const holders = parseInsuranceData(holdings, liquidity);

    const tabs = ['Contributors', 'About', 'Chart'];

    const renderContent = () => {
        switch (tab) {
            case 0:
                return (
                    <Table headings={headings}>
                        {holders.map((holder: (string | number)[], index: number) => {
                            return (
                                <TableRow
                                    key={`row-${index}`}
                                    onClick={() => null}
                                    rowSelected={false}
                                    rowData={holder as string[]}
                                />
                            );
                        })}
                    </Table>
                );
            case 2:
                return <LightWeightChart />;
            default:
                return <></>;
        }
    };
    return (
        <div className="flex flex-col h-full">
            <SubNavBar tabs={tabs} setTab={setTab} selected={tab} background="white" />
            <div className="h-full mt-3">{renderContent()}</div>
            <div className="flex mt-auto">
                <div className="text-gray-200 w-1/2 p-5">
                    *The insurance pools protect borrowers from the risk of uncovered loan defaults. They do not cover
                    from code bugs or other associated risks. Read more about this in
                    <span>
                        <a href="https://google.com" className="underline">
                            Tracer{"'"}s docs
                        </a>
                    </span>
                </div>
                <div className="ml-auto p-5 sm:w-full xl:w-1/2 flex">
                    <InsuranceButtons />
                </div>
            </div>
        </div>
    );
};

export default PoolContributors;
