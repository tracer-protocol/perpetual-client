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
`;
const Text = styled.p`
    padding: 16px 0px;
    font-size: var(--font-size-small);
    max-width: 720px;
`;
const PrivacyPolicy: React.FC = styled(({ className }) => {
    return (
        <div className={className}>
            <NavBar />
            <GeneralContainer className={`container`}>
                <Title>Privacy Policy</Title>
                <BodyText>
                    <SmallTitle>
                        Lorem Ipsum
                    </SmallTitle>
                    <Text>
                        Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Cras Gravida Egestas Nunc, A Pharetra Lorem. Vivamus Laoreet Tortor Leo, Ac Placerat Leo Sagittis Sit Amet. Maecenas Eget Velit Augue. Orci Varius Natoque Penatibus Et Magnis Dis Parturient Montes, Nascetur Ridiculus Mus. Quisque At Est Vitae Ante Gravida Fermentum Vitae Sit Amet Lectus. Aliquam Tincidunt Luctus Nulla Quis Accumsan. Cras Accumsan Felis Vel Nulla Facilisis Rutrum A In Magna. Cras Sit Amet Interdum Augue, Quis Laoreet Libero. Maecenas Finibus Est Nec Luctus Consectetur. Aenean Mi Tortor, Tempor Vel Purus Feugiat, Dignissim Imperdiet Ipsum. Integer Eleifend Sapien Sit Amet Malesuada Fermentum. Vestibulum Blandit Erat Non Ipsum Ultrices Semper.
                    </Text>
                    <SmallTitle>
                        Lorem Ipsum
                    </SmallTitle>
                    <Text>
                        Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Cras Gravida Egestas Nunc, A Pharetra Lorem. Vivamus Laoreet Tortor Leo, Ac Placerat Leo Sagittis Sit Amet. Maecenas Eget Velit Augue. Orci Varius Natoque Penatibus Et Magnis Dis Parturient Montes, Nascetur Ridiculus Mus. Quisque At Est Vitae Ante Gravida Fermentum Vitae Sit Amet Lectus. Aliquam Tincidunt Luctus Nulla Quis Accumsan. Cras Accumsan Felis Vel Nulla Facilisis Rutrum A In Magna. Cras Sit Amet Interdum Augue, Quis Laoreet Libero. Maecenas Finibus Est Nec Luctus Consectetur. Aenean Mi Tortor, Tempor Vel Purus Feugiat, Dignissim Imperdiet Ipsum. Integer Eleifend Sapien Sit Amet Malesuada Fermentum. Vestibulum Blandit Erat Non Ipsum Ultrices Semper.
                    </Text>
                    <SmallTitle>
                        Lorem Ipsum
                    </SmallTitle>
                    <Text>
                        Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Cras Gravida Egestas Nunc, A Pharetra Lorem. Vivamus Laoreet Tortor Leo, Ac Placerat Leo Sagittis Sit Amet. Maecenas Eget Velit Augue. Orci Varius Natoque Penatibus Et Magnis Dis Parturient Montes, Nascetur Ridiculus Mus. Quisque At Est Vitae Ante Gravida Fermentum Vitae Sit Amet Lectus. Aliquam Tincidunt Luctus Nulla Quis Accumsan. Cras Accumsan Felis Vel Nulla Facilisis Rutrum A In Magna. Cras Sit Amet Interdum Augue, Quis Laoreet Libero. Maecenas Finibus Est Nec Luctus Consectetur. Aenean Mi Tortor, Tempor Vel Purus Feugiat, Dignissim Imperdiet Ipsum. Integer Eleifend Sapien Sit Amet Malesuada Fermentum. Vestibulum Blandit Erat Non Ipsum Ultrices Semper.
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
