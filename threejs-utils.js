import * as THREE from 'three';

const colors = ['#F4D58D', '#BF0603', '#69D1C5', '#CECECE', '#82C09A', '#7D5BA6', '#AF7A6D', '#F7C548']

function createWall(startCorner, endCorner, index) {
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(startCorner.x, startCorner.y, 0),
        new THREE.Vector3(endCorner.x, endCorner.y, 0)
    ]), new THREE.LineBasicMaterial({color: colors[index]}))
}


const cornerMaterial = new THREE.MeshBasicMaterial({color: 0xff0000}); // red
function createCorner(corner) {
    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphere = new THREE.Mesh(geometry, cornerMaterial);
    sphere.position.set(corner.x, corner.y, 0);
    return sphere;
}

export const createThreeRoom = (roomData) => {
    const group = new THREE.Group();
    roomData.corners.forEach(corner => group.add(createCorner(corner)))
    roomData.walls.forEach((wall, index) =>
        group.add(createWall(
            roomData.corners.find(corner => corner.wallStarts[0].id === wall.id),
            roomData.corners.find(corner => corner.wallEnds[0].id === wall.id),
            index
        ))
    )
    return group;
}


const getCenterVector = (corners) => {
    const vector = corners.reduce((vector, corner) => {
        vector.x += corner.x;
        vector.y += corner.y;
        return vector;
    }, new THREE.Vector3(0, 0, 0))
    vector.x = vector.x / corners.length;
    vector.y = vector.y / corners.length;
    return vector;
}

const axisVector = new THREE.Vector3(1, 0, 0); // X

/**
 * Aligns wallId to X axis and makes sure it rotates around its center.
 */
export const alignRoomByWallToAxis = (roomData, wallId) => {
    const startCorner = roomData.corners.find(corner => corner.wallStarts[0].id === wallId);
    const endCorner = roomData.corners.find(corner => corner.wallEnds[0].id === wallId);
    const wallVector = new THREE.Vector3(endCorner.x - startCorner.x, endCorner.y - startCorner.y, 0).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(wallVector, axisVector.clone());
    const roomCenterVector = getCenterVector(roomData.corners);

    const transformedCorners = roomData.corners.map(corner => {
        const position = new THREE.Vector3(corner.x, corner.y, 0);
        position.sub(roomCenterVector);
        position.applyQuaternion(quaternion);
        position.add(roomCenterVector);
        return { ...corner, x: position.x, y: position.y };
    });

    return { walls: roomData.walls, corners: transformedCorners };
}

