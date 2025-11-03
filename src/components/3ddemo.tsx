import * as THREE from "three";
import {useEffect, useRef} from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let start : number = NaN;
let animationTimer : number = NaN;
const animation_speed : number = 1.5
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x00ff00);
const renderer = new THREE.WebGLRenderer();
const loader = new THREE.TextureLoader();
const raycaster = new THREE.Raycaster();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const three_tracker : Array<THREE.Mesh> = []
const gltf_loader = new GLTFLoader();
// camera.position.set(6.659, -3.78, 5.85);
// camera.rotation.set(-25.29 * (Math.PI / 180), 17.04 * (Math.PI / 180), 7.88 * (Math.PI / 180));
camera.position.set(7.5, -8.846, 5.622);
// camera.rotation.set(19.59 * (Math.PI / 180), 28.44 * (Math.PI / 180), -9.62 * (Math.PI / 180));
camera.rotation.set(19.59 * (Math.PI / 180), 28.44 * (Math.PI / 180), -10 * (Math.PI / 180));
camera.layers.enable(1);

export default function ThreeDemo() {
    const refContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        if (refContainer.current) refContainer.current.appendChild( renderer.domElement );
        scene.add(make_black_plane());
        scene.add(make_dgray_plane());
        scene.add(make_lgray_plane());
        scene.add(make_logo_plane());
        //First pass at loading external models, need to take a look at simplifying
        gltf_loader.load( 'src/assets/nes.gltf', function ( gltf ) {
            three_tracker.push(gltf.scene)
            gltf.scene.position.set(6.641, -4.25, 0.5);
            gltf.scene.rotation.x = (90 * (Math.PI / 180));
            scene.add( gltf.scene );

        }, undefined, function ( error ) {

            console.error( error );

        } );
        scene.add(make_light());
        console.log(scene.children)
        camera.position.z = 5;
        const animate = function (timestamp:number) {
            // Code for quick button animation
            // if (!Number.isNaN(animationTimer)){
            //     animationTimer += (elapsed * animation_speed);
            //     cube.position.y = Math.sin(animationTimer / 318.31) * -1;
            //     console.log("Position Y: " + cube.position.y)
            // }
            // if (animationTimer >= 1000){
            //     console.log("Final position: " + cube.position.y)
            //     animationTimer = NaN
            // }
            // console.log(animationTimer)
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate(Date.now());
        return () => {
            clear_tracker();
        };
    }, []);
    return (
        <div ref={refContainer}></div>

    );
}

addEventListener("wheel", function(event) {
    camera.position.y += event.deltaY * -0.01;
})
// Code for quick button press animation
// document.addEventListener('mousedown', onMouseDown);
//
// function onMouseDown(event : MouseEvent) : void {
//     const coords = new THREE.Vector2(
//         (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
//         -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
//     );
//
//     raycaster.setFromCamera(coords, camera);
//
//     const intersections = raycaster.intersectObjects(scene.children, true);
//     if (intersections.length > 0) {
//         animationTimer = 0;
//         const selectedObject = intersections[0].object;
//         const color = new THREE.Color(Math.random(), Math.random(), Math.random());
//         selectedObject.material.color = color;
//     }
// }

function make_black_plane() : THREE.Mesh {
    const geometry = new THREE.PlaneGeometry( 7.5, 30 );
    const material = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide } );
    const plane = new THREE.Mesh( geometry, material );
    plane.position.x = 11.25
    three_tracker.push(plane);
    return plane;
}

function make_dgray_plane() : THREE.Mesh {
    const geometry = new THREE.PlaneGeometry( 22.5, 7.5 );
    const material = new THREE.MeshBasicMaterial( { color: 0xA9A9A9, side: THREE.DoubleSide } );
    const plane = new THREE.Mesh( geometry, material );
    plane.position.set(-3.75, -11.25, 0);
    three_tracker.push(plane);
    return plane;
}

function make_lgray_plane() : THREE.Mesh {
    const geometry = new THREE.PlaneGeometry( 22.5, 22.5 );
    const material = new THREE.MeshBasicMaterial( { color: 0xE1E1E1, side: THREE.DoubleSide } );
    const plane = new THREE.Mesh( geometry, material );
    plane.position.set( -3.75, 3.75, 0);
    three_tracker.push(plane);
    return plane;
}

function make_logo_plane() : THREE.Mesh {
    const geometry = new THREE.PlaneGeometry( 7, 1.6 );
    const texture = loader.load('src/assets/logo.png', renderer)
    const material = new THREE.MeshPhongMaterial({
        emissive: 0xD61616,
        map: texture,
        transparent: true,
        // alphaTest: 0.5,
        side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh( geometry, material );
    plane.position.set( 3.909, -6.606, 0.1);
    three_tracker.push(plane);
    return plane;
}

function make_light() : THREE.Mesh {
    const light = new THREE.AmbientLight(0xFFFFFF, 1);
    three_tracker.push(light)
    return light
}

function clear_tracker() {
    three_tracker.forEach(track => {scene.remove(track)})
}