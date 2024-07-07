import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();

const camera = createCamera();

const renderer = new THREE.WebGLRenderer({ alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
const sunLight = createSunLight();
const floor = createFloor();
const sphere = createSphere();

let rotationSpeed = 0.001;

const gui = new dat.GUI();
const guiOptions = {
    sphereColor: '#ffea00',
    rotationSpeed: 0.001
};
gui.addColor(guiOptions, 'sphereColor').onChange((color) => sphere.material.color.set(color));
gui.add(guiOptions, 'rotationSpeed').onChange((newRotationSpeed) => rotationSpeed = newRotationSpeed);

scene.add(
    new THREE.AmbientLight(0xffffff, 0.8),
    new THREE.AxesHelper(5),
    new THREE.GridHelper(5),
    sunLight,
    floor,
    sphere
);

let car = null;
const loader = new GLTFLoader();
loader.load('/static/porsche/scene.glb', 
    (carModel) => {
	    scene.add(carModel.scene);
        car = carModel.scene;
        animate();
    }, 
    undefined, 
    (error) => {
	    console.error(error);
    }
);

document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);

function createCamera() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    camera.position.set(0, 2, 9);
    return camera;
}

function createSphere() {
    var sphereGeometry = new THREE.SphereGeometry(0.3, 10, 10);
    var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 0.2;
    sphere.position.y = 1.5;
    sphere.position.z = 1.5;
    return sphere;
}

function createFloor() {
    var planeGeometry = new THREE.PlaneGeometry(30, 30);
    var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x314176, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    return plane;
}

function createSunLight() {
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(15, 10, 10);
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    return sunLight;
}

function animate() {
    if (car)
        car.rotation.y += rotationSpeed;
    controls.update();
    renderer.render(scene, camera);
}

