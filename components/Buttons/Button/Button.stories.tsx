import Button from './';

const buttonMock = {
    disabled: false,
};

const ButtonTemplate = (props) => <Button {...props}>{props.text}</Button>;

export const ButtonStory = ButtonTemplate.bind({});
ButtonStory.args = {
    ...buttonMock,
    text: 'Click Me',
};

export const DisabledButton = ButtonTemplate.bind({});
DisabledButton.args = {
    disabled: true,
    text: 'Try Click Me',
};

export default {
    title: '/Buttons/Button',
    component: Button,
    argTypes: {
        disabled: { control: 'boolean' },
    },
};
