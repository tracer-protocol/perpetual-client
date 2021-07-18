import React from 'react';
import NavBar from '@components/Nav';
import styled from 'styled-components';
import Footer from '@components/Footer';

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
    font-size: var(--font-size-small);
    color: var(--color-secondary);
    max-width: 720px;
`;
const Text = styled.p`
    padding: 16px 0px;
    font-size: var(--font-size-small);
    max-width: 720px;
`;
const Terms: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <GeneralContainer className={`container`}>
                <Title>Terms of Use</Title>
                <BodyText>
                    <SubHeading>
                        Last Updated on July 8, 2021
                    </SubHeading>
                    <Text>
                        These Terms And Conditions, Together With Any Documents And Additional Terms They Expressly Incorporate By Reference, Which Includes Any Other Terms And Conditions Or Other Agreement That Tracer DAO (“Tracer DAO,” “We,” “Us” And “Our”) Posts Publicly Or Makes Available To You Or The Company Or Other Legal Entity You Represent (“You” Or “Your”) (Collectively, These “Terms”), Are Entered Into Between Tracer DAO And You Concerning Your Use Of, And Access To, Tracer Dao’s Websites, Including Tracer.Finance/Exchange/; Web Applications; Mobile Applications; And All Associated Sites Linked Thereto By Tracer DAO Or Its Affiliates (Collectively With Any Materials And Services Available Therein, And Successor Website(S) Or Application(S) Thereto, The “Site”).
                    </Text>
                    <Text>
                        BY ACCESSING OR USING THE SITE, YOU REPRESENT AND WARRANT THAT YOU WILL NOT USE THE SITE IF THE LAWS APPLICABLE TO YOU OF DUE TO YOUR COUNTRY OF RESIDENCY AND/OR CITIZENSHIP PROHIBIT YOU FROM DOING SO IN ACCORDANCE WITH THESE TERMS. OUR PERPETUAL SWAP CONTRACTS ARE NOT OFFERED TO PERSONS OR ENTITIES WHO RESIDE IN, ARE CITIZENS OF, ARE LOCATED IN, ARE INCORPORATED IN, OR HAVE A REGISTERED OFFICE IN THE UNITED STATES OF AMERICA (COLLECTIVELY, “US PERSONS”) OR ANY RESTRICTED TERRITORY, AS DEFINED BELOW (ANY SUCH PERSON OR ENTITY FROM THE UNITED STATES OF AMERICA OR A RESTRICTED TERRITORY, A “RESTRICTED PERSON”). WE DO NOT MAKE EXCEPTIONS; THEREFORE, IF YOU ARE A RESTRICTED PERSON, DO NOT ATTEMPT TO USE OUR PERPETUAL SWAP CONTRACTS, SITE OR SERVICES. USE OF A VIRTUAL PRIVATE NETWORK (“VPN”) TO CIRCUMVENT THE RESTRICTIONS SET FORTH HEREIN IS PROHIBITED. PURSUANT TO APPLICABLE LAWS AND REGULATIONS, TRACER DAO MAINTAINS THE RIGHT TO SELECT ITS MARKETS AND JURISDICTIONS TO OPERATE AND MAY RESTRICT OR DENY THE USE OF THE SITE OR ANY PART THEREOF, IN CERTAIN COUNTRIES AT ITS DISCRETION. 
                    </Text>
                    <Text>
                        Please Read These Terms Carefully, As These Terms Govern Your Use Of The Site And Access To The Factory; Matching Engine; Smart Contracts; Decentralised Applications; Apis And All Other Software That Tracer DAO Has Developed For Entering Into Perpetual Swap Contracts (“Perpetual Swap Contracts”) Related To Any Asset With An Ascertainable Price Feed, Including Cryptocurrencies, Cryptographic Tokens And Other Blockchain-Based Assets (Collectively, “Assets”) (Collectively, The “Services”). These Terms Expressly Cover Your Rights And Obligations, And Our Disclaimers And Limitations Of Legal Liability, Relating To Your Use Of, And Access To, The Site And The Services. By Clicking “I Accept” (Or A Similar Language) To These Terms, Acknowledging These Terms And Conditions By Other Means, Or Otherwise Accessing Or Using The Site Or The Services, You Accept And Agree To Be Bound By And To Comply With These Terms, Including, Without Limitation, The Mandatory Arbitration Provision In Section 15. If You Do Not Agree To These Terms, Then You Must Not Access Or Use The Site Or The Services.
                    </Text>
                    <Text>
                        Please Carefully Review The Disclosures And Disclaimers Set Forth In Section 12 In Their Entirety Before Using Any Software Developed By Tracer DAO. The Information In Section 12 Provides Important Details About The Legal Obligations Associated With Your Use Of The Services. By Accessing Or Using The Site Or The Services, You Agree That Tracer DAO Does Not Provide Execution, Settlement, Or Clearing Services Of Any Kind And Is Not Responsible For The Execution, Settlement, Or Clearing Of Transactions Automated Through The Services.
                    </Text>
                    <Text>
                        1. MODIFICATIONS to these terms
                    </Text>
                    <Text>
                        We reserve the right, in our sole discretion, to modify these Terms from time to time. If we make changes, we will provide you with notice of such changes, such as by providing notice through the Services or updating the “Last Updated” date at the top of these Terms. Unless we state otherwise in our notice, all such modifications are effective immediately, and your continued use of the Site and the Services after we provide that notice will confirm your acceptance of the changes. If you do not agree to the amended Terms, then you must stop using the Site and the Services.
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

export default Terms;
