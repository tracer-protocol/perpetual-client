import React from 'react';
import styled from 'styled-components';
import Timer from '@components/Timer';
import Icon from './Icon';
// @ts-ignore
import TracerLoading from 'public/img/toast/tracer-loading.gif';
// @ts-ignore
import TickApproved from 'public/img/toast/tick-approved.gif';
// @ts-ignore
import Error from 'public/img/toast/error.gif';
// @ts-ignore
import Warning from 'public/img/toast/warning.gif';
// @ts-ignore
import Cancel from 'public/img/toast/cancel.gif';
// @ts-ignore
import Tick from 'public/img/toast/tick.gif';

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
    }
> = {
    success: {
        icon: <Icon image={Tick} />,
    },
    error: {
        icon: <Icon image={Error} />,
    },
    warning: {
        icon: <Icon image={Warning} />,
    },
    info: {
        icon: <Icon image={TracerLoading} />,
    },
    loading: {
        icon: <Icon image={TracerLoading} />,
    },
};

const IconWrap = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    min-width: 120px;
    height: auto;
    font-size: var(--font-size-medium);
    line-height: 20px;
    border-right: 1px solid var(--color-accent);
    background: #000240;
`;
const Close = styled.div`
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 28px;
    border: 1px solid var(--color-primary);
    border-radius: 50px;
    background-image: url('/img/general/close.svg');
    background-position: center center;
    background-size: 17px 17px;
    background-repeat: no-repeat;
    transition: background-color 0.5s ease, opacity 0.5s ease;
    backface-visibility: hidden;
    opacity: 0;

    &:hover {
        cursor: pointer;
        background-color: var(--color-primary);
        background-image: url('/img/general/close-white.svg');
    }
`;
const Header: React.FC<{ onDismiss: (e: any) => any; title: React.ReactNode }> = ({ onDismiss, title }) => {
    return (
        <div
            style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '19px',
                letterSpacing: '-0.38px',
                width: 'calc(100% - 60px)',
                display: 'flex',
                padding: '16px 16px 0',
            }}
        >
            <span>{title}</span>
            <Close className="toast-close" onClick={onDismiss} />
        </div>
    );
};
const STimer = styled<any>(Timer)`
    #refetchLoader {
        animation: countdown-width ${(props) => props.autoDismissTimeout}s linear;
        position: absolute;
        height: 100%;
        right: 0;
        z-index: -1;
    }
`;
STimer.defaultProps = {
    autoDismissTimer: 5,
};

const Countdown: React.FC<{
    autoDismissTimeout: number;
    display: boolean;
}> = ({ autoDismissTimeout, display }) =>
    display ? <STimer autoDismissTimeout={Math.floor(autoDismissTimeout / 1000)} /> : null;

const Content = styled((props: any) => (
    <div className={`react-toast-notifications__toast__content w-full p-2 ${props.className}`} {...props}>
        {props.children}
    </div>
))`
    flex-grow: 1;
    font-size: var(--font-size-medium);
    line-height: 1.4;
    min-height: 40px;
    width: 100%;
    padding: 8px 16px 16px;
    word-break: break-word;
    color: var(--color-primary);

    strong {
        color: #fff;
    }
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

const toastWidth = 'auto';

const ContentWrapper = styled.div`
    display: inline-flex;
    flex-direction: column;
`;

const Hashie: React.FC<HProps | any> = ({
    transitionDuration,
    transitionState,
    onDismiss,
    autoDismiss,
    appearance: appearance_,
    placement,
    autoDismissTimeout,
    // isRunning,
    children,
}: HProps) => {
    const appearance = appearances[appearance_] ?? appearances['info']; //default info
    let children_ = React.Children.toArray(children);
    return (
        <ToastWrapper
            style={{
                transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
                width: toastWidth,
                cursor: 'default',
                ...hashieStates(placement)[transitionState],
            }}
            className={autoDismiss ? 'dismiss' : ''}
        >
            <IconWrap>{appearance.icon}</IconWrap>
            <ContentWrapper className="notification-content">
                {/*Necessary for ReactTour to select element*/}
                <Header onDismiss={onDismiss} title={children_[0]} />
                <Content>{children_[1]}</Content>
            </ContentWrapper>
            <Countdown display={autoDismiss} autoDismissTimeout={autoDismissTimeout} />
        </ToastWrapper>
    );
};

Hashie.defaultProps = {
    transitionDuration: 220,
    autoDismiss: false,
    appearance: 'info',
    placement: 'top-right',
    autoDismissTimeout: 5000,
};

const ToastWrapper = styled.div`
    position: relative;
    display: flex;
    background-color: #00156c;
    overflow: hidden;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.175);
    margin-bottom: 0.5rem;
    border-radius: 0.375rem;

    &:hover ${Close} {
        opacity: 1;
    }

    &.dismiss {
        picture {
            animation: fade-out 0.5s linear forwards;
            animation-delay: 4.3s;
            @keyframes fade-out {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
        }
    }
`;

export const NotificationsContainer = styled.div`
    position: absolute;
    top: 4rem;
    right: 0;
    margin: 0.25rem;
`;
export const Notification = ({ children, ...props }: any) => <Hashie {...props}>{children}</Hashie>;
