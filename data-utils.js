/**
 * type Wall = {
 *   id: string;
 * };
 *
 * type Corner = {
 *   id: string;
 *   x: number;
 *   y: number;
 *   wallStarts: Wall[];
 *   wallEnds: Wall[];
 * };
 *
 * type RoomData = {
 *   walls: Wall[];
 *   corners: Corner[];
 * };
 */

const generateRandomId = () => crypto.randomUUID();

const offsetCoordinate = (coord, amount) =>
    coord + Math.random() * 2 * amount - amount;

/**
 * Creating room data with slightly offset wall coordinates.
 * @returns RoomData
 */
export const generateRoom = (preset) => {
    const walls =
        Array.from({length: preset.length})
            .map(wall => ({id: generateRandomId()}));
    const corners = preset
        .map((pos, index) => ({
            id: generateRandomId(),
            x: offsetCoordinate(pos.x, 1),
            y: offsetCoordinate(pos.y, 1),
            wallStarts: [walls[index]],
            wallEnds: [walls[(index + 1) % preset.length]],
        }));
    return {walls, corners};
}

export const SQUARE_ROOM_DEFAULTS = [
    {x: 0, y: 0},
    {x: 0, y: 10},
    {x: 10, y: 10},
    {x: 10, y: 0},
]

export const TRIANGLE_ROOM_DEFAULTS = [
    {x: 0, y: 0},
    {x: 0, y: 10},
    {x: 7, y: 5},
];

export const TSHAPE_ROOM_DEFAULTS = [
    { x: 0, y: 0 },
    { x: 0, y: 5 },
    { x: 2.5, y: 5 },
    { x: 2.5, y: 10 },
    { x: 7.5, y: 10 },
    { x: 7.5, y: 5 },
    { x: 10, y: 5 },
    { x: 10, y: 0 },
]

export const getRoomsDimensions = (roomData) => {
    let xMin, xMax, yMin, yMax;
    roomData.corners.forEach(({x, y}) => {
        if (!xMax || x > xMax) xMax = x;
        if (!xMin || x < xMin) xMin = x;
        if (!yMax || y > yMax) yMax = y;
        if (!yMin || y < yMin) yMin = y;
    })
    return [xMax - xMin, yMax - yMin];
}

const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
});

export const formatNumber = (number) => {
    return formatter.format(number)
}