import { Checkbox, CheckboxContainer, CheckboxTitle } from '@components/General';
import TracerModal from '@components/General/TracerModal';
import Link from 'next/link';
import styled from 'styled-components';
import React from 'react';

export const Terms = styled.div`
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

interface ACMProps {
    className: string;
    acceptedTerms: boolean;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    acceptTerms: React.Dispatch<React.SetStateAction<boolean>>;
};

const ApproveConnectionModal: React.FC<ACMProps> = styled((props: ACMProps) => {
        return (
            <>
                <TracerModal
                    loading={false}
                        show={props.show}
                        id="legal-modal"
                        onClose={() => {
                            props.acceptTerms(false);
                            props.setShow(false);
                        }}
                        title="Connect Wallet"
                    >
                    <Terms>
                        <p>
                            By connecting your wallet, you accept Tracer’s Terms of Use and represent and warrant that you
                            are not a resident of any of the following countries:
                        </p>
                        <p>
                            China, the United States, Antigua and Barbuda, Algeria, Bangladesh, Bolivia, Belarus, Burundi,
                            Myanmar (Burma), Cote D’Ivoire (Ivory Coast), Crimea and Sevastopol, Cuba, Democratic Republic
                            of Congo, Ecuador, Iran, Iraq, Liberia, Libya, Magnitsky, Mali, Morocco, Nepal, North Korea,
                            Somalia, Sudan, Syria, Venezuela, Yemen or Zimbabwe.
                        </p>
                        <Link href="/terms-of-use">
                            <a target="_blank" rel="noreferrer">
                                Read More
                            </a>
                        </Link>
                    </Terms>
                    <CheckboxContainer
                        onClick={(e: any) => {
                            e.preventDefault();
                            props.acceptTerms(!props.acceptedTerms);
                        }}
                        id="checkbox-container"
                    >
                        <Checkbox checked={props.acceptedTerms} />
                        <CheckboxTitle>I agree to Tracer’s Terms of use</CheckboxTitle>
                    </CheckboxContainer>
                </TracerModal>
            </>
        );
    },
)`
`;

export default ApproveConnectionModal;
