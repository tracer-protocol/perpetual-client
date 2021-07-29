import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  	html {
        --color-background: #000240;
        --color-background-secondary: #00125D;
        --color-text: #fff;
        --color-primary: #3da8f5;
        --color-secondary: #005ea4;
        --color-accent: #002886;

        --font-size-ultra-small: 11px;
        --status-lightblue: #3da8f5;
        --status-yellow: #F4AB57;
        --status-orange: #F15025;
        --status-white: #fff;

        --table-darkborder: #00156C;
        --table-semidarkborder: #000240;
        --table-lightborder: #002886;
        
        --font-size-extra-small: 12px;
        --font-size-small: 16px;
        --font-size-small-heading: 16px;
        --font-size-medium: 18px;
        --font-size-large: 20px;
        --font-size-xlarge: 36px;

        --letter-spacing-small: -0.32px;
        --letter-spacing-extra-small: -0.4px;

        --height-extra-small-container: 40px;
        --height-small-container: 60px;

        --height-medium-button: 32px;
        --height-small-button: 28px;
        --height-extra-small-button: 22px;

        @media (max-width: 1600px) { 
            --font-size-extra-small: 12px;
            --font-size-small: 13px;
            --font-size-medium: 16px;
            --font-size-large: 18px;
            --font-size-xlarge: 40px;
            --height-small-container: 44px;
        }
      
        background-color: var(--color-background);
        color: var(--color-text);
  	}

    .tracer-loading {
        font-size: 32px;
        color: var(--color-secondary);
    }


	/* ANTD overrides */
	.ant-tooltip-inner {
		background: var(--color-accent);
		color: var(--color-text);
	}
	.ant-tooltip-inner strong {
		color: var(--color-primary);
	}
    .ant-tooltip-inner a {
        text-decoration: underline;
      
        &:hover {
            color: var(--color-primary);
        }
    }
	.ant-tooltip-arrow-content {
		background-color: var(--color-accent);
	}
    
    .ant-dropdown-menu {
        top: -4px;
        padding: 0;
    }

    /** GLOBAL TABLE STYLES */
    .bid, .green {
        color: #05CB3A;
    }

    .ask, .red {
        color: #F15025;
    }

    /* Scroll bar stuff */
    ::-webkit-scrollbar {
        width: 7px;
        height: 7px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: transparent;
    }

    /* Corner piece */
    ::-webkit-scrollbar-corner {
        display: none;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: var(--color-primary);
        cursor: pointer;
        border-radius: 10px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: var(--color-accent);
    }

    /* Space the buttons and titles on Portfolio pages on opposite ends to each other */
    .justify-content-between {
        width: 100%;
        justify-content: space-between;
    }

    .bn-onboard-custom.bn-onboard-modal { 
        z-index: 99;
    }

    // React toast notifications
    .react-toast-notifications__container {
        top: 65px !important;
        z-index: 100001 !important;
        width: 400px !important;
    }
    
    // Override Reactour styles
    .helper {
        width: 390px;
        max-width: 390px !important;
        top: 50px;
        background-color: var(--color-accent) !important;
        color: white !important;
        padding: 0px !important;
        overflow: hidden;
        transition: all 0.5s ease !important;
    }
    .reactour__close,
    .helper [data-tour-elem="left-arrow"],
    .helper [data-tour-elem="right-arrow"] {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 56px;
        height: 28px;
        border: 1px solid var(--color-primary) !important;
        border-radius: 50px;
        background-image: url('/img/general/close.svg') !important;
        background-position: center center !important;
        background-size: 17px 17px !important;
        background-repeat: no-repeat !important;
        transition: background-color 0.5s ease;
        backface-visibility: hidden;
    }

    .reactour__close {
        top: 16px !important;
        right: 16px !important;
        width: 56px !important;
        height: 28px !important;
    }

    .reactour__close svg,
    .helper [data-tour-elem="left-arrow"] svg,
    .helper [data-tour-elem="right-arrow"] svg {
        display: none;
    }

    .reactour__close:hover {
        background-color: var(--color-primary) !important;
        background-image: url('/img/general/close-white.svg') !important;
    }
    
    // Change the background overlay colour 
    // to semi transparent dark blue
    #___reactour > div:first-of-type svg rect {
        fill: var(--color-background);
        opacity: 0.87;
    }

    // Helper arrows 
    .helper [data-tour-elem="left-arrow"],
    .helper [data-tour-elem="right-arrow"] {
        position: absolute;
        width: 65px;
        height: 32px;
        flex: 0 0 65px;
        background-size: 17px 15px;
    }

    // Left arrow
    .helper [data-tour-elem="left-arrow"] {
        left: 16px;
        background-image: url('/img/reactour/arrow-left.svg') !important;
        background-position: 20px 50% !important;
    }
    .helper [data-tour-elem="left-arrow"]:hover {
        background-color: var(--color-primary) !important;
        background-image: url('/img/reactour/arrow-left-white.svg') !important;
    }

    // Right arrow
    .helper [data-tour-elem="right-arrow"] {
        right: 16px;
        background-image: url('/img/reactour/arrow-right.svg') !important;
        background-position: 60% 50% !important;
    }
    .helper [data-tour-elem="right-arrow"]:hover {
        background-color: var(--color-primary) !important;
        background-image: url('/img/reactour/arrow-right-white.svg') !important;
    }

    // Controls
    .helper [data-tour-elem="controls"] {
        margin-bottom: 16px;
        margin-top: 0;
        height: 32px;
    }

    .helper [data-tour-elem="dot"] {
        width: 14px;
        height: 14px;
        transform: unset;
        background: var(--color-background-secondary) !important;
        border: unset;
    }

    // Active dot
    .helper button.reactour__dot--is-active {
        background: var(--color-primary) !important; 
    }
`;
