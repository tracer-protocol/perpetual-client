import PoolBar from '.';

const poolBarMock = {
    market: 'ETH/USD',
    liquidity: 1000,
    target: 2000,
    userBalance: 10,
    rewards: 0,
};

const PoolBarTemplate = (props) => <PoolBar {...props} />;

export const PoolBarStory = PoolBarTemplate.bind({});
PoolBarStory.args = {
    ...poolBarMock,
};

export default {
    title: '/Insurance/PoolBar',
    component: PoolBar,
    argTypes: {
        market: {
            description: 'Ticker for the relative tracer market',
            table: {
                type: {
                    summary: 'Requires',
                    detail: 'base/quote',
                },
            },
            control: 'text',
        },
        liquidity: {
            description: 'Liquidity of insurance pool ie how much has been deposited into pool',
            control: 'number',
        },
        target: {
            description: 'Target liquidity amount',
            control: 'number',
        },
        userBalance: {
            description: 'How much the user has deposited into the insurance pool',
            control: 'number',
        },
        rewards: {
            description: 'Total amount of rewards paid out to the contributors of the insurance pool',
            control: 'number',
        },
    },
};
