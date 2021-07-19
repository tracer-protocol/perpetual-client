import React from 'react';
import NavBar from '@components/Nav';
import styled from 'styled-components';
import Footer from '@components/Footer';
import Link from 'next/link';

const GeneralContainer = styled.div`
    max-height: calc(100vh - 100px);
`;
const BodyText = styled.div`
    padding: 16px;
    width: 100%;
    border: 1px solid #0c3586;
    border-top: unset;
    overflow-y: scroll;
    height: fit-content;
    max-height: calc(100vh - 170px);

    p:last-of-type {
        padding-bottom: 0px;
    }

    a {
        color: var(--color-secondary);
    }
`;
const Title = styled.h1`
    display: flex;
    height: 65px;
    width: 100%;
    align-items: center;
    padding: 0px 16px;
    border: 1px solid #0c3586;
    border-top: unset;
    font-size: var(--font-size-medium);
    font-weight: 400;
`;
const SubHeading = styled.span`
    display: block;
    font-size: var(--font-size-small);
    color: var(--color-secondary);
    max-width: 720px;
    margin-bottom: 8px;
`;
const SmallTitle = styled.h2`
    font-size: var(--font-size-medium);
    font-weight: 400;
    color: var(--color-text);
    max-width: 720px;
    margin-bottom: 8px;
`;
const Text = styled.p`
    padding: 0px 0px 8px;
    font-size: var(--font-size-small);
    max-width: 720px;
`;
const Disclaimer: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <GeneralContainer className={`container`}>
                <Title>Tracer Protocol Disclaimer</Title>
                <BodyText>
                    <SubHeading>
                        Last Updated on July 7, 2021
                    </SubHeading>
                    <Text>
                        Your use of a smart contract governed by Tracer DAO, including Tracer Perpetual Swaps, (“Tracer protocol”) involves various risks, including, but not limited to, the risks outlined below. By interacting with the Tracer protocol, you accept those risks. If you choose to use the Tracer protocol, this Disclaimer applies in addition to Tracer’s Terms of Use, which are available <Link href="/terms-of-use/">here</Link>.
                    </Text>
                    <SmallTitle>
                        Price and asset risk: 
                    </SmallTitle>
                    <Text>
                        Asset losses are possible due to the fluctuation of prices of tokens. You acknowledge that financial contracts involving cryptocurrencies are inherently risky, some cryptocurrencies are not recognised legal tender in some countries, are unregulated by many central and government authorities, and may be subject to extreme price volatility. You warrant that you understand the risks associated with transactions, cryptocurrencies, financial contracts and any other goods, services or products in connection to the Tracer protocol. Before using the Tracer protocol, you should review the relevant documentation to make sure you understand how the Tracer protocol works. 
                    </Text>
                    <SmallTitle>
                        Liquidation risk:
                    </SmallTitle>
                    <Text>
                        When interacting with the Tracer protocol, your positions are subject to liquidation risk. Despite having well defined liquidation penalties, your loss could be 100% of your position. This risk is not only theoretical, during the so-called “Black Thursday”, around $8M of user’s positions in MakerDAO was lost. <b>The Tracer protocol is non-custodial, and therefore can not help users to avoid liquidations, or recover funds following liquidation.</b>
                    </Text>
                    <SmallTitle>
                        Oracle risk:
                    </SmallTitle>
                    <Text>
                        Tracer relies on oracles to provide spot price data for assets. This price data is used as part of the liquidation flow and, as a result, has inherent risks. Should oracle prices not be updated, or should they be updated erroneously, there is risk a user may be liquidated unexpectedly. At this time, the Tracer protocol uses Chainlink’s oracle network; however, this may be subject to change.
                    </Text>
                    <SmallTitle>
                        Smart contract and software risk:
                    </SmallTitle>
                    <Text>
                        The Tracer protocol has been audited by Sigma Prime and Code 423n4. The contracts were checked for correctness of functionality and safety of user funds. However, an audit does not eliminate the risk of an exploit or bug being present in the Tracer protocol. You must do your own research before interacting with the Tracer protocol, and only supply funds that you are prepared to lose.
                    </Text>
                    <SmallTitle>
                        Contract upgrade risk:
                    </SmallTitle>
                    <Text>
                        Contract upgrades may be implemented by Tracer DAO, via proposal, to the Tracer protocol. While these upgrades will likely be audited prior to implementation, the Tracer protocol’s codebase is subject to change and, as such, risks of exploits and bugs are present. You must remain aware of updates being implemented by Tracer DAO to the Tracer protocol, and ensure that, following any update, the Tracer protocol is safe to use.
                    </Text>
                    <SmallTitle>
                        Governance risk:
                    </SmallTitle>
                    <Text>
                        Tracer DAO owns and controls the Tracer protocol. Upgrades and modifications to the protocol are managed in a decentralised manner by holders of TCR governance tokens. No entity involved in creating the Tracer protocol (including developers) will be liable for any claims or damage whatsoever associated with your use, inability to use, direct, indirect, incidental, special, exemplary, punitive or consequential damages, or loss of profits, cryptocurrencies, tokens, or anything else of value. For the avoidance of doubt, Tracer DAO does not control user funds. 
                    </Text>
                    <Text>
                        Discussions with updated information on the Tracer protocol’s governance can be found in <Link href="https://discourse.tracer.finance/">Tracer DAO's Discourse</Link>. 
                    </Text>
                </BodyText>
            </GeneralContainer>
            <Footer />
        </div>
    );
})`
    min-height: 100vh;
    background-color: var(--color-background);
    color: var(--color-text);
`;

export default Disclaimer;
