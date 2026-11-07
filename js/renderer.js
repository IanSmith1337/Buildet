import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {$} from "jquery";

var billetWidth = 1;
var billetHeight = 1;
var billetDepth = 1;
var layers = 10;

const canvas = document.querySelector(".editor");
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

const scene = new THREE.Scene();
scene.background = new THREE.Color("#101010");

const camera = new THREE.PerspectiveCamera(
	85,
	window.innerWidth / window.innerHeight,
	0.1,
	50,
);

const controls = new OrbitControls(camera, renderer.domElement);

const billetTextureCanvas = document.createElement("canvas").getContext("2d");
document.body.appendChild(billetTextureCanvas.canvas);
updateTexture(billetTextureCanvas);
const billetTexture = new THREE.CanvasTexture(billetTextureCanvas.canvas);

const billetGeo = new THREE.BoxGeometry(billetWidth, billetHeight, billetDepth);
const billetMat = new THREE.MeshStandardMaterial({
	map: billetTexture,
	roughness: 0.33,
	metalness: 0.75,
});
const billet = new THREE.Mesh(billetGeo, billetMat);
scene.add(billet);

const editorSkyLightColor = "#ffffff";
const editorGroundLightColor = "#000000";
const editorLightIntensity = 2;
const editorLight = new THREE.HemisphereLight(
	editorSkyLightColor,
	editorGroundLightColor,
	editorLightIntensity,
);
scene.add(editorLight);

const cameraLightColor = "#ffffff";
const cameraLightIntensity = 0.25;
const cameraLight = new THREE.DirectionalLight(
	cameraLightColor,
	cameraLightIntensity,
);
cameraLight.position.set(
	camera.position.x,
	camera.position.y,
	camera.position.z,
);
camera.add(cameraLight);
scene.add(camera);

const gridSize = 100;
const gridDivisions = 100;
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

function updateTexture(textureCanvas) {
	textureCanvas.canvas.width = billetWidth * 256;
	textureCanvas.canvas.height = billetHeight * 256;
	var currentPos = 0;
	for (let i = 0; i < layers; i++) {
		textureCanvas.fillStyle = i % 2 ? "#505050" : "#FFF";
		console.log(textureCanvas.fillStyle);
		console.log(currentPos);
		textureCanvas.fillRect(
			0,
			currentPos,
			textureCanvas.canvas.width,
			textureCanvas.canvas.height / layers,
		);
		currentPos = (textureCanvas.canvas.height / layers) * (i + 1);
	}

	textureCanvas.needsUpdate = true;
}

function animate(time) {
	if (resizeRenderer(renderer)) {
		const canvas = renderer.domElement;
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}

	controls.update();
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
