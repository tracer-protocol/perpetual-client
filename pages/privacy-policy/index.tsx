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
const List = styled.ul`
    max-width: 720px;
    list-style: unset;
    padding-inline-start: 16px;
    margin-bottom: 16px;
`;
const PrivacyPolicy: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <GeneralContainer className={`container`}>
                <Title>Privacy Policy</Title>
                <BodyText>
                    <Text>
                        In this Privacy Policy, ’us’ ‘we’ or ‘our’ means Tracer DAO. We are committed to respecting your privacy. Our Privacy Policy sets out how we collect, use, store and disclose your personal information.
                    </Text>
                    <Text>
                        This Privacy Policy applies to our services, which include the services we provide on https://tracer.finance/ or any other websites, pages, features, or content we own or operate or when you use related services. If you do not agree with the terms of this Privacy Policy, do not access or use the services, websites, or any other aspect of our business. 
                    </Text>
                    <Text>
                        By providing personal information to us, you consent to our collection, use and disclosure of your personal information in accordance with this Privacy Policy and any other arrangements that apply between us. We may change our Privacy Policy from time to time by publishing changes to it on our website. We encourage you to check our website periodically to ensure that you are aware of our current Privacy Policy.
                    </Text>
                    <Text>
                        Personal information includes information or an opinion about an individual that is reasonably identifiable.
                    </Text>
                    <SmallTitle>
                        What personal information do we collect?
                    </SmallTitle>
                    <Text>
                        We may collect the following types of personal information:
                    </Text>
                    <List>
                        <li>contact information, such as your email address;</li>
                        <li>transactional information, such as information about the transactions you make on our services, such as the type, time or amount of a transaction;</li>
                        <li>correspondence, such as your feedback or questionnaire and other survey responses; </li>
                        <li>online identifiers, such as your blockchain address, device ID, device type, geo-location information, computer and connection information, statistics on page views, traffic to and from the sites, ad data, IP address and standard web log information;</li>
                        <li>usage data, such as user preferences and other data collected;</li>
                        <li>details of the products and services we have provided to you or that you have enquired about, including any additional information necessary to deliver those products and services and respond to your enquiries;</li>
                        <li>any additional information relating to you that you provide to us directly through our website or app or indirectly through your use of our website or app or online presence or through other websites or accounts from which you permit us to collect information; or</li>
                        <li>any other personal information that may be required in order to facilitate your dealings with us.</li>
                    </List>
                    <SmallTitle>
                        How do we collect personal information?
                    </SmallTitle>
                    <Text>
                        We may collect these types of personal information either directly from you, or from third parties.  We may collect this information when you:
                    </Text>
                    <List>
                        <li>register on our website or app;</li>
                        <li>communicate with us through correspondence, chats, email, or when you share information with us from other social applications, services or websites; or</li>
                        <li>interact with our sites, services, content and advertising.</li>
                        <li>Why do we collect, use and disclose personal information?</li>
                        <li>We may collect, hold, use and disclose your personal information for the following purposes:</li>
                        <li>to enable you to access and use our website, services and app;</li>
                        <li>to operate, protect, improve and optimise our website, services and app, business and our users’ experience, such as to perform analytics, conduct research and for advertising and marketing; </li>
                        <li>to send you service, support and administrative messages, reminders, technical notices, updates, security alerts, and information requested by you;</li>
                        <li>to send you marketing and promotional messages and other information that may be of interest to you, including information sent by, or on behalf of, our business partners that we think you may find interesting;</li>
                        <li>to administer rewards, surveys, contests, or other promotional activities or events sponsored or managed by us or our business partners;</li>
                        <li>to comply with our legal obligations, resolve any disputes that we may have with any of our users, and enforce our agreements with third parties; and</li>
                        <li>to consider your employment application.</li>
                    </List>
                    <Text>
                        We may also disclose your personal information to a trusted third party who also holds other information about you. This third party may combine that information in order to enable it and us to develop anonymised consumer insights so that we can better understand your preferences and interests, personalise your experience and enhance the products and services that you receive.
                    </Text>
                    <SmallTitle>
                        Do we use your personal information for direct marketing?
                    </SmallTitle>
                    <Text>
                        We and/or our carefully selected business partners may send you direct marketing communications and information about our service and products. This may take the form of emails, Discord messages, or other forms of communication, in accordance with the OECD Guidelines on the Protection of Privacy and Transborder Flows of Personal Data. You may opt-out of receiving marketing materials from us by contacting us using the details set out below or by using the opt-out facilities provided (eg an unsubscribe link).
                    </Text>
                    <SmallTitle>
                        To whom do we disclose your personal information?
                    </SmallTitle>
                    <Text>
                        We may disclose personal information for the purposes described in this privacy policy to:
                    </Text>
                    <List>
                        <li>third party suppliers and service providers (including providers for the operation of our websites and/or our business or in connection with providing our products and services to you);</li>
                        <li>our existing or potential agents, business partners or partners;</li>
                        <li>our sponsors or promoters of any competition that we conduct via our services;</li>
                        <li>anyone to whom our assets or businesses (or any part of them) are transferred;</li>
                        <li>specific third parties authorised by you to receive information held by us; and/or</li>
                        <li>other persons, including government agencies, regulatory bodies and law enforcement agencies, or as required, authorised or permitted by law.</li>
                    </List>
                    <SmallTitle>
                        Disclosure of personal information
                    </SmallTitle>
                    <Text>
                        When you provide your personal information to us, you consent to the disclosure of your information globally. We will, however, take reasonable steps to ensure that any overseas recipient will deal with such personal information in a way that is consistent with the OECD Guidelines on the Protection of Privacy and Transborder Flows of Personal Data.
                    </Text>
                    <SmallTitle>
                        Using our website
                    </SmallTitle>
                    <Text>
                        We may collect personal information about you when you use and access our website. 
                    </Text>
                    <Text>
                        While we do not use browsing information to identify you personally, we may record certain information about your use of our website, such as which pages you visit, the time and date of your visit and the internet protocol address assigned to your computer.
                    </Text>
                    <SmallTitle>
                        Security
                    </SmallTitle>
                    <Text>
                        We may hold your personal information in either electronic or hard copy form. We take  reasonable steps to protect your personal information from misuse, interference and loss, as well as unauthorised access, modification or disclosure and we use a number of physical, administrative, personnel and technical measures to protect your personal information. However, we cannot guarantee the security of your personal information.
                    </Text>
                    <SmallTitle>
                        Integrated third party services
                    </SmallTitle>
                    <Text>
                        Various third party services are integrated with our website, including MetaMask. Unless expressly stated otherwise, we are not responsible for the privacy practices of integrated third party services, and have no control over or rights in those linked services. The privacy policies that apply to integrated third party services may differ substantially from our Privacy Policy, so we encourage individuals to read them before using those services.
                    </Text>
                    <SmallTitle>
                        Links
                    </SmallTitle>
                    <Text>
                        Our website may contain links to websites operated by third parties. Those links are provided for convenience and may not remain current or be maintained. Unless expressly stated otherwise, we are not responsible for the privacy practices of, or any content on, those linked websites, and have no control over or rights in those linked websites. The privacy policies that apply to those other websites may differ substantially from our Privacy Policy, so we encourage individuals to read them before using those websites.
                    </Text>
                    <SmallTitle>
                        Accessing or correcting your personal information
                    </SmallTitle>
                    <Text>
                        You can access the personal information we hold about you by contacting us at hello@tracer.finance. Sometimes, we may not be able to provide you with access to all of your personal information and, where this is the case, we will tell you why. We may also need to verify your identity when you request your personal information.
                    </Text>
                    <Text>
                        If you think that any personal information we hold about you is inaccurate, please contact us and we will take reasonable steps to ensure that it is corrected.
                    </Text>
                    <SmallTitle>
                        Making a complaint
                    </SmallTitle>
                    <Text>
                        If you think we have breached the OECD Guidelines on the Protection of Privacy and Transborder Flows of Personal Data, or you wish to make a complaint about the way we have handled your personal information, you can contact us at hello@tracer.finance. Please include your name or Discord username and clearly describe your complaint. We will acknowledge your complaint and respond to you regarding your complaint within a reasonable period of time. If you think that we have failed to resolve the complaint satisfactorily, we will provide you with information about the further steps you can take.
                    </Text>
                    <SmallTitle>
                        Contact Us
                    </SmallTitle>
                    <Text>
                        For further information about our Privacy Policy or practices, or to access or correct your personal information, or make a complaint, please contact us at hello@tracer.finance.
                    </Text>
                    <SmallTitle>
                        Effective
                    </SmallTitle>
                    <Text>
                        23 April, 2021
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

export default PrivacyPolicy;
