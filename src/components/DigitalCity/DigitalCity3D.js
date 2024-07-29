import App3D from "../../threeD/App3D";
import * as THREE from 'three';
import { serverAdress } from '@/config';

export class DigitalCity3D {
    constructor(dom) {
        this.dom = dom;
        this.app3D = null;
    }

    run() {
        this.app3D = new App3D(this.dom);
        this.app3D.init();

        this.resetInit();
        this.addFlowPipe();
        this.addCar();
        this.addGUI();
        this.addFloorGround();

        // this.loadOBJ();
        this.addShadow();

    }

    resetInit() {
        this.app3D.camera.position.set(219, 364, 677);
        const x = -80;
        this.app3D.camera.translateY(x);
        const lookAtPosition = this.app3D.scene.position;
        lookAtPosition.y += x;
        this.app3D.camera.lookAt(lookAtPosition);

        this.app3D.scene.background = new THREE.Color(0xE7E9E4);
        this.app3D.controls.setLimit(-Math.PI / 2, Math.PI / 2, 0, Math.PI / 2, 10, 800);
        this.app3D.controls.startAutoRun(0.2);

        this.app3D.outlineShineEffect.run() // 外轮廓高亮效果
    }

    loadOBJ() {
        const objPaths = [
            '/3Dstatic/model3D/digitalCity/0底座/总成.obj',
            '/3Dstatic/model3D/digitalCity/1路面/总成.obj',
            '/3Dstatic/model3D/digitalCity/2路灯/总成.obj',
            '/3Dstatic/model3D/digitalCity/3楼房/总成.obj',
            '/3Dstatic/model3D/digitalCity/4隧道/总成.obj',
            '/3Dstatic/model3D/digitalCity/5山体/总成.obj',
        ];

        objPaths.forEach((path, index) => {
            this.app3D.objLoaders.loadOBJ(`${serverAdress}${path}`).loadOver((mesh) => {
                mesh.children.forEach(item => {
                    if (index === 0 || index === 1 || index === 5) {
                        item.receiveShadow = true;
                    }
                    if (index === 3) {
                        item.castShadow = true;
                    }
                    if (index === 0) {
                        item.material.shininess = 0.8;
                    }
                    if (index === 5) {
                        item.material.forEach(mat => {
                            mat.shininess = 0;
                        });
                    }
                });
            });
        });
    }

    addFlowPipe() {
        const points = [
            new THREE.Vector3(-109, 93, 28),
            new THREE.Vector3(-48, 95, 42),
            new THREE.Vector3(-35, 96, 106),
            new THREE.Vector3(17, 88, 79)
        ];
        this.app3D.flowPipe.create(points);
    }

    addGUI() {
        this.app3D.GUI3D.makeFixedText(60, 15, '隧道区域', new THREE.Vector3(23, 147, -111), '14px', 1, 15);
        this.app3D.GUI3D.makeFixedText(40, 15, '住宅0', new THREE.Vector3(40, 101, -11), '13px', 1, 13);
        this.app3D.GUI3D.makeVerticalText(40, 15, '住宅1', new THREE.Vector3(70, 98, 77), '13px', 1, 13);

        const sliderMesh = this.app3D.GUI3D.makeFixedSlider();
        sliderMesh.position.set(-53, 120, -66);
        sliderMesh.scale.set(0.3, 0.3, 0.3);

        const checkBoxMesh = this.app3D.GUI3D.makeFixedCheckBOx('hello');
        checkBoxMesh.scale.set(0.05, 0.05, 0.05);
        checkBoxMesh.position.set(-41, 95, 76);
        checkBoxMesh.rotateY(-Math.PI / 2);
        checkBoxMesh.translateY(5);

        const inputBoxMesh = this.app3D.GUI3D.makeFixedInput('请输入');
        inputBoxMesh.scale.set(0.1, 0.1, 0.1);
        inputBoxMesh.position.set(-120, 130, 32);

        const btn = this.app3D.GUI3D.makeVerticalBTN(60, 15, 'First Person', new THREE.Vector3(-142, 97, 106), '10px', 0, 11);
        btn.addEvent(() => {
            const personalControlPosition = new THREE.Vector3(-102, 8, 81);
            const lookPosition = new THREE.Vector3(-42, 15, 73);
            this.app3D.controls.startFirstPersonControls(personalControlPosition, lookPosition);
        });
    }

    addCar() {
        const mesh = `${serverAdress}/3Dstatic/model3D/警车/警车/obj/policeCar.obj`;
        const times = [0, 5, 10];
        const positions = [-164, 87, -0.9, -71, 87, 6.9, -71, 87, 109];

        const rotationTimes = [0, 0.1, 5, 5.5];
        const rotations = [
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0),
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2),
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2),
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0)
        ];

        const rotationPositions = rotations.reduce((acc, q) => acc.concat([q.x, q.y, q.z, q.w]), []);
        this.app3D.animation.start(mesh, times, positions, rotationTimes, rotationPositions);
    }

    addFloorGround() {
        const material = new THREE.MeshBasicMaterial({ color: 0xE7E9E4, dithering: true });
        const plane = new THREE.PlaneGeometry(800, 800);  // 修改此行
        const mesh = new THREE.Mesh(plane, material);
        mesh.position.set(0, 0, 0);
        mesh.rotation.x = -Math.PI * 0.5;

        this.app3D.scene.add(mesh);
    }


    addShadow() {
        this.app3D.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.app3D.renderer.shadowMapEnabled = true;

        const light = new THREE.PointLight(0xE7E9E4, 0.5, 1000, Math.PI / 200);
        light.position.set(200, 300, 200);
        light.castShadow = true;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 2000;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.radius = 1;
        this.app3D.scene.add(light);

        const pointLightHelper = new THREE.PointLightHelper(light, 1);
        this.app3D.scene.add(pointLightHelper);
    }

    destroy() {
        this.app3D.destroy();
        this.app3D = null;
    }
}
