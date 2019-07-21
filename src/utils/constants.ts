
interface Constants {
    bondLength: number;
    frameTime: number;
    scrollDistance: number;
    screenScrollWidth: number;
    clickTime: number;
}

const constants: Constants = {
    bondLength: 50,
    frameTime: 50,
    scrollDistance: 0,
    screenScrollWidth: 50,
    clickTime: 250
};
constants.scrollDistance = constants.frameTime * 3 / 5;

export { constants as Constants };
