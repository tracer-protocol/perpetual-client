import { Notification } from '.';
import { Story } from '@storybook/react';

const notificationMock = {
    children: 'Default notification',
};
const errorMock = {
    children: 'Error notification',
    appearance: 'error',
};
const loadingMock = {
    children: 'Loading notification',
    appearance: 'loading',
};
const successMock = {
    children: 'Success notification',
    appearance: 'success',
};
const warningMock = {
    children: 'Warning notification',
    appearance: 'warning',
};

const NotificationStory: Story<any> = (args: any) => <Notification {...args} />;
export const OneNotification = NotificationStory.bind({});
OneNotification.args = {
    appearance: 'success',
    children: ['Example notification, anything goes in children'],
};

const MultipleNotificationStory: Story<any> = (args) => <>{args.children}</>;

export const MultipleNotifications = MultipleNotificationStory.bind({});
MultipleNotifications.args = {
    autoDismiss: true,
    children: [
        <NotificationStory {...notificationMock} />,
        <NotificationStory {...errorMock} />,
        <NotificationStory {...successMock} />,
        <NotificationStory {...loadingMock} />,
        <NotificationStory {...warningMock} />,
    ],
};

export default {
    title: '/Notifications/Notification',
    component: Notification,
    argTypes: {
        appearance: {
            description: 'Appearance type of the notification. Defaults to info',
            table: {
                type: {
                    summary: 'Variants',
                    detail: 'info || success || warning || error || loading',
                },
            },
            control: 'text',
        },
        onDismiss: {
            description: 'Function called on click of close or when timer runs out',
        },
    },
};
