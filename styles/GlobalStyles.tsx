import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  	html {
        --font-size-small: 1rem;
        --font-size-medium: 1.25rem;
        --color-background: #000240;
        --color-text: #fff;
        --color-primary: #3da8f5;
        --color-accent: #002886;

        --font-size-extra-small: 13px;
        --font-size-small: 16px;
        --font-size-medium: 20px;

        --height-small-container: 60px;
        --height-small-button: 28px;
        --height-extra-small-button: 22px;

        @media (max-width: 1535px) { 
            --font-size-extra-small: 12px;
            --font-size-small: 13px;
            --font-size-medium: 16px;
            --height-small-container: 45px;
        }

      
        background-color: var(--color-background);
        color: var(--color-text);
  	}


	/* ANTD overides */
	.ant-tooltip-inner {
		background: var(--color-accent);
		color: var(--color-text);
	}
	.ant-tooltip-inner strong {
		color: var(--color-primary);
	}
	.ant-tooltip-arrow-content {
		background-color: var(--color-accent);
	}

    /* Scroll bar stuff */
    ::-webkit-scrollbar {
        width: 5px;
        height: 8px;
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
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: var(--color-accent);
    }
`;
