import React from 'react';
import MobileSocialLogos from './MobileSocialLogos';
import styled from 'styled-components';

export default (() => (
    <StyledHeaderSiteSwitcher>
        <MainLink href="/">
            <StyledTracerLogo
                alt="tracer-logo"
                src="/img/logos/tracer/tracer_perps.svg"
            />
        </MainLink>

        <StyledTriangleDown src="/img/general/triangle_down_cropped.svg" />

        <Menu>
            <MenuItem>
                <a
                    href="https://tracer.finance"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <StyledTracerLogo
                        alt="tracer-logo"
                        src="/img/logos/tracer/tracer_logo.svg"
                    />
                </a>
            </MenuItem>
            <MenuItem>
                <a
                    href="https://tracer.finance"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <StyledTracerLogo
                        alt="tracer-logo"
                        src="/img/logos/tracer/tracer_logo.svg"
                    />
                </a>
            </MenuItem>
            <MenuItem>
                <a
                    href="https://gov.tracer.finance"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <StyledTracerLogo
                        alt="tracer-logo"
                        src="/img/logos/tracer/tracer_govern.svg"
                    />
                </a>
            </MenuItem>
            <MenuItem>
                <a
                    href="https://tracer.finance/radar"
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    <StyledTracerLogo
                        alt="tracer-logo"
                        src="/img/logos/tracer/tracer_blog.svg"
                    />
                </a>
            </MenuItem>
            <MenuItem>
                <StyledMobileSocialLogos />
            </MenuItem>
        </Menu>
    </StyledHeaderSiteSwitcher>
)) as React.FC;

const MainLink = styled.a`
    z-index: 11;
`;

const StyledTriangleDown = styled.img`
    height: 1rem;
    transition: all 400ms ease-in-out;
    z-index: 11;
`;

const StyledTracerLogo = styled.img`
    display: block;
    height: 2rem;
    margin-right: 2rem;
`;

const Menu = styled.div`
    position: absolute;
    top: -2rem;
    left: -3.5rem;
    right: -3.5rem;
    padding: 2rem 0;
    opacity: 0;
    background: var(--color-accent);
    border-radius: 1rem;
    transform-origin: top center;
    transform: scale(0.7, 0);
    transition: all 500ms ease-in-out;
    z-index: 10;
`;
const MenuItem = styled.div`
    border-bottom: 1px solid var(--color-primary);
    transition: all 400ms ease;
    padding-left: 3rem;

    &:not(:first-child) {
        opacity: 0;
        padding-left: 3rem;
    }
    &:first-child {
        opacity: 0;
        padding-bottom: 2rem;
    }
    &:first-child > ${StyledTracerLogo} {
        opacity: 0;
    }
    > a {
        display: block;
        padding: 1.5rem 3.5rem;
        transition: all 300ms ease;
    }
    &:first-child > a {
        padding-top: 0;
        opacity: 0;
    }
    &:not(:first-child) > a:hover {
        background: var(--color-primary);
    }
    &:last-child {
        padding: 1rem 3.5rem 0 3.5rem;
        border-bottom: none;
    }
`;

const StyledMobileSocialLogos = styled(MobileSocialLogos)`
    width: 60%;
`;

const StyledHeaderSiteSwitcher = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    &:hover {
        ${StyledTriangleDown} {
            transform: rotate(180deg);
        }
        ${Menu} {
            opacity: 1;
            transform: none;
        }
        ${MenuItem} {
            opacity: 1;
            padding-left: 0;
            &:last-child {
                padding-left: 3.5rem;
            }
        }
        ${MenuItem}:nth-child(2) {
            transition: all 400ms ease 300ms;
        }
        ${MenuItem}:nth-child(3) {
            transition: all 400ms ease 450ms;
        }
        ${MenuItem}:nth-child(4) {
            transition: all 400ms ease 600ms;
        }
        ${MenuItem}:nth-child(5) {
            transition: all 400ms ease 750ms;
        }
        ${MenuItem}:nth-child(6) {
            transition: all 400ms ease 900ms;
        }
    }
`;
