import * as THREE from "three";
const ThreeLayer = L.Class.extend({
  // 常量
  vFOV: 60,
  scale: 100, // 米到世界单位

  // 从方法（例如构造函数）设置的变量
  renderer: null,
  leafletDomElement: null, // 可以添加到 Leaflet 地图的 div 元素
  _eventHandlers: {},
  camera: null,
  scene: null,
  _layerAdd: function (e) {
    var map = e.target;

    // check in case layer gets added and then removed before the map is ready
    if (!map.hasLayer(this)) { return; }

    this._map = map;
    this._zoomAnimated = map._zoomAnimated;

    if (this.getEvents) {
      var events = this.getEvents();
      map.on(events, this);
      this.once('remove', function () {
        map.off(events, this);
      }, this);
    }

    this.onAdd(map);
    // this.fire('add');
    this.fire('add');
    map.fire('layeradd', { layer: this });
  },
  fire: function (type, data, propagate) {
    if (!this.listens(type, propagate)) { return this; }

    var event = extend({}, data, {
      type: type,
      target: this,
      sourceTarget: data && data.sourceTarget || this
    });

    if (this._events) {
      var listeners = this._events[type];
      if (listeners) {
        this._firingCount = (this._firingCount + 1) || 1;
        for (var i = 0, len = listeners.length; i < len; i++) {
          var l = listeners[i];
          // off overwrites l.fn, so we need to copy fn to a var
          var fn = l.fn;
          if (l.once) {
            this.off(type, fn, l.ctx);
          }
          fn.call(l.ctx || this, event);
        }

        this._firingCount--;
      }
    }

    if (propagate) {
      // propagate the event to parents (set with addEventParent)
      this._propagateEvent(event);
    }

    return this;
  },
  listens: function (type, fn, context, propagate) {
    if (typeof type !== 'string') {
      console.warn('"string" type argument expected');
    }

    // we don't overwrite the input `fn` value, because we need to use it for propagation
    var _fn = fn;
    if (typeof fn !== 'function') {
      propagate = !!fn;
      _fn = undefined;
      context = undefined;
    }

    var listeners = this._events && this._events[type];
    if (listeners && listeners.length) {
      if (this._listens(type, _fn, context) !== false) {
        return true;
      }
    }

    if (propagate) {
      // also check parents for listeners if event propagates
      for (var id in this._eventParents) {
        if (this._eventParents[id].listens(type, fn, context, propagate)) { return true; }
      }
    }
    return false;
  },

  initialize: function () {
    // this.buildingMaterial = new THREE.MeshLambertMaterial({
    //   color: 0x000000,
    //   shading: THREE.FlatShading,
    //   opacity: 0.8,
    //   overdraw: false,
    //   // transparent: true,
    //   wireframe: false,
    // })
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    })
    // this.renderer.setClearColor(0x000000, 0)
    this.renderer.setClearColor(0xff0000, .2)
    this._el = L.DomUtil.create("div", "leaflet-zoom-hide")
    // this._el.appendChild(this.renderer.domElement);
  },

  // Leaflet 接口方法
  addTo: function (map) {
    map.addLayer(this)
    return this
  },
  onAdd: function (map) {
    var that = this
    this.map = map

    this.map.getPanes().overlayPane.appendChild(this._el)
    this._initScene()
    this._render()
    // }
    this._eventHandlers = {
      map_move: this._handleMove.bind(this),
      map_viewreset: this._handleViewReset.bind(this),
      window_resize: this._handleResize.bind(this),
    }
    this.map.on(
      {
        moveend: this._eventHandlers["map_move"],
        viewreset: this._eventHandlers["map_viewreset"],
      },
      this,
    )
    window.addEventListener(
      "resize",
      this._eventHandlers["window_resize"],
      false,
    )

    this._handleMove()
  },
  // 内部方法
  _initScene: function () {
    var that = this

    this.camera = new THREE.PerspectiveCamera(
      this.vFOV,
      this.map._size.x / this.map._size.y,
      0.1,
      99999 * this.scale,
    )

    this.scene = new THREE.Scene()
    // this.scene.background = new THREE.Color(0x00ff00);
    // this.scene.background.opacity = 0.1;

    // var helper = new THREE.CameraHelper(this.camera)
    // this.scene.add(helper)

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
    })
    // this.renderer.setClearColor(0x000000, 0.5)

    this.leafletDomElement = L.DomUtil.create("div", "leaflet-zoom-hide")
    this.leafletDomElement.appendChild(this.renderer.domElement)
    this.map.getPanes().overlayPane.appendChild(this.leafletDomElement)
    const width = 100 * 10;
    const height = 100 * 10;
    // TODO 移除
    const geometry = new THREE.PlaneGeometry(width, height, 50);
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    })
    this.sphere = new THREE.Mesh(geometry, material)
    this.scene.add(this.sphere)

    var sPos = this._getScenePosition(L.latLng(34.41399077791693, 107.61863708496094))
    this.sphere.position.set(sPos.x, sPos.y, 0)

  },

  _getScenePosition: function (latLng) {
    var max = this.map.project(L.latLng(0, 0), 20)
    var p = this.map.project(latLng, 20)
    return new L.Point(p.x, max.y - p.y)
  },

  _getMapPosition: function (point) {
    return this.map.unproject(point)
  },

  // 事件处理程序
  _handleMove: function (event) {
    // 确保我们的画布首先具有正确的大小（以像素为单位），以便
    // 视口具有正确的边界（例如，map.getBounds()）
    this._handleResize()
    // Leaflet 使用 CSS 转换来移动地图
    // 为了使画布表现得像 position:fixed，我们在画布元素上设置一个转换
    // 方向与 Leaflet 移动相反
    var northWestCorner = this.map.containerPointToLayerPoint([0, 0])
    L.DomUtil.setPosition(this.leafletDomElement, northWestCorner)
    var bounds = this.map.getBounds()
    var sw = this._getScenePosition(bounds.getSouthWest())
    var nw = this._getScenePosition(bounds.getNorthWest())
    var se = this._getScenePosition(bounds.getSouthEast())
    var c = this._getScenePosition(bounds.getCenter())

    var height = Math.abs(sw.y - nw.y) // 这不准确，因为宽度和高度与远平面维度不同
    var width = Math.abs(se.x - sw.x)

    this.camera.aspect = width / height
    this.renderer.setSize(this.map._size.x, this.map._size.y)

    var objsize = Math.max(height, width)
    // var height = vWidth / Math.tan(Math.PI / 180 * alpha);

    // 将相机 fov 度转换为弧度
    var fovRad = this.camera.fov * (Math.PI / 180)
    // 计算相机距离
    // var dist = Math.abs(objsize / Math.sin(fovRad / 2)) * 0.5
    var dist = Math.abs((height * 0.5) / Math.tan(fovRad * 0.5));

    this.camera.position.x = c.x
    this.camera.position.y = c.y
    this.camera.position.z = dist
    this.camera.far = dist
  },
  _handleViewReset: function (event) { },
  _handleResize: function (event) { },
  _render: function () {
    var that = this
    requestAnimationFrame(function () {
      that._render.call(that)
    })
    that.renderer.render(this.scene, this.camera)
  },

  initClickEvent() {
    const that = this
    // 点击事件处理函数
    function onMouseClick(event) {
      // 创建 Raycaster 和鼠标 Vector2，用于检测点击
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      // 将鼠标点击位置转换为标准化设备坐标 (-1 到 +1) 范围
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // 更新射线的方向，基于相机和鼠标位置
      raycaster.setFromCamera(mouse, that.camera);
      // 计算射线与物体的相交点
      const intersects = raycaster.intersectObjects(that.scene.children);
      // 如果点击到了物体
      if (intersects.length > 0) {
        // 取第一个交互的物体，并改变它的颜色
        const intersectedObject = intersects[0].object;
        intersectedObject.material.color.set(Math.random() * 0xffffff);  // 随机颜色
      }
    }
    window.addEventListener('click', onMouseClick, false);
  },
  _initAnimation: function () {
    var that = this
    requestAnimationFrame(that._initAnimation.bind(that))
    that.sphere.rotation.z -= 0.01
    that.renderer.render(this.scene, this.camera)
  }
})

function init() {
  var map = initMap()
  var layer3d = new ThreeLayer()
  layer3d.initClickEvent()
  layer3d.addTo(map)
  layer3d._initAnimation()
}

function initMap() {
  const baseLayer = layerInfos[0]
  let latlng = latLngFromTileZXY(baseLayer)
  let map = L.map('map');
  window['map'] = map
  const zoom = (baseLayer.minZoom + baseLayer.maxZoom) / 2
  map.setView(latlng, zoom);
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map)
  L.tileLayer(baseLayer.url, {
    minZoom: baseLayer.minZoom,
    maxZoom: baseLayer.maxZoom,
    attribution: baseLayer.attribution
  }).addTo(map);
  createMarker(latlng)

  return map
}

init()

