import dynamic from 'next/dynamic';

const TVChartContainer = dynamic(
    // @ts-ignore
    import('./TVChartContainer'),
    {
        ssr: false,
    },
);

export default TVChartContainer;
