import React, { useState } from 'react';
import NavBar from '@components/Nav/Navbar';
import styled from 'styled-components';
import SideNav from '@components/Nav/SideNav';
import TradingPortfolio from '@components/Portfolio/Trading';
import InsurancePortfolio from '@components/Portfolio/Insurance';

const LeftPanel = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
    border-left: 1px solid #0c3586;
`;

const RightPanel = styled.div`
    width: 75%;
    display: flex;
    flex-direction: column;
    min-height: 90vh;
    border-top: 1px solid #0c3586;
    border-right: 1px solid #0c3586;
`;

const Button = styled.div`
    transition: 0.5s;
    color: #3da8f5;
    font-size: 1rem;
    line-height: 1rem;
    letter-spacing: -0.32px;
    border: 1px solid #3da8f5;
    border-radius: 20px;
    text-align: center;
    padding: 10px 0;
    width: ${(props: any) => props.theme.width as string};

    &:hover {
        color: ${(props: any) => props.theme.hoverFG as string};
        background: ${(props: any) => props.theme.hoverBG as string};
        cursor: ${(props: any) => props.theme.hoverCursor as string};
    }

    &.primary {
        background: #3da8f5;
        color: #fff;
    }

    &.primary:hover {
        background: #03065e;
        color: #3da8f5;
    }

    &.disabled {
        opacity: 0.8;
    }

    &.disabled:hover {
        cursor: not-allowed;
    }
`;

Button.defaultProps = {
    theme: {
        width: '100px',
        hoverFG: '#fff',
        hoverBG: '#3da8f5',
        hoverCursor: 'pointer',
    },
};

const TableHead = styled.th`
    max-width: ${(props: any) => props.theme.maxWidth as string};
    text-align: left;
    color: #3da8f5;
    padding: 1rem;
    font-weight: normal;
    border-right: 1px solid #002886;
`;

TableHead.defaultProps = {
    theme: {
        maxWidth: '150px',
    },
};

const TableHeadEnd = styled.th`
    width: ${(props: any) => props.theme.width as string};
    text-align: left;
    color: #3da8f5;
    padding: 1rem;
    font-weight: normal;
`;

TableHeadEnd.defaultProps = {
    theme: {
        width: '200px',
    },
};

const TableRow = styled.tr`
    display: ${(props: any) => props.theme.display as string};
    color: ${(props: any) => props.theme.color as string};
    opacity: ${(props: any) => props.theme.opacity as string};
    transition: 0.5s;

    &:hover {
        background: ${(props: any) => props.theme.hoverBG as string};
        cursor: ${(props: any) => props.theme.hoverCursor as string};
    }
`;

TableRow.defaultProps = {
    theme: {
        display: 'normal',
        color: '#fff',
        opacity: 1,
        hoverBG: '#002886',
        hoverCursor: 'pointer',
    },
};

export default styled(({ className }) => {
    const [tab, setTab] = useState(0);
    const tabs = ['Trading Portfolio', 'Insurance Portfolio'];
    const content = () => {
        switch (tab) {
            case 0:
                return <TradingPortfolio />;
            case 1:
                return <InsurancePortfolio />;
            default:
                return;
        }
    };
    return (
        <div className={className}>
            <NavBar />
            <div className="container flex">
                <LeftPanel>
                    <SideNav tabs={tabs} setTab={setTab} selected={tab} />
                </LeftPanel>
                <RightPanel>{content()}</RightPanel>
            </div>
        </div>
    );
})`
    min-height: 100vh;
    flex-direction: column;
    background-color: #03065e;
    color: #fff;
`;
