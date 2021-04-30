import React, { useState } from 'react';
import SlideSelect from '.';
import { Option, MatchingEngine } from './Options';

const SlideSelectTemplate = (props) => {
    const [selected, setSelected] = useState(0);
    return <SlideSelect onClick={(index, _e) => setSelected(index)} value={selected} {...props}></SlideSelect>;
};

export const Default = SlideSelectTemplate.bind({});
Default.args = {
    children: [<Option>Option 1</Option>, <Option>Option 2</Option>],
};

export const MoreOptions = SlideSelectTemplate.bind({});
MoreOptions.args = {
    children: [
        <Option>Option 1</Option>,
        <Option>Option 2</Option>,
        <Option>Option 3</Option>,
        <Option>Option 4</Option>,
    ],
};

export const MatchingEngineSelect = SlideSelectTemplate.bind({});
MatchingEngineSelect.args = {
    children: [
        <MatchingEngine title="AMM" subTitle="On-chain" />,
        <MatchingEngine title="ORDER BOOK" subTitle="Off-chain" />,
    ],
    cClasses: 'flex m-auto text-xs border-2 border-gray-100 rounded-full ',
    bClasses: 'flex w-1/2 rounded-full cursor-pointer justify-center ',
};

export const PositionSelect = SlideSelectTemplate.bind({});
PositionSelect.args = {
    children: [<Option>BUY/LONG</Option>, <Option>SELL/SHORT</Option>],
    sClasses: 'border-b-4 border-green-200 text-green-200 font-bold shadow-lg shadow-gray-100 ',
    uClasses: 'border-b-4 border-gray-100 text-gray-100 ',
    cClasses: 'flex w-3/4 m-auto ',
    bClasses: 'flex w-1/2 cursor-pointer justify-center ',
};

export default {
    title: '/Buttons/SlideSelect',
    component: SlideSelect,
    argTypes: {
        cClasses: {
            description: 'Classname of parent wrapper component',
            table: {
                type: {
                    summary: 'Defaults to',
                    detail: 'flex w-3/4 m-auto border-2 border-gray-100 rounded-full ',
                },
            },
            control: 'text',
        },
        bClasses: {
            description: 'Classname of children wrapper component.',
            table: {
                type: {
                    summary: 'Defaults to',
                    detail: 'flex w-1/2 h-12 cursor-pointer rounded-full transition duration-500 ',
                },
            },
            control: 'text',
        },
        sClasses: {
            description:
                'Classname of the currently selected item. Selection criteria is based on value and the index of the child component.',
            table: {
                type: {
                    summary: 'Defaults to',
                    detail: 'border-2 border-blue-100 text-blue-100 bg-blue-300 shadow-lg shadow-gray-100 ',
                },
            },
            control: 'text',
        },
        uClasses: {
            description: 'Classname of all unselected items.',
            table: {
                type: {
                    summary: 'Defaults to',
                    detail: 'border-gray-100 text-gray-100 ',
                },
            },
            control: 'text',
        },
    },
};
