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
        --font-size-medium: 20px;
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

    /** Legal modal*/
    #legal-modal {
        max-width: 420px;
    }
    #legal-modal #checkbox-container {
        display: flex;
        margin-top: 16px;
    }

    #legal-modal span,
    #legal-modal input {
        color: #fff;
    }
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

    // React toast notifications
    .react-toast-notifications__container {
        top: 65px !important;
        z-index: 100001 !important;
        max-width: 400px !important;
    }
`;
