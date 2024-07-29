import * as THREE from 'three';
import { serverAdress } from '@/config';

export class FlowPipe {
    constructor(app, linePoints) {
        this.app = app;
        this.mesh = null;
        this.texture = null;
        this.radius = 5; // 半径
        this.direction = true; // 默认流动方向
        this.linePoints = linePoints || [new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 100, 100), new THREE.Vector3(100, 100, 0), new THREE.Vector3(200, 200, 200)];
        this.initTexture();
    }

    initTexture() {
        const textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load(`${serverAdress}/3Dstatic/model3D/run.png`);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.x = 20;
    }

    createTube() {
        const curvePath = new THREE.CurvePath();
        this.linePoints.forEach((point, index) => {
            if (index < this.linePoints.length - 1) {
                const line = new THREE.LineCurve3(point, this.linePoints[index + 1]);
                curvePath.curves.push(line);
            }
        });

        const geometry = new THREE.TubeGeometry(curvePath, 100, this.radius, 25, false);
        const material = new THREE.MeshPhongMaterial({
            map: this.texture,
            transparent: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.cname = '流动管道';
        this.app.scene.add(this.mesh);

        this.app.renderQueue.push(this.updateTextureOffset.bind(this));
    }

    updateTextureOffset() {
        if (this.texture) {
            this.texture.offset.x += this.direction ? 0.01 : -0.01;
        }
    }

    add(data, direction) {
        this.direction = direction;

        const texture = new THREE.TextureLoader().load(require('./run.png'));
        const pointsArray = [data];
        this.createFlowLine(pointsArray, 0.5, texture);

        this.startFlowAnimation(texture, direction);
    }

    createFlowLine(pointsArray, radius, texture) {
        pointsArray.forEach((points) => {
            const curvePoints = points.map((point) => new THREE.Vector3(point[0], point[1], point[2]));
            const curve = new THREE.CatmullRomCurve3(curvePoints, false);
            const geometry = new THREE.TubeGeometry(curve, 1, radius, 300, false);

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(20, 1);

            const material = new THREE.MeshPhongMaterial({
                map: texture,
                transparent: true,
            });

            const tube = new THREE.Mesh(geometry, material);
            this.app.scene.add(tube);
        });
    }

    startFlowAnimation(texture, direction) {
        const animate = () => {
            texture.offset.x += direction ? -0.006 : 0.006;
            requestAnimationFrame(animate);
        };
        animate();
    }
}
