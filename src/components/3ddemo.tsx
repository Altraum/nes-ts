import * as THREE from "three";
import {useEffect, useRef} from "react";

let start : number = NaN;
let animationTimer : number = NaN;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(-5, 5, 12);
camera.layers.enable(1);

export default function ThreeDemo() {
    const refContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        if (refContainer.current) refContainer.current.appendChild( renderer.domElement );
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        console.log(scene.children)
        camera.position.z = 5;
        const animate = function (timestamp:number) {
            if (Number.isNaN(start)) {
                start = timestamp;
            }
            const elapsed = timestamp - start;
            start = timestamp

            if (!Number.isNaN(animationTimer)){
                animationTimer += elapsed
                cube.rotation.x +=  elapsed * 0.01;
                cube.rotation.y += elapsed * 0.01;
            }
            if (animationTimer >= 1000){
                animationTimer = NaN
            }
            // console.log(animationTimer)
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate(Date.now());
    }, []);
    return (
        <div ref={refContainer}></div>

    );
}

document.addEventListener('mousedown', onMouseDown);

function onMouseDown(event : MouseEvent) : void {
    const coords = new THREE.Vector2(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -((event.clientY / renderer.domElement.clientHeight) * 2 - 1),
    );

    raycaster.setFromCamera(coords, camera);

    const intersections = raycaster.intersectObjects(scene.children, true);
    if (intersections.length > 0) {
        animationTimer = 0;
        const selectedObject = intersections[1].object;
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        selectedObject.material.color = color;
        console.log(selectedObject.material.color);
    }
}