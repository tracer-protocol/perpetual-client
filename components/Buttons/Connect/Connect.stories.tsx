import Connect from '.';
import { withGlobalContext } from '../../../.storybook/decorators';

const buttonMock = {
    modalTitle: 'Test Modal Title',
    modalSubTitle: 'Test Modal Subtitle',
    buttonText: 'Button Text',
    loading: false,
};

const Story = (props) => <Connect {...props} />;

export const ConnectButtonStory = Story.bind({});
ConnectButtonStory.args = {
    ...buttonMock,
};

export default {
    title: '/Buttons/Connect Button',
    component: Connect,
    argTypes: {
        loading: { control: 'boolean' },
    },
    decorators: [(Story) => withGlobalContext(Story)],
};
