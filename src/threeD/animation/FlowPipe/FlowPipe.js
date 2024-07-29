import * as THREE from 'three';
import { serverAdress } from '@/config';

export class FlowPipe {
    constructor(app) {
        this.app = app;
        this.mesh = null;
        this.texture = null;
        this.redius = 1; // 半径
        this.direction = true;
        this.linePoints = null;
    }

    create(linePoints) {
        this.linePoints = linePoints;

        const CurvePath = new THREE.CurvePath();

        this.linePoints.forEach((item, index) => {
            if (index < this.linePoints.length - 1) {
                const line = new THREE.LineCurve3(item, this.linePoints[index + 1]);
                CurvePath.curves.push(line);
            }
        });

        const geometry = new THREE.TubeGeometry(CurvePath, 100, this.redius, 25, false);

        let textureLoader = new THREE.TextureLoader();
        this.texture = textureLoader.load(serverAdress + '/3Dstatic/model3D/run.png');
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.x = 20;

        let material = new THREE.MeshPhongMaterial({
            map: this.texture, transparent: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.app.scene.add(this.mesh);
        this.mesh.cname = '流动管道';

        // 添加流动效果的动画
        this.app.renderer.setAnimationLoop(() => {
            this.animate();
        });
    }

    animate() {
        if (this.texture) {
            if (this.direction) {
                this.texture.offset.x += 0.01;
            } else {
                this.texture.offset.x -= 0.01;
            }
        }
    }
}
