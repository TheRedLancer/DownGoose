/*
    Color mapping:
    blue: 0,
    orange: 1,
    pink: 2,
    yellow: 3
*/
export const colorMap = ["blue", "orange", "pink", "yellow"]


function getCardFile(colors: (string[] | undefined) ): string {
    // console.log(colors);
    if (colors) {
        let path = `/goose/${colorMap[Number(colors[0])]}_${colorMap[Number(colors[1])]}_${colorMap[Number(colors[2])]}_${colorMap[Number(colors[3])]}.png`
        return path;
    } else {
        return `/goose/gooseBack.png`;
    }
}

export default getCardFile;