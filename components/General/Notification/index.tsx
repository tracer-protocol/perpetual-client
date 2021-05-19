import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faTimes,
    faCircleNotch,
    faExclamationCircle,
    faInfo,
    faFire,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

type PlacementType = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';
type AppearanceTypes = 'success' | 'error' | 'warning' | 'info' | 'loading';
type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

/* eslint-disable */

const getTranslate: (placement: PlacementType) => string = (placement: PlacementType) => {
    const pos:string[] = placement.split('-');
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

// TODO load these colours in tailwind config
const appearances: Record<string, {
    icon: any,
    text: string,
    fg: string, 
    bg: string
}>= {
    success: {
        icon: faCheckCircle,
        text: '#006644',
        fg: '#36B37E',
        bg: '#E3FCEF',
    },
    error: {
        icon: faFire,
        text: '#BF2600',
        fg: '#FF5630',
        bg: '#FFEBE6',
    },
    warning: {
        icon: faExclamationCircle,
        text: '#FF8B00',
        fg: '#FFAB00',
        bg: '#FFFAE6',
    },
    info: {
        icon: faInfo,
        text: '#505F79',
        fg: '#2684FF',
        bg: 'white',
    },
    loading: {
        icon: faCircleNotch,
        text: '#505F79',
        fg: '#2684FF',
        bg: 'white',
    },
};

const Icon: React.FC<any> = ({ appearance: appearance_, autoDismiss, autoDismissTimeout, isRunning }) => {
    const appearance = appearances[appearance_] ?? appearances['info'] //default info
    return (
        <div
            className="
                react-toast-notifications__toast__icon-wrapper
                relative flex-shrink-0 overflow-hidden text-center
                rounded-tl-md rounded-bl-md
                py-2 
            "
            style={{
                backgroundColor: appearance.fg,
                color: appearance.bg,
                width: 30,

            }}
        >
            <Countdown opacity={autoDismiss ? 1 : 0} autoDismissTimeout={autoDismissTimeout} isRunning={isRunning} />
            <div className={`${appearance_ === 'loading' ? 'animate-spin' : ''}`}>
                <FontAwesomeIcon color="#fff" icon={appearance.icon} style={{ width: '30px' }} />
            </div>
        </div>
    );
};

const Countdown: React.FC<any> = ({ autoDismissTimeout, opacity, isRunning, ...props }) => (
    <div
        className="
        react-toast-notifications__toast__countdown
        bottom-0 height-0 left-0 absolute w-full
    "
        style={{
            animation: `countdown ${autoDismissTimeout}ms linear`,
            animationPlayState: isRunning ? 'running' : 'paused',
            backgroundColor: 'rgba(0,0,0,0.1)',
            opacity,
        }}
        {...props}
    />
);

const Content = styled((props: any) =>
    <div
        className={`react-toast-notifications__toast__content w-full p-2 ${props.className}`}
        {...props} 
    >
        {props.children}
    </div>
)`
    flex-grow: 1;
    font-size: 14;
    line-height: 1.4;
    min-height: 40;
    width: 100%;
    padding: 5px;
    word-break: break-word;
`

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
    const appearance = appearances[appearance_] ?? appearances['info'] //default info
    return (
        <div
            className="rounded-md mb-2 flex"
            style={{
                backgroundColor: appearance.bg,
                boxShadow: '0 3px 8px rgba(0, 0, 0, 0.175)',
                color: appearance.text,
                transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
                width: toastWidth,
                ...hashieStates(placement)[transitionState],
            }}
        >
            <Icon
                appearance={appearance_}
                autoDismiss={autoDismiss}
                autoDismissTimeout={autoDismissTimeout}
                isRunning={isRunning}
            />
            <Content>{children}</Content>
            <div className="p-0 mr-2 mt-1 mb-auto cursor-pointer" onClick={onDismiss}>
                <FontAwesomeIcon color={appearance.fg} icon={faTimes} />
            </div>
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

export const NotificationsContainer = styled.div
`
    position: absolute;
    top: 4rem;
    right: 0;
    margin: 0.25rem;
`
export const Notification = ({ children, ...props }: any ) => <Hashie {...props}>{children}</Hashie>;
