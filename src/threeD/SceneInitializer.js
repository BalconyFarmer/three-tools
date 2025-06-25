import * as THREE from "three";

export class SceneInitializer {
    constructor(app, dom) {
        this.app = app;
        this.dom = dom;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.autoUpdate = true;
        this.scene.background = new THREE.Color(0x1E1E1E);
        this.app.scene = this.scene;
    }

    initCamera() {
        const {width, height} = this.dom;
        const aspectRatio = width / height;
        this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 10000);
        this.camera.position.set(300, 300, 300);
        this.camera.lookAt(this.scene.position);
        this.app.camera = this.camera;
    }

    initLight(intensity = 0.5) {
        const distance = 100;

        const ambient = new THREE.AmbientLight(0xFFFFFF, intensity);
        this.scene.add(ambient);

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(distance, distance, distance);
        directionalLight.cname = '方向光源';
        this.scene.add(directionalLight);

        directionalLight.castShadow = true;

        // 设置方向光的阴影属性
        directionalLight.shadow.mapSize.width = 2048;  // 阴影分辨率
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;  // 阴影相机的近截面
        directionalLight.shadow.camera.far = 500;  // 阴影相机的远截面
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;

        // 创建灰色地面
        const planeGeometry = new THREE.PlaneGeometry(200, 200);
        const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;  // 使平面水平放置
        plane.position.y = 1;  // 调整地面位置
        this.scene.add(plane);
    }



    initRenderer() {
        const {width, height} = this.dom;
        this.renderer = new THREE.WebGLRenderer({canvas: this.dom, antialias: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0.1);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.app.renderer = this.renderer;

    }

    startLoop() {
        const onRender = () => {
            this.renderer.render(this.scene, this.camera); //执行渲染操作
        }

        const run = () => {
            requestAnimationFrame(run);
            onRender();
        };

        run();
    }


    init() {
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initRenderer();
        this.startLoop();


    }
}
