import * as THREE from "three";
window.THREE = THREE
// import { DragControls } from 'three/addons/controls/DragControls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 创建 Leaflet 地图
const map = L.map('map').setView([31.230001, 121.474000], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);
window.LMap = map
const threeDom = document.getElementById('threejs-canvas')
const renderer = new THREE.WebGLRenderer({
  canvas: threeDom,
  alpha: true,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);


const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x000000);

const aspect = window.innerWidth / window.innerHeight;
let viewSize = 100;  // 初始视图大小
// 创建一个正交相机
const camera = new THREE.OrthographicCamera(
  -viewSize * aspect,  // left
  viewSize * aspect,   // right
  viewSize,            // top
  -viewSize,           // bottom
  1,                   // near
  1000                 // far
);
camera.position.set(0, 0, 50);  // 设置相机位置
camera.lookAt(0, 0, 0);         // 相机看向场景中心



const group = new THREE.Group();
scene.add(group);

// 创建一个二维平面
// const geometry = new THREE.PlaneGeometry(100, 100);  // 2D 平面
const geometry = new THREE.PlaneGeometry(map.getZoom(), map.getZoom());

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const plane = new THREE.Mesh(geometry, material);
plane.userData = { clickable: true };
plane.callback = (e) => {
  console.log(e);
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(group.children);

  if (intersects.length > 0) {
    if (intersects[0].object.userData.clickable) {
      intersects[0].object.callback(intersects[0]);
    }
  }
}

threeDom.addEventListener('click', onMouseClick);
group.add(plane);

// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
group.add(light);

const animate = function () {
  requestAnimationFrame(animate);
  // plane.rotation.z -= 0.01;
  renderer.render(scene, camera);
};
animate();




const controls = new OrbitControls(camera, renderer.domElement);
controls.mouseButtons.LEFT = THREE.MOUSE.PAN; // 将平移功能绑定到鼠标左键
controls.enableDamping = true; // 启用阻尼效果
controls.dampingFactor = 0.1; // 阻尼系数
controls.minDistance = 2; // 设置最小缩放距离
controls.maxDistance = 10; // 设置最大缩放距离



// 监听缩放事件
threeDom.addEventListener('wheel', (event) => {
  // event.preventDefault();
  if (event.deltaY < 0) {
    map.setZoom(map?.getZoom() + 1)
    // group.rotation.z -= 0.01
  } else {
    map.setZoom(map?.getZoom() - 1)
    // 屏幕坐标转经纬度
    // group.rotation.z += 0.01
  }
  const latlng = map.mouseEventToLatLng(event);
  // map.panTo(latlng);
  plane.geometry = new THREE.PlaneGeometry(map.getZoom(), map.getZoom());
});




// // 拖拽变量
// let isDragging = false;
// let previousMousePosition = { x: 0, y: 0 };
// const factor = 0.001

// // 监听鼠标事件
// window.addEventListener('mousedown', (event) => {
//   isDragging = true;
//   previousMousePosition = { x: event.clientX, y: event.clientY };
//   event.preventDefault(); // 防止默认行为
// });

// window.addEventListener('mousemove', (event) => {
//   if (isDragging) {
//     const deltaMove = {
//       x: event.clientX - previousMousePosition.x,
//       y: event.clientY - previousMousePosition.y,
//     };
//     // 更新 Leaflet 地图位置
//     const latLng = map.getCenter();
//     map.panTo([latLng.lat + deltaMove.y * factor, latLng.lng - deltaMove.x * factor]);

//   }
// });

// window.addEventListener('mouseup', (event) => {
//   previousMousePosition = { x: event.clientX, y: event.clientY };
//   isDragging = false;
// });

// https://jsfiddle.net/z2vetpom/
// https://stackoverflow.com/questions/45805193/three-js-layer-for-leaflet
