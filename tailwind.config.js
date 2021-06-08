module.exports = {
    important: true,
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        container: {
            center: true,
        },
        minWidth: {
            0: '0',
            '1/4': '25%',
            '1/3': '33%',
            '1/2': '50%',
            '3/4': '75%',
            full: '100%',
        },
        inset: {
            0: 0,
            auto: 'auto',
            'neg-1/2': '-50%',
        },
        colors: {
            blue: {
                100: '#0000bd',
                200: '#E5E5F8',
                300: '#f2f2fc',
            },
            lightBlue: '#f2f2fc',
            gray: {
                100: '#d5d5d5',
                200: '#a0aec0',
            },
            white: '#ffffff',
            black: '#000000',
            green: {
                50: '#E3FCEF',
                100: '#bff0aa',
                200: '#3DAD39',
                900: '#55D31D',
            },
            red: {
                50: '#FFEBE6', // ultra light red
                100: '#FEB6B6', // very light red
                200: '#F57979', // light red
                500: '#FF5630', // red red
                800: '#BF2600', // dark-red
                900: '#FF0000', // all red
            },
            error: {
                100: '#FEB6B6',
                200: '#f78484',
            },
            warning: {
                100: '#FED4B6',
                200: '#f7bd93',
            },
        },
        extend: {
            boxShadow: {
                red: '0 0 10px 5px rgba(255, 0, 0, 0.1)',
                green: '0 0 20px 10px rgba(85, 211, 29, 0.15)',
                gray: '0 0 20px 10px rgba(213, 213, 213, 0.25)',
            },
            scale: (theme) => ({
                101: '1.01',
            }),
            minHeight: (theme) => ({
                'screen/10': '10vh',
                'screen/20': '20vh',
                'screen/30': '30vh',
                'screen/40': '40vh',
                'screen/50': '50vh',
                'screen/55': '55vh',
                'screen/60': '60vh',
                'screen/70': '70vh',
                'screen/80': '80vh',
                'screen/90': '90vh',
            }),
            maxHeight: (theme) => ({
                'screen/90': '90vh',
            }),
            height: (theme) => ({
                'screen/3': '3vh',
                'screen/7': '7vh',
                'screen/10': '10vh',
                'screen/20': '20vh',
                'screen/30': '30vh',
                'screen/40': '40vh',
                'screen/50': '50vh',
                'screen/60': '60vh',
                'screen/70': '70vh',
                'screen/80': '80vh',
                'screen/90': '90vh',
            }),
            borderRadius: {
                xxl: '15px',
            },
        },
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            textColor: ['active'],
        },
    },
    plugins: [],
};
