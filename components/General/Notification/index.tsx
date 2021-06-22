import React from 'react';
import {
    CloseOutlined,
    InfoCircleFilled,
    WarningOutlined,
    LoadingOutlined,
    CloseCircleTwoTone,
    CheckCircleTwoTone,
} from '@ant-design/icons';
import styled from 'styled-components';
import Timer from '@components/Timer';

type PlacementType = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';
type AppearanceTypes = 'success' | 'error' | 'warning' | 'info' | 'loading';
type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

/* eslint-disable */

const getTranslate: (placement: PlacementType) => string = (placement: PlacementType) => {
    const pos: string[] = placement.split('-');
    const relevantPlacement = pos[1] === 'center' ? pos[0] : pos[1];
    const translateMap: Record<string, string> = {
        right: 'translate3d(120%, 0, 0)',
        left: 'translate3d(-120%, 0, 0)',
        bottom: 'translate3d(0, 120%, 0)',
        top: 'translate3d(0, -120%, 0)',
    };

    return translateMap[relevantPlacement];
};

const hashieStates = (placement: PlacementType) => ({
    entering: { transform: getTranslate(placement) },
    entered: { transform: 'translate3d(0, 0, 0)' },
    exiting: { transform: 'scale(0.66)', opacity: 0 },
    exited: { transform: 'scale(0.66)', opacity: 0 },
});

const appearances: Record<
    string,
    {
        icon: any;
        text: string;
        fg: string;
        bg: string;
    }
> = {
    success: {
        icon: <CheckCircleTwoTone twoToneColor={'#05CB3A'} />,
        text: '#05CB3A',
        fg: '#36B37E',
        bg: '#E3FCEF',
    },
    error: {
        icon: <CloseCircleTwoTone twoToneColor={'#F15025'} />,
        text: '#F15025',
        fg: '#FF5630',
        bg: '#FFEBE6',
    },
    warning: {
        icon: <WarningOutlined />,
        text: '#FF8B00',
        fg: '#FFAB00',
        bg: '#FFFAE6',
    },
    info: {
        icon: <InfoCircleFilled />,
        text: '#505F79',
        fg: '#2684FF',
        bg: '#00156C',
    },
    loading: {
        icon: <LoadingOutlined />,
        text: '#fff',
        fg: '#2684FF',
        bg: '#00156C',
    },
};

const IconWrap = styled.span`
    width: 30px;
    height: 30px;
    font-size: 1.25rem;
    line-height: 20px;
`;
const Header: React.FC<any> = ({ appearance: appearance_, onDismiss, title }) => {
    const appearance = appearances[appearance_] ?? appearances['info']; //default info
    return (
        <div
            style={{
                color: appearance.text,
                fontWeight: 'bold',
                fontSize: '19px',
                letterSpacing: '-0.38px',
                width: '100%',
                display: 'flex',
            }}
        >
            <IconWrap>{appearance.icon}</IconWrap>
            <span>{title}</span>
            <Close onClick={onDismiss} />
        </div>
    );
};

const STimer = styled<any>(Timer)`
    #refetchLoader {
        animation: countdown-width ${(props) => props.autoDismissTimeout}s linear;
        background: var(--color-accent);
        position: absolute;
        height: 0.25rem;
        right: 0;
    }
`;
STimer.defaultProps = {
    autoDismissTimer: 5,
};

const Countdown: React.FC<{
    autoDismissTimeout: number;
    display: boolean;
}> = ({ autoDismissTimeout, display }) =>
    display ? (
        <div className="w-full">
            <STimer autoDismissTimeout={Math.floor(autoDismissTimeout / 1000)} />
        </div>
    ) : null;

const Content = styled((props: any) => (
    <div className={`react-toast-notifications__toast__content w-full p-2 ${props.className}`} {...props}>
        {props.children}
    </div>
))`
    flex-grow: 1;
    font-size: 18px;
    line-height: 1.4;
    color: #005ea4;
    min-height: 40;
    width: 100%;
    padding: 5px;
    word-break: break-word;
`;

type HProps = {
    appearance: AppearanceTypes;
    autoDismiss: boolean; // may be inherited from ToastProvider
    autoDismissTimeout: number; // inherited from ToastProvider
    children: Node;
    isRunning: boolean;
    onDismiss: (args: any) => any; // its a func
    placement: PlacementType; // this is default but its what we want anyway
    transitionDuration: number; // inherited from ToastProvider
    transitionState: TransitionState; // inherited from ToastProvider
};

const toastWidth = 360;

const Close = styled(CloseOutlined)`
    padding: 0;
    margin-top: 0.2rem;
    margin-left: auto;
    margin-bottom: auto;
    line-height: 14px;
    color: var(--color-primary);
    transition: 0.3s;
    border: 1px solid var(--color-primary);
    padding: 2px 13px;
    border-radius: 10px;
    &: hover {
        cursor: pointer;
        opacity: 0.8;
        border: 1px solid #fff;
        color: var(--color-text);
    }
`;
const Hashie: React.FC<HProps | any> = ({
    transitionDuration,
    transitionState,
    onDismiss,
    autoDismiss,
    appearance: appearance_,
    placement,
    autoDismissTimeout,
    isRunning,
    children,
}: HProps) => {
    const appearance = appearances[appearance_] ?? appearances['info']; //default info
    let children_ = React.Children.toArray(children);
    return (
        <div
            className="rounded-md mb-2 flex flex-col p-2"
            style={{
                backgroundColor: '#00156C',
                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
                color: appearance.text,
                transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
                width: toastWidth,
                ...hashieStates(placement)[transitionState],
            }}
        >
            <Header
                appearance={appearance_}
                autoDismiss={autoDismiss}
                autoDismissTimeout={autoDismissTimeout}
                isRunning={isRunning}
                onDismiss={onDismiss}
                title={children_[0]}
            />
            <Content>{children_[1]}</Content>
            <Countdown display={autoDismiss} autoDismissTimeout={autoDismissTimeout} />
        </div>
    );
};

Hashie.defaultProps = {
    transitionDuration: 220,
    autoDismiss: false,
    appearance: 'info',
    placement: 'top-right',
    autoDismissTimeout: 5000,
};

export const NotificationsContainer = styled.div`
    position: absolute;
    top: 4rem;
    right: 0;
    margin: 0.25rem;
`;
export const Notification = ({ children, ...props }: any) => <Hashie {...props}>{children}</Hashie>;
