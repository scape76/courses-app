export const convertSecondsToString = (secondsDuration: number): string => {
    const minutes = Math.floor(secondsDuration / 60)
    const seconds = secondsDuration - minutes *  60;
    return `${minutes}m ${seconds}s`;
}