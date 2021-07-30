import dynamic from 'next/dynamic';

const TVChartContainer = dynamic(
	// @ts-ignore
	import('./TVChartContainer'),
	{ 
		ssr: false,
		loading: () => <p>...</p> 
	},
);

export default TVChartContainer;