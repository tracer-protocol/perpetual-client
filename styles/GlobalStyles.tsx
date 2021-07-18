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

    /** BNC-Onboarding styles */
    .bn-onboard-modal-content {
        background: var(--color-background-secondary)!important;
        color: var(--color-text)!important;
        font-weight: lighter!important;
        width: 422px;
        padding: 1rem 0!important;
    }
    .bn-onboard-custom.bn-onboard-modal { 
        z-index: 99;
    }

    .bn-onboard-modal-terms-of-service {
        padding: 0 1rem;
    }

    /** Description Styles */
    .bn-onboard-select-description {
        padding: 0 1rem;
    }

    /** Header Styles */
    .bn-onboard-modal-content-header {
        padding: 0 1rem;
    }

    .bn-onboard-modal-content-header-icon {
        display: none!important;
    }

    .bn-onboard-modal-content-header h3 {
        color: var(--color-text)!important;
        font-weight: lighter!important;
        margin-left: 0!important;
    }

    /** Wallet Styles */
    .bn-onboard-modal-select-wallets li {
        width: 100%;
        padding: 0!important;
        height: 63px;
        .bn-onboard-selected-wallet {
            background: var(--color-background)!important;
        }
        .bn-onboard-icon-button {
            width: 100%;
            border-radius: 0;
            padding: 0 1.25em;
            height: 100%;
            margin: 0;
        }
    }
    .bn-onboard-modal-select-wallets li:hover {
        background: var(--color-accent);
    }

    /** Footer Styles */
    .bn-onboard-select-info-container {
        padding: 0 1rem;
    }
    .bn-onboard-select-wallet-definition {
        padding: 0 1rem;
    }

    /** Close Styles */
    .bn-onboard-modal-content-close {
        width: 56px;
        height: 28px!important;
        top: 1em!important;
        border: 1px solid var(--color-primary);
        border-radius: 20px!important;
        svg {
            fill: var(--color-primary)!important;
            width: 14px!important;
            height: 14px!important;
        }
    }

    /** Unsopported Network Styles */
    .bn-onboard-prepare-description {
        padding: 0 1rem;
    }

    .bn-onboard-prepare-button-right {
        margin-right: 1rem;
    }

    /** Different Wallet Connect Styles */
    .bn-onboard-modal-selected-wallet {
        padding: 0 1rem;
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
        border: 1px solid var(--color-primary);
        border-radius: 50px;
        background-image: url('/img/general/close.svg');
        background-position: center center;
        background-size: 17px 17px;
        background-repeat: no-repeat;
        transition: background-color 0.5s ease;
        backface-visibility: hidden;
    }

    .reactour__close {
        top: 16px;
        right: 16px;
        width: 56px !important;
        height: 28px !important;
    }

    .reactour__close svg,
    .helper [data-tour-elem="left-arrow"] svg,
    .helper [data-tour-elem="right-arrow"] svg {
        display: none;
    }

    .reactour__close:hover {
        background-color: var(--color-primary);
        background-image: url('/img/general/close-white.svg');
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
        background-image: url('/img/reactour/arrow-left.svg');
        background-position: 20px 50%;
    }
    .helper [data-tour-elem="left-arrow"]:hover {
        background-color: var(--color-primary);
        background-image: url('/img/reactour/arrow-left-white.svg');
    }

    // Right arrow
    .helper [data-tour-elem="right-arrow"] {
        right: 16px;
        background-image: url('/img/reactour/arrow-right.svg');
        background-position: 60% 50%;
    }
    .helper [data-tour-elem="right-arrow"]:hover {
        background-color: var(--color-primary);
        background-image: url('/img/reactour/arrow-right-white.svg');
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
        background: var(--color-background-secondary);
        border: unset;
    }

    // Active dot
    .helper button.reactour__dot--is-active {
        background: var(--color-primary); 
    }
`;
