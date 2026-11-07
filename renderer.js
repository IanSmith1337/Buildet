import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {$} from "jquery";

const canvas = document.querySelector(".editor");
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	85,
	window.innerWidth / window.innerHeight,
	0.1,
	5,
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({color: 0xff0000});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const color = 0xffffff;
const intensity = 2;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(2, 2, -2);
scene.add(light);

camera.position.z = 2;
camera.position.x = 2;
camera.position.y = 2;

camera.lookAt(0, 0, 0);

function resizeRenderer(renderer) {
	const canvas = renderer.domElement;
	const pixelRatio = window.devicePixelRatio;
	const width = Math.floor(canvas.clientWidth * pixelRatio);
	const height = Math.floor(canvas.clientHeight * pixelRatio);
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}

function animate(time) {
	if (resizeRenderer(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
