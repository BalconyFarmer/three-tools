import App3D from "@/threeD/App3D";
import * as THREE from 'three';
import {serverAdress} from '@/config';
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

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
        this.addShadow();
        this.loadOBJ();
    }

    resetInit() {
        this.app3D.camera.position.set(219, 364, 677);
        const x = -80;
        this.app3D.camera.translateY(x);
        const lookAtPosition = this.app3D.scene.position;
        lookAtPosition.y += x;
        this.app3D.camera.lookAt(lookAtPosition);

        this.app3D.controls.setLimit(-Math.PI / 2, Math.PI / 2, 0, Math.PI / 2, 10, 800);
        this.app3D.controls.startAutoRun(0.2);

    }

    loadOBJ() {
        const objPaths = ['/3Dstatic/model3D/digitalCity/0底座/总成.obj', '/3Dstatic/model3D/digitalCity/1路面/总成.obj', '/3Dstatic/model3D/digitalCity/2路灯/总成.obj', '/3Dstatic/model3D/digitalCity/3楼房/总成.obj', '/3Dstatic/model3D/digitalCity/4隧道/总成.obj', '/3Dstatic/model3D/digitalCity/5山体/总成.obj',];

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
        const points = [new THREE.Vector3(-109, 93, 28), new THREE.Vector3(-48, 95, 42), new THREE.Vector3(-35, 96, 106), new THREE.Vector3(17, 88, 79)];
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

        // 加载警车模型
        const loader = new OBJLoader();
        let car;
        const scene = this.app3D.scene;

        loader.load(`${serverAdress}/3Dstatic/model3D/警车/警车/obj/policeCar.obj`, (obj) => {
            car = obj;
            car.position.set(-164, 87, -0.9);
            car.rotation.y = Math.PI / 2; // 设置初始旋转角度为90度
            scene.add(car);

            // GSAP 动画控制
            const timeline = gsap.timeline({repeat: -1, repeatDelay: 1});

            // 小车从第一个点移动到第二个点
            timeline.to(car.position, {x: -71, y: 87, z: 6.9, duration: 2});

            // 小车转弯
            timeline.to(car.rotation, {y: Math.PI / 2, duration: 1});

            // 小车从第二个点移动到第三个点
            timeline.to(car.position, {x: -71, y: 87, z: 109, duration: 2});

            // 返回初始位置和初始旋转
            timeline.to(car.position, {x: -164, y: 87, z: -0.9, duration: 2});
            timeline.to(car.rotation, {y: 0, duration: 1});
        });
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
