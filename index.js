import {
    formatNumber,
    generateRoom,
    getRoomsDimensions,
    SQUARE_ROOM_DEFAULTS,
    TRIANGLE_ROOM_DEFAULTS,
    TSHAPE_ROOM_DEFAULTS
} from './data-utils';
import {alignRoomByWallToAxis, createThreeRoom} from './threejs-utils';
import {scene} from "./threejs-setup";

let roomsData = [];
let threeJsRooms = [];

const triangleStats = document.getElementById('triangle-stat');
const squareStats = document.getElementById('square-stat');
const tshapeStats = document.getElementById('tshape-stat');
const updateStats = () => {
    const [triangle, square, tshape] = roomsData.map(getRoomsDimensions);
    triangleStats.innerText = `w: ${formatNumber(triangle[0])}, h: ${formatNumber(triangle[1])}`
    squareStats.innerText = `w: ${formatNumber(square[0])}, h: ${formatNumber(square[1])}`
    tshapeStats.innerText = `w: ${formatNumber(tshape[0])}, h: ${formatNumber(tshape[1])}`
}

const dismountRooms = () => threeJsRooms.forEach(room => scene.remove(room));
const mountRooms = () => {
    threeJsRooms.forEach((room, index) => {
        room.position.x += (index - 1) * 20 ;
        scene.add(room)
    });
}

const presets = [TRIANGLE_ROOM_DEFAULTS, SQUARE_ROOM_DEFAULTS, TSHAPE_ROOM_DEFAULTS];
const refreshRooms = () => {
    dismountRooms();
    roomsData = presets.map(generateRoom);
    threeJsRooms = roomsData.map(createThreeRoom);
    mountRooms();
    updateStats();
}
window.refreshRooms = refreshRooms;

let wallIndex = 1;
const nextWallAlign = () => {
    wallIndex++;
    dismountRooms();
    roomsData = roomsData.map(room => alignRoomByWallToAxis(room, room.walls[wallIndex % room.walls.length].id));
    threeJsRooms = roomsData.map(createThreeRoom);
    mountRooms();
    updateStats();
}
window.nextWallAlign = nextWallAlign;

refreshRooms();
nextWallAlign();
updateStats();