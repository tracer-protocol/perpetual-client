import SmallInput from '.';
import { useState } from 'react';

const buttonMock = {
    unit: '',
    title: '',
};

const Story = (props) => {
    const [amount, setAmount] = useState(0);
    return <SmallInput {...props} amount={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />;
};

export const Default = Story.bind({});
Default.args = {
    ...buttonMock,
};

export const WithUnit = Story.bind({});
WithUnit.args = {
    ...buttonMock,
    unit: 'TEST',
};

export const WithTitle = Story.bind({});
WithTitle.args = {
    ...buttonMock,
    title: 'Title',
};

export default {
    title: '/Input/SmallInput',
    component: SmallInput,
    argTypes: {
        unit: { control: 'text' },
        title: { control: 'text' },
    },
};
