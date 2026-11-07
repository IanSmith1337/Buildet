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
	25,
);

const controls = new OrbitControls(camera, renderer.domElement);

const billetGeo = new THREE.BoxGeometry(1, 1, 1);
const billetMat = new THREE.MeshStandardMaterial({
	color: 0xff0000,
	roughness: 0.33,
	metalness: 0.75,
});
const billet = new THREE.Mesh(billetGeo, billetMat);
scene.add(billet);

const editorSkyLightColor = 0xffffff;
const editorGroundLightColor = 0x000000;
const editorLightIntensity = 2;
const editorLight = new THREE.HemisphereLight(
	editorSkyLightColor,
	editorGroundLightColor,
	editorLightIntensity,
);
scene.add(editorLight);

const cameraLightColor = 0xffffff;
const cameraLightIntensity = 1;
const cameraLight = new THREE.DirectionalLight(
	cameraLightColor,
	cameraLightIntensity,
);
scene.add(cameraLight);

const gridSize = 1000;
const gridDivisions = 1000;
const grid = new THREE.GridHelper(gridSize, gridDivisions);
scene.add(grid);

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
	controls.update();
	cameraLight.position.set(
		-camera.position.x,
		camera.position.y,
		camera.position.z,
	);
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
