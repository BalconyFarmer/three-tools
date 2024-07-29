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
        const run = () => {
            if (this.app.loopFlag) {
                requestAnimationFrame(run);
                this.onRender();
                this.app.renderQueue.forEach(item => item());
                this.app.eventBus.dispatchEvent({type: 'updateLeftTreeData', message: 'message!'});
            }
        };

        run();
    }

    /**
     * 更新相机
     */
    onRender() {
        this.renderer.render(this.scene, this.camera); //执行渲染操作
    }


    init() {
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initRenderer();
        this.startLoop();
        this.app.getMeshByUUIDDispose = this.getMeshByUUIDDispose
        this.app.getSceneChildren = this.getSceneChildren
        this.app.getMeshByUUID = this.getMeshByUUID
        this.app.removeFromQueue = this.removeFromQueue
        this.app.windowRelise = this.windowRelise
        this.app.destroy = this.destroy
    }


    /**
     * 动态调整屏幕大小
     */
    windowRelise() {
        const {innerWidth: width, innerHeight: height} = window;
        this.dom.width = width;
        this.dom.height = height;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    destroy() {
        this.loopFlag = false;
        this.transformMesh.removeEvent();
    }


    removeFromQueue(name) {
        this.renderQueue = this.renderQueue.filter(item => item.name !== name);
    }

    getMeshByUUIDDispose() {
        if (this.boxHelper) {
            this.scene.remove(this.boxHelper);
        }
    }

    getSceneChildren() {
        const result = [];

        const recurrenceScene = (aim, origin) => {
            origin.forEach(item => {
                const data = {
                    title: item.cname || item.type, key: item.uuid, children: item.children.length > 0 ? [] : null
                };
                aim.push(data);
                if (item.children.length > 0) {
                    recurrenceScene(data.children, item.children);
                }
            });
        };

        recurrenceScene(result, this.scene.children);
        return result;
    }

    getMeshByUUID(uuid) {
        const mesh = this.scene.getObjectByProperty('uuid', uuid[0]);
        if (mesh) {
            console.log('根据UUID获取', mesh);
            if (this.boxHelper) {
                this.scene.remove(this.boxHelper);
            }
            this.boxHelper = new THREE.BoxHelper(mesh, 0xffff00);
            this.boxHelper.cname = '选择网格辅助';
            this.scene.add(this.boxHelper);
            return mesh;
        }
    }
}
