/**
 * 创建一个标记并添加到地图上
 * @param {L.LatLng} latlng - 标记的经纬度
 * @returns {L.Marker} 返回创建的标记
 */
function createMarker(latlng) {
  return L.marker(latlng).addTo(map);
}

/**
 * 创建一条折线并添加到地图上
 * @param {L.LatLng[]} latlngs - 折线的经纬度数组
 * @returns {L.Polyline} 返回创建的折线
 */
function createPolyline(latlngs) {
  return L.polyline(latlngs).addTo(map);
}

/**
 * 创建一个多边形并添加到地图上
 * @param {L.LatLng[]} latlngs - 多边形的经纬度数组
 * @returns {L.Polygon} 返回创建的多边形
 */
function createPolygon(latlngs) {
  return L.polygon(latlngs).addTo(map);
}

/**
 * 创建一个圆并添加到地图上
 * @param {L.LatLng} latlng - 圆心的经纬度
 * @param {number} radius - 圆的半径（以米为单位）
 * @returns {L.Circle} 返回创建的圆
 */
function createCircle(latlng, radius) {
  return L.circle(latlng, radius).addTo(map);
}

/**
 * 创建一个矩形并添加到地图上
 * @param {L.LatLngBounds} bounds - 矩形的边界
 * @returns {L.Rectangle} 返回创建的矩形
 */
function createRectangle(bounds) {
  return L.rectangle(bounds).addTo(map);
}

/**
 * 创建一个GeoJSON图层并添加到地图上
 * @param {Object} geojson - GeoJSON对象
 * @returns {L.GeoJSON} 返回创建的GeoJSON图层
 */
function createGeoJSON(geojson) {
  return L.geoJSON(geojson).addTo(map);
}

/**
 * 创建一个瓦片图层并添加到地图上
 * @param {string} url - 瓦片图层的URL
 * @param {Object} options - 瓦片图层的选项
 * @returns {L.TileLayer} 返回创建的瓦片图层
 */
function createTileLayer(url, options) {
  return L.tileLayer(url, options).addTo(map);
}

/**
 * 创建一个图像覆盖层并添加到地图上
 * @param {string} url - 图像的URL
 * @param {L.LatLngBounds} bounds - 图像的边界
 * @param {Object} options - 图像覆盖层的选项
 * @returns {L.ImageOverlay} 返回创建的图像覆盖层
 */
function createImageOverlay(url, bounds, options) {
  return L.imageOverlay(url, bounds, options).addTo(map);
}

/**
 * 创建一个视频覆盖层并添加到地图上
 * @param {string[]} urls - 视频的URL数组
 * @param {L.LatLngBounds} bounds - 视频的边界
 * @param {Object} options - 视频覆盖层的选项
 * @returns {L.VideoOverlay} 返回创建的视频覆盖层
 */
function createVideoOverlay(urls, bounds, options) {
  return L.videoOverlay(urls, bounds, options).addTo(map);
}

/**
 * 创建一个图层组并添加到地图上
 * @param {L.Layer[]} layers - 图层数组
 * @returns {L.LayerGroup} 返回创建的图层组
 */
function createLayerGroup(layers) {
  return L.layerGroup(layers).addTo(map);
}

/**
 * 创建一个特征组并添加到地图上
 * @param {L.Layer[]} layers - 图层数组
 * @returns {L.FeatureGroup} 返回创建的特征组
 */
function createFeatureGroup(layers) {
  return L.featureGroup(layers).addTo(map);
}

/**
 * 创建一个div图标
 * @param {Object} options - 图标的选项
 * @returns {L.DivIcon} 返回创建的div图标
 */
function createDivIcon(options) {
  return L.divIcon(options);
}

/**
 * 创建一个图标
 * @param {Object} options - 图标的选项
 * @returns {L.Icon} 返回创建的图标
 */
function createIcon(options) {
  return L.icon(options);
}

/**
 * 创建一个弹出框
 * @param {string} content - 弹出框的内容
 * @param {Object} options - 弹出框的选项
 * @returns {L.Popup} 返回创建的弹出框
 */
function createPopup(content, options) {
  return L.popup(options).setContent(content);
}

/**
 * 创建一个工具提示
 * @param {string} content - 工具提示的内容
 * @param {Object} options - 工具提示的选项
 * @returns {L.Tooltip} 返回创建的工具提示
 */
function createTooltip(content, options) {
  return L.tooltip(options).setContent(content);
}

/**
 * 创建一个经纬度对象
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {L.LatLng} 返回创建的经纬度对象
 */
function createLatLng(lat, lng) {
  return L.latLng(lat, lng);
}

/**
 * 创建一个经纬度边界对象
 * @param {L.LatLng} southWest - 西南角的经纬度
 * @param {L.LatLng} northEast - 东北角的经纬度
 * @returns {L.LatLngBounds} 返回创建的经纬度边界对象
 */
function createLatLngBounds(southWest, northEast) {
  return L.latLngBounds(southWest, northEast);
}
