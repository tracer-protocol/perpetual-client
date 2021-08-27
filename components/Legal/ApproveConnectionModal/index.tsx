import React, { FC } from 'react';
import styled from 'styled-components';
import { Button, Checkbox, CheckboxContainer, CheckboxTitle } from '@components/General';
import TracerModal from '@components/General/TracerModal';
import Link from 'next/link';

interface ACMProps {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    acceptTerms: boolean;
    setAcceptTerms: React.Dispatch<React.SetStateAction<boolean>>;
    proceed: boolean;
    setProceed: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApproveConnectionModal: FC<ACMProps> = (props: ACMProps) => {
    return (
        <LegalModal
            loading={false}
            show={props.show}
            onClose={() => {
                props.setShow(false);
                props.setAcceptTerms(false);
                props.setProceed(false);
            }}
            title="Connect Wallet"
        >
            <Terms>
                <p>
                    By connecting your wallet, you accept Tracer’s Terms of Use and represent and warrant that you are
                    not a resident of any of the following countries:
                </p>
                <p>
                    China, the United States, Antigua and Barbuda, Algeria, Bangladesh, Bolivia, Belarus, Burundi,
                    Myanmar (Burma), Cote D’Ivoire (Ivory Coast), Crimea and Sevastopol, Cuba, Democratic Republic of
                    Congo, Ecuador, Iran, Iraq, Liberia, Libya, Magnitsky, Mali, Morocco, Nepal, North Korea, Somalia,
                    Sudan, Syria, Venezuela, Yemen or Zimbabwe.
                </p>
                <Link href="/terms-of-use">
                    <a target="_blank" rel="noreferrer">
                        Read More
                    </a>
                </Link>
            </Terms>
            <ProceedWrapper>
                <CheckboxContainer
                    onClick={(e: any) => {
                        e.preventDefault();
                        props.setAcceptTerms(!props.acceptTerms);
                    }}
                    id="checkbox-container"
                >
                    <Checkbox checked={props.acceptTerms} />
                    <CheckboxTitle>I agree to Tracer’s Terms of use</CheckboxTitle>
                </CheckboxContainer>
                <Proceed
                    onClick={(e: any) => {
                        e.preventDefault();
                        if (props.acceptTerms) {
                            props.setProceed(!props.proceed);
                        }
                    }}
                    height="medium"
                    disabled={!props.acceptTerms}
                />
            </ProceedWrapper>
        </LegalModal>
    );
};

export default ApproveConnectionModal;

const ProceedWrapper = styled.div`
    height: 50px;
    display: flex;
    justify-content: space-between;
`;

const Proceed = styled(Button)`
    margin: auto;
    width: 60px;
    background: url('/img/reactour/arrow-right.svg') no-repeat center;
    background-size: 15px;
    transition: background-color 0.3s;

    &:hover {
        &[disabled] {
            background: url('/img/reactour/arrow-right.svg') no-repeat center;
            background-size: 15px;
        }

        background: url('/img/reactour/arrow-right-white.svg') no-repeat center var(--color-primary);
        background-size: 15px;
    }
`;

const LegalModal = styled(TracerModal)`
    max-width: 422px;

    ${CheckboxContainer} {
        display: flex;
        margin-top: 16px;
    }

    span,
    input {
        color: #fff;
    }
`;

const Terms = styled.div`
    background: var(--color-background);
    border-radius: 7px;
    padding: 16px;
    margin-top: 8px;

    p {
        color: #fff;
        font-size: var(--font-size-small);
        margin-bottom: 8px;
    }

    a {
        font-size: var(--font-size-small);
        color: var(--color-primary);
    }
`;
