import { RGroup } from "../../../models";

const angles: number[] = [
  0.0,
  90.0,
  270.0,
  180.0,
  45.0,
  315.0,
  225.0,
  135.0,
  120.0,
  240.0,
  330.0,
  150.0,
  210.0,
  30.0,
  60.0,
  300.0,
  72.0,
  288.0,
  18.0,
  198.0,
  144.0,
  216.0,
  306.0,
  126.0,
  234.0,
  54.0,
  162.0,
  342.0,
  40.0,
  320.0,
  50.0,
  230.0,
  80.0,
  280.0,
  10.0,
  190.0,
  160.0,
  200.0,
  290.0,
  110.0,
  250.0,
  70.0,
  170.0,
  350.0,
  130.0,
  310.0,
  36.0,
  324.0,
  108.0,
  252.0
];
const lockDist = 6;

function calculateAngle(dist: number, raw: number, offset = 0): number {
  for (let angle of angles) {
    let chord = Math.abs(
      dist * 2 * Math.sin((Math.PI / 180 / 2) * (raw - angle + offset))
    );
    if (chord < lockDist)
      return (((-angle + offset + 360) % 360) * Math.PI) / 180;
  }
  return (((-raw + 360) % 360) * Math.PI) / 180;
}

async function rotate(
  x: number,
  y: number,
  angle: number,
  initPoints: { x: number; y: number }[]
) {
  doRotate(x, y, angle, initPoints);
}

function doRotate(
  x: number,
  y: number,
  angle: number,
  initPoints: { x: number; y: number }[]
) {
  let cos = Math.cos(angle),
    sin = Math.sin(angle);
  for (let point of initPoints) {
    let sx = point.x - x,
      sy = point.y - y;
    point.x = sx * cos - sy * sin + x;
    point.y = sx * sin - sy * cos + y;
  }
}

function getCenter(selected: RGroup[]) {
  //Rotate around the center of the selected group to avoid putting the atoms far away.
  let minX,
    maxX = (minX = selected[0].x),
    minY,
    maxY = (minY = selected[0].y);
  for (let rgroup of selected) {
    minX = Math.min(rgroup.x, minX);
    minY = Math.min(rgroup.y, minY);
    maxX = Math.max(rgroup.x, maxX);
    maxY = Math.max(rgroup.y, maxY);
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

export { calculateAngle, rotate, getCenter };
