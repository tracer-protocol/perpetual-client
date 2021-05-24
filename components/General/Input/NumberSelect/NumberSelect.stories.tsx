import { useState } from 'react';
import NumberSelect from './';

const buttonMock = {
    unit: 'TEST',
    balance: 0,
};

const Story = (props) => {
    const [amount, setAmount] = useState(0);
    return <NumberSelect {...props} amount={amount} setAmount={setAmount} />;
};

export const Default = Story.bind({});
Default.args = {
    ...buttonMock,
};

export const WithBalance = Story.bind({});
WithBalance.args = {
    ...buttonMock,
    balance: 100,
};

export const WithTitle = Story.bind({});
WithTitle.args = {
    ...buttonMock,
    title: 'Example Title',
};

export default {
    title: '/Input/NumberSelect',
    component: NumberSelect,
};
