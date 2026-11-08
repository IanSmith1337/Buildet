import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {$} from "jquery";

window.$ = $;

var billetWidth = 2;
var billetHeight = 1;
var billetDepth = 2;
var layers = 1;
var firstLayerColor = "#000";
var lastLayerColor = "#000";
var clickNumber = 0;
var startX = 0;
var startY = 0;

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

const billetSideTextureCanvas = document
	.createElement("canvas")
	.getContext("2d");
updateSideTexture(billetSideTextureCanvas, true);
const billetSideTexture = new THREE.CanvasTexture(
	billetSideTextureCanvas.canvas,
);

const billetTopTextureCanvas = document
	.createElement("canvas")
	.getContext("2d");
updateTopTexture(billetTopTextureCanvas, null, true);
const billetTopTexture = new THREE.CanvasTexture(billetTopTextureCanvas.canvas);

const billetBottomTextureCanvas = document
	.createElement("canvas")
	.getContext("2d");
updateBottomTexture(billetBottomTextureCanvas, true);
const billetBottomTexture = new THREE.CanvasTexture(
	billetBottomTextureCanvas.canvas,
);

const billetMats = [
	new THREE.MeshStandardMaterial({
		map: billetSideTexture,
		roughness: 0.33,
		metalness: 0.75,
		side: THREE.DoubleSide,
	}),
	new THREE.MeshStandardMaterial({
		map: billetSideTexture,
		roughness: 0.33,
		metalness: 0.75,
		side: THREE.DoubleSide,
	}),
	new THREE.MeshStandardMaterial({
		map: billetTopTexture,
		roughness: 0.33,
		metalness: 0.75,
		side: THREE.DoubleSide,
	}),
	new THREE.MeshStandardMaterial({
		map: billetBottomTexture,
		roughness: 0.33,
		metalness: 0.75,
		side: THREE.DoubleSide,
	}),
	new THREE.MeshStandardMaterial({
		map: billetSideTexture,
		roughness: 0.33,
		metalness: 0.75,
		side: THREE.DoubleSide,
	}),
	new THREE.MeshStandardMaterial({
		map: billetSideTexture,
		roughness: 0.33,
		metalness: 0.75,
		side: THREE.DoubleSide,
	}),
];

const billetGeo = new THREE.BoxGeometry(billetWidth, billetHeight, billetDepth);
const billet = new THREE.Mesh(billetGeo, billetMats);
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

camera.position.z = 3;
camera.position.x = 3;
camera.position.y = 3;

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

function updateSideTexture(textureCanvas, firstRun = false) {
	textureCanvas.canvas.width = billetWidth * 256;
	textureCanvas.canvas.height = billetHeight * 256;
	var currentPos = 0;
	for (let i = 0; i < layers; i++) {
		textureCanvas.fillStyle = i % 2 ? "#505050" : "#a0a0a0";
		firstLayerColor = textureCanvas.fillStyle;
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

	lastLayerColor = textureCanvas.fillStyle;

	if (!firstRun) {
		billetSideTexture.needsUpdate = true;
	}
}

function updateTopTexture(textureCanvas, depthCanvas, firstRun = false) {
	var width = billetWidth * 256;
	var height = billetHeight * 256;
	textureCanvas.canvas.width = width;
	textureCanvas.canvas.height = height;

	if (depthCanvas != null) {
		const data = depthCanvas.getImageData(0, 0, width, height);
		const pixels = data.data;

		const dark = [80, 80, 80]; // #505050
		const light = [160, 160, 160]; // #a0a0a0

		for (let i = 0; i < pixels.length; i += 4) {
			var currentValue = pixels[i];

			let layerIndex = Math.floor(((255 - currentValue) / 255) * layers);

			if (layerIndex >= layers) {
				layerIndex = layers - 1;
			}

			const pixelColor = layerIndex % 2 === 0 ? light : dark;

			// 4. Overwrite the pixel data in memory with the Damascus colors
			pixels[i] = pixelColor[0]; // Red
			pixels[i + 1] = pixelColor[1]; // Green
			pixels[i + 2] = pixelColor[2]; // Blue
			pixels[i + 3] = 255; // Alpha (fully opaque)
		}

		textureCanvas.putImageData(data, 0, 0);
	} else {
		textureCanvas.fillStyle = firstLayerColor;
		textureCanvas.fillRect(0, 0, width, height);
	}

	if (!firstRun) {
		billetTopTexture.needsUpdate = true;
	}
}

function updateBottomTexture(textureCanvas, firstRun = false) {
	textureCanvas.canvas.width = billetWidth * 256;
	textureCanvas.canvas.height = billetHeight * 256;
	textureCanvas.fillStyle = lastLayerColor;
	textureCanvas.fillRect(
		0,
		0,
		textureCanvas.canvas.width,
		textureCanvas.canvas.height,
	);

	if (!firstRun) {
		billetBottomTexture.needsUpdate = true;
	}
}

window.drawupset = function drawupset(direction, scale) {
	var cx = parseFloat(billet.scale.x);
	var cy = parseFloat(billet.scale.y);
	var cz = parseFloat(billet.scale.z);
	var iso = Math.sqrt(scale);

	console.log(cx, cy, cz);
	if (direction == "x") {
		billet.scale.set(cx / scale, cy * iso, cz * iso);
	} else if (direction == "y") {
		billet.scale.set(cx * iso, cy / scale, cz * iso);
	} else {
		billet.scale.set(cx * iso, cy * iso, cz / scale);
	}
	cx = parseFloat(billet.scale.x);
	var cy = parseFloat(billet.scale.y);
	var cz = parseFloat(billet.scale.z);
	console.log(cx, cy, cz);
};

window.updateBillet = function updateBillet(layerCount) {
	layers = layerCount;
	updateSideTexture(billetSideTextureCanvas);
	updateTopTexture(billetTopTextureCanvas);
	updateBottomTexture(billetBottomTextureCanvas);
};

const depthCanvas = document.createElement("canvas").getContext("2d");
depthCanvas.canvas.width = billetWidth * 256;
depthCanvas.canvas.height = billetHeight * 256;
depthCanvas.fillStyle = "#FFF";
depthCanvas.fillRect(0, 0, depthCanvas.canvas.width, depthCanvas.canvas.height);
depthCanvas.globalCompositeOperation = "multiply";
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function handleDivot(event) {
	renderer.domElement.removeEventListener("click", handleDivot);

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObject(billet);

	if (intersects.length > 0) {
		const uv = intersects[0].uv;
		const canvasX = uv.x * billetTopTextureCanvas.canvas.width;
		const canvasY = (1 - uv.y) * billetTopTextureCanvas.canvas.height;

		var maxRadius =
			billetTopTextureCanvas.canvas.width > billetTopTextureCanvas.canvas.height
				? billetTopTextureCanvas.canvas.width / 2
				: billetTopTextureCanvas.canvas.height / 2;

		var gradient = depthCanvas.createRadialGradient(
			canvasX,
			canvasY,
			0,
			canvasX,
			canvasY,
			maxRadius,
		);

		gradient.addColorStop(0, "#000");
		gradient.addColorStop(1, "#FFF");

		depthCanvas.fillStyle = gradient;
		depthCanvas.fillRect(
			canvasX - maxRadius,
			canvasY - maxRadius,
			maxRadius * 2,
			maxRadius * 2,
		);
	}

	updateTopTexture(billetTopTextureCanvas, depthCanvas, false);
}

window.makeDivot = function makeDivot() {
	renderer.domElement.removeEventListener("click", handleDivot);
	renderer.domElement.addEventListener("click", handleDivot);
};

function handleCut(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);
	const intersects = raycaster.intersectObject(billet);

	if (intersects.length > 0) {
		const uv = intersects[0].uv;
		const canvasX = uv.x * billetTopTextureCanvas.canvas.width;
		const canvasY = (1 - uv.y) * billetTopTextureCanvas.canvas.height;

		if (clickNumber === 0) {
			startX = canvasX;
			startY = canvasY;
			clickNumber = 1;
			console.log("Start point set. Click end point.");
		} else {
			renderer.domElement.removeEventListener("click", handleCut);
			clickNumber = 0;

			const endX = canvasX;
			const endY = canvasY;

			const dx = endX - startX;
			const dy = endY - startY;
			const distance = Math.sqrt(dx * dx + dy * dy);

			var maxRadius =
				(billetTopTextureCanvas.canvas.width >
				billetTopTextureCanvas.canvas.height
					? billetTopTextureCanvas.canvas.width / 2
					: billetTopTextureCanvas.canvas.height / 2) * 0.25;

			depthCanvas.globalCompositeOperation = "darken";

			const steps = distance / 2;
			for (let i = 0; i <= steps; i++) {
				const t = i / steps; // Percentage along the line (0.0 to 1.0)
				const currentX = startX + dx * t;
				const currentY = startY + dy * t;

				var gradient = depthCanvas.createRadialGradient(
					currentX,
					currentY,
					0,
					currentX,
					currentY,
					maxRadius,
				);

				gradient.addColorStop(0, "#000");
				gradient.addColorStop(1, "#FFF");

				depthCanvas.fillStyle = gradient;
				depthCanvas.fillRect(
					currentX - maxRadius,
					currentY - maxRadius,
					maxRadius * 2,
					maxRadius * 2,
				);
			}
		}
	}

	depthCanvas.globalCompositeOperation = "multiply";
	updateTopTexture(billetTopTextureCanvas, depthCanvas, false);
}

window.makeCut = function makeCut() {
	renderer.domElement.removeEventListener("click", handleCut);
	renderer.domElement.addEventListener("click", handleCut);
};

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
