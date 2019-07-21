
interface Constants {
    bondLength: number;
    frameTime: number;
    scrollDistance: number;
    screenScrollWidth: number;
}

const constants: Constants = {
    bondLength: 50,
    frameTime: 50,
    scrollDistance: 0,
    screenScrollWidth: 50
};
constants.scrollDistance = constants.frameTime * 3 / 5;

export { constants as Constants };
