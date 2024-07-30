import * as THREE from "three";

export class MakeMeshLine {
    constructor(app) {
        this.app = app;
    }

    start() {
        this.makeGeometry();
    }

    makeGeometry() {
        class CustomSinCurve extends THREE.Curve {
            constructor(scale = 1) {
                super();
                this.scale = scale;
            }

            getPoint(t) {
                const tx = t * 3 - 1.5;
                const ty = Math.sin(2 * Math.PI * t);
                const tz = 0;

                return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
            }
        }

        const path = new CustomSinCurve(10);
        const tubeGeometry = new THREE.TubeGeometry(path, 20, 2, 8, false);

        // Extract the vertices from TubeGeometry and create a BufferGeometry for Line
        const positions = [];
        const vertices = tubeGeometry.attributes.position.array;

        for (let i = 0; i < vertices.length; i += 3) {
            positions.push(vertices[i], vertices[i + 1], vertices[i + 2]);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.LineBasicMaterial({
            color: 0xff0000 // 线条颜色
        });

        const line = new THREE.Line(geometry, material);
        this.app.scene.add(line);
    }
}
