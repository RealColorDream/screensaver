import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

let angle = 0;
const OrbitRadius = 5;
const OrbitSpeed = 0.006;

let moonAngle = 0; // The initial angle for the moon
const moonOrbitRadius = 1; // The radius of the moon's orbit around the earth
const moonOrbitSpeed = 0.02; // The speed of the moon's orbit


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// CANVAS
const sunCanvas = document.createElement('canvas');
const moonCanvas = document.createElement('canvas');
const earthCanvas = document.createElement('canvas');

sunCanvas.width = 256;
sunCanvas.height = 256;
moonCanvas.width = 256;
moonCanvas.height = 256;
earthCanvas.width = 256;
earthCanvas.height = 256;

const sunContext = sunCanvas.getContext('2d');
const moonContext = moonCanvas.getContext('2d');
const earthContext = earthCanvas.getContext('2d');

const sunGradient = sunContext.createRadialGradient(
    sunCanvas.width / 2,
    sunCanvas.height / 2,
    0,
    sunCanvas.width / 2,
    sunCanvas.height / 2,
    sunCanvas.width / 2
);

const moonGradient = moonContext.createRadialGradient(
    moonCanvas.width / 2,
    moonCanvas.height / 2,
    0,
    moonCanvas.width / 2,
    moonCanvas.height / 2,
    moonCanvas.width / 2
);

const earthGradient = earthContext.createRadialGradient(
    earthCanvas.width / 2,
    earthCanvas.height / 2,
    0,
    earthCanvas.width / 2,
    earthCanvas.height / 2,
    earthCanvas.width / 2
);

sunGradient.addColorStop(0, 'white');
sunGradient.addColorStop(0.5, 'yellow');
sunGradient.addColorStop(0.7, 'orange');
sunGradient.addColorStop(1, 'red');

moonGradient.addColorStop(0, 'white');
moonGradient.addColorStop(1, 'gray');

earthGradient.addColorStop(0, 'blue');
earthGradient.addColorStop(1, 'green');

sunContext.fillStyle = sunGradient;
sunContext.fillRect(0, 0, sunCanvas.width, sunCanvas.height);

moonContext.fillStyle = moonGradient;
moonContext.fillRect(0, 0, moonCanvas.width, moonCanvas.height);

earthContext.fillStyle = earthGradient;
earthContext.fillRect(0, 0, earthCanvas.width, earthCanvas.height);

// CANVAS END

const sunTexture = new THREE.CanvasTexture(sunCanvas);
const moonTexture = new THREE.CanvasTexture(moonCanvas);
const earthTexture = new THREE.CanvasTexture(earthCanvas);

const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
const moonMaterial = new THREE.MeshBasicMaterial({map: moonTexture});
const earthMaterial = new THREE.MeshBasicMaterial({map: earthTexture});

const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const moonGeometry = new THREE.SphereGeometry(0.19, 32, 32);
const earthGeometry = new THREE.SphereGeometry(0.7, 32, 32);


const sun = new THREE.Mesh(sunGeometry, sunMaterial);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(sun);
scene.add(moon);
scene.add(earth);

sun.position.set(0, 0, 0);
moon.position.set(-6, 0, 0);
earth.position.set(-4, 0, 0);
camera.position.set(0, 0, 10);

const controls = new OrbitControls(camera, renderer.domElement);

// Create an ellipse curve for the earth's orbit
const sunOrbitCurve = new THREE.EllipseCurve(
    0, 0,            // ax, aY
    OrbitRadius, OrbitRadius,           // xRadius, yRadius
    0, 2 * Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
);

// Get a set of points that represent the curve
const points = sunOrbitCurve.getPoints(50);

// Create a geometry from the points
const sunOrbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

// Create a material for the line
const sunOrbitMaterial = new THREE.LineBasicMaterial({color: 0xff0000});

// Create a line with the geometry and material, and add it to the scene
const sunOrbitLine = new THREE.Line(sunOrbitGeometry, sunOrbitMaterial);
sunOrbitLine.rotation.x = Math.PI / 2;
scene.add(sunOrbitLine);

// Create an ellipse curve for the moon's orbit
const moonOrbitCurve = new THREE.EllipseCurve(
    0, 0,            // ax, aY
    moonOrbitRadius, moonOrbitRadius,           // xRadius, yRadius
    0, 2 * Math.PI,  // aStartAngle, aEndAngle
    false,            // aClockwise
    0                 // aRotation
);

// Get a set of points that represent the curve
const moonPoints = moonOrbitCurve.getPoints(50);

// Create a geometry from the points
const moonOrbitGeometry = new THREE.BufferGeometry().setFromPoints(moonPoints);

// Create a material for the line
const moonOrbitMaterial = new THREE.LineBasicMaterial({color: 0x0000ff});

// Create a line with the geometry and material, and add it to the scene
const moonOrbitLine = new THREE.Line(moonOrbitGeometry, moonOrbitMaterial);
moonOrbitLine.rotation.x = Math.PI / 2; // Rotate the line 90 degrees around the X axis
scene.add(moonOrbitLine);

earth.add(moonOrbitLine);

function animate() {
    sun.rotation.x += 0.01;
    sun.rotation.y += 0.01;
    moon.rotation.x += 0.01;
    moon.rotation.y += 0.01;
    earth.rotation.y += 0.006;

    angle += OrbitSpeed;
    moonAngle += moonOrbitSpeed;


    // Calculate the new position of the earth
    earth.position.x = Math.cos(angle + Math.PI) * OrbitRadius;
    earth.position.z = Math.sin(angle + Math.PI) * OrbitRadius;

    // Calculate the new position of the moon
    moon.position.x = earth.position.x + Math.cos(moonAngle) * moonOrbitRadius;
    moon.position.z = earth.position.z + Math.sin(moonAngle) * moonOrbitRadius;

    renderer.render(scene, camera);

    window.addEventListener('resize', function() {
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
}