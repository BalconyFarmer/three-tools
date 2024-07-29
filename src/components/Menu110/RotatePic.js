import * as THREE from "three"; // ES6
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class RotatePic {
    constructor(dom) {
        this.dom = dom;
        this.width = this.dom.width;
        this.height = this.dom.height;
        this.scale = 3; // icon大小系数
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.eventBus = new THREE.EventDispatcher(); // 3D事件中心
        this.renderQueue = [];
        this.init3D()
    }

    init3D() {
        this.initThree();
        // this.startControl();
        this.addAxesHelper();
        this.addPlane();
        this.startAnimation();
    }

    addPlane() {
        const geometry = new THREE.PlaneGeometry(100, 100);
        const textureLoader = new THREE.TextureLoader();

        textureLoader.load(require('./imgs/110 报警.png'), (texture) => {
            const material = new THREE.MeshLambertMaterial({ map: texture });
            this.mesh = new THREE.Mesh(geometry, material);

            this.mesh.translateX(0);
            this.mesh.translateY(0);
            this.mesh.translateZ(0);
            this.mesh.rotation.x = -Math.PI / 2;
            this.scene.add(this.mesh);
        });
    }

    /**
     * 开启鼠标控制
     */
    startControl() {
        this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    }

    /**
     * 添加坐标轴
     */
    addAxesHelper() {
        const axesHelper = new THREE.AxesHelper(150);
        this.scene.add(axesHelper);
    }

    initThree() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 10000);
        this.camera.position.set(500, 254.22151866633237, 500);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer = new THREE.WebGLRenderer({ canvas: this.dom, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = false; // 启用阴影

        // 环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // 方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(300, 400, 200);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        // 点光源
        const pointLight = new THREE.PointLight(0xff0000, 1, 1000);
        pointLight.position.set(50, 50, 50);
        this.scene.add(pointLight);

        // 聚光灯
        const spotLight = new THREE.SpotLight(0x00ff00, 1);
        spotLight.position.set(100, 1000, 100);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
    }

    startAnimation() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
            if (this.mesh) {
                const quaternion = new THREE.Quaternion();
                quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0).normalize(), -0.005);
                this.mesh.position.applyQuaternion(quaternion);
                this.mesh.rotation.z += 0.01;
            }
        };

        animate();
    }
}
