import React from 'react';
import { SubNavContainer, SubNavItem } from '@components/Nav/SubNav';
import styled from 'styled-components';

type TEProps = {
	amount: number,
	className?: string
}
const TableEntries: React.FC<TEProps>= styled(({ amount, className }: TEProps) => (
	<span className={className}>
		{amount}
	</span>
))`
	background: #005EA4;
	color: #000240;
	border-radius: 20px;
	text-align: center;
	padding: 5px 15px;
	margin: 5px;
	font-size: 16px;
`
type CSNProps = {
    selected: number;
    setTab: (id: number) => void;
	fills: number,
	orders: number
}
const CustomSubNav:React.FC<CSNProps> = ({
    setTab,
    selected,
	fills,
	orders
}: CSNProps) => (
	<SubNavContainer>
		<SubNavItem
			className={0 === selected ? 'selected' : ''}
			key={`sub-nav-positions`}
			onClick={(e) => {
				e.preventDefault();
				setTab(0);
			}}
		>
			{'Position'}
		</SubNavItem>
		<SubNavItem
			className={1 === selected ? 'selected' : ''}
			key={`sub-nav-orders`}
			onClick={(e) => {
				e.preventDefault();
				setTab(1);
			}}
		>
			{'Orders'}
			<TableEntries amount={orders} />
		</SubNavItem>
		<SubNavItem
			className={2 === selected ? 'selected' : ''}
			key={`sub-nav-fills`}
			onClick={(e) => {
				e.preventDefault();
				setTab(2);
			}}
		>

			{'Fills'}
			<TableEntries amount={fills} />
		</SubNavItem>
	</SubNavContainer>
);

export default CustomSubNav;
