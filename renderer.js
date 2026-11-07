import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({color: 0xff0000});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const color = 0xffffff;
const intensity = 2;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 7);
scene.add(light);

camera.position.z = 5;

function animate(time) {
	cube.rotation.x = time / 2000;
	cube.rotation.y = time / 2000;
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
