import * as THREE from "three";
import { Refractor } from 'three/examples/jsm/objects/Refractor.js';
import { WaterRefractionShader } from 'three/examples/jsm/shaders/WaterRefractionShader.js';
import { serverAdress } from '@/config';

export class WaterPlane {
    constructor(app) {
        this.app = app;
        this.refractor = null;
    }

    add() {
        const refractorGeometry = new THREE.PlaneGeometry(10, 10);

        this.refractor = new Refractor(refractorGeometry, {
            color: 0x999999,
            textureWidth: 1024,
            textureHeight: 1024,
            shader: WaterRefractionShader
        });

        this.app.scene.add(this.refractor);

        // Set the refractor position (optional, adjust as needed)
        this.refractor.position.set(0, 0, 0);

        // Adjust the camera position and look at the refractor
        const camera = this.app.camera;
        camera.position.set(0, 20, 20); // Set the camera position (adjust as needed)
        camera.lookAt(this.refractor.position); // Make the camera look at the refractor

        // load dudv map for distortion effect
        const self = this;

        const dudvMap = new THREE.TextureLoader().load(serverAdress + '/3Dstatic/texture/waterdudv.jpg', function () {
            self.app.renderQueue.push(function () {
                self.refractor.material.uniforms["time"].value += self.app.clock.getDelta();
            });
        });

        dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
        this.refractor.material.uniforms["tDudv"].value = dudvMap;
    }
}
