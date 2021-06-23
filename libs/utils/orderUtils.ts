export const calcStatus: (filled: number) => 'Unfilled' | 'Partially Filled' = (
    filled,
) => {
    if (filled > 0) {
        return 'Partially Filled';
    }
    return 'Unfilled';
};
