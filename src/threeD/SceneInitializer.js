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

    initLight(intensity = 1) {
        const distance = 500;

        const ambient = new THREE.AmbientLight(0x444444, intensity);
        this.scene.add(ambient);

        const pointLightPositions = [{x: distance, y: 0, z: 0}, {x: -distance, y: 0, z: 0}, {
            x: 0, y: distance, z: 0
        }, {x: 0, y: -distance, z: 0}, {x: 0, y: 0, z: distance}, {x: 0, y: 0, z: -distance}];

        pointLightPositions.forEach((pos, index) => {
            const pointLight = new THREE.PointLight(0xffffff, intensity);
            pointLight.position.set(pos.x, pos.y, pos.z);
            pointLight.cname = `点光源${index}`;
            this.scene.add(pointLight);
        });

        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, intensity);
        directionalLight.position.set(distance, distance, distance);
        directionalLight.cname = '方向光源';
        this.scene.add(directionalLight);
    }

    initRenderer() {
        const {width, height} = this.dom;
        this.renderer = new THREE.WebGLRenderer({canvas: this.dom, antialias: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0.1);
        this.renderer.shadowMap.enabled = true;
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
