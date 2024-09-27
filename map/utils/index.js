function latLngFromTileZXY({ z, x, y }) {
  const n = Math.pow(2, z)
  const lonDeg = x / n * 360 - 180
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)))
  const latDeg = latRad * 180 / Math.PI
  return [latDeg, lonDeg]
}
const layerInfos = [
  {
    x: 837750,
    y: 417415,
    z: 20,
    url: 'http://localhost:3000/taskId_22/map/{z}/{x}/{y}.png',
    minZoom: 12,
    maxZoom: 21,
    attribution: '@OSGB DATA'
  },
  {
    x: 108162,
    y: 53377,
    z: 17,
    url: 'http://localhost:3000/taskId_03/map/{z}/{x}/{y}.png',
    minZoom: 12,
    maxZoom: 22,
    attribution: '@OSGB DATA'
  }
]