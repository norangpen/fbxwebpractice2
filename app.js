import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

let camera, scene, renderer, clock;
let mixer;
const animations = [];
let controls;

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(2, 2, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Optional, but for a smoother control experience
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);

    loadAnimatedModelAndAnimations();
}

function loadAnimatedModelAndAnimations() {
    const loader = new FBXLoader();
    loader.load('models/Remy.fbx', (fbx) => {
        mixer = new THREE.AnimationMixer(fbx);
        scene.add(fbx);

        const animationNames = [
            'idle', 'jump', 'left strafe walking', 'left strafe', 'left turn 90',
            'right strafe walking', 'right strafe', 'right turn 90', 'standard run', 'walking'
        ];

        animationNames.forEach((name) => {
            loader.load(`models/Male Locomotion Pack/${name}.fbx`, (anim) => {
                const action = mixer.clipAction(anim.animations[0]);
                animations.push(action); // Store the action to use later
            });
        });
    });
}

function setupAnimationControls() {
    const buttons = document.querySelectorAll('#animation-controls button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-animation'));
            playAnimation(index);
        });
    });
}

function playAnimation(index) {
    if (index < animations.length) {
        animations.forEach((anim, i) => {
            anim.stop();
            if (i === index) {
                anim.play();
            }
        });
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
});

init();
animate();
setupAnimationControls();

