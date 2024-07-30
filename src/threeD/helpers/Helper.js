import * as THREE from "three";
import Stats from 'stats.js';
import {SpritCanvas} from './representationalviewer/SpritCanvas';
import {CubeMesh} from "./representationalviewer/CubeMesh";
// import {FaceNormalsHelper} from 'three/examples/jsm/helpers/FaceNormalsHelper.js' // 文档说移除了
import {VertexNormalsHelper} from 'three/examples/jsm/helpers/VertexNormalsHelper';

/**
 * 场景辅助器类
 * 页面添加标签  <div id="Stats-output"></div>
 */
export class Helper {
    constructor(app) {
        this.app = app;
        this.stats = new Stats();
        this.statsDom = null;
        this.stats.setMode(1); // 0: fps, 1: ms
        this.gridHelper = null;
        this.axes = null;
        this.axesMarksList = [];
        this.arrowHelper = null;
        this.boxHelper = null;
        this.box3Helper = null;
        this.cameraHelper = null;
        this.marksGroup = new THREE.Group();
        this.lightHelperList = [];
    }

    /**
     * 性能检测辅助器
     */
    addStats() {
        document.body.appendChild(this.stats.domElement);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = document.body.clientHeight - 50 + 'px';

        const self = this;
        this.app.renderQueue.push(function updateStats() {
            if (self.stats) {
                self.stats.update();
            }
        });
    }

    removeStats() {
        document.body.removeChild(this.stats.domElement);

        const indexDelete = this.app.renderQueue.findIndex(item => item.name === 'updateStats');
        if (indexDelete !== -1) {
            this.app.renderQueue.splice(indexDelete, 1);
        }
    }

    /**
     * 坐标轴辅助器
     */
    addAxes() {
        this.marksGroup.cname = '世界坐标轴';
        this.axes = new THREE.AxesHelper(100);
        this.marksGroup.add(this.axes);

        const makeAxesMarks = (position, axis) => {
            const points = [
                new THREE.Vector3(...(axis === 'x' ? [position, 0, 0] : axis === 'y' ? [0, position, 0] : [0, 0, position])),
                new THREE.Vector3(...(axis === 'x' ? [position, 10, 0] : axis === 'y' ? [10, position, 0] : [0, 10, position]))
            ];
            const material = new THREE.LineBasicMaterial({ color: axis === 'x' ? 0xff0000 : axis === 'y' ? 0x00ff00 : 0x0000ff });
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            this.marksGroup.add(line);
        };

        for (let i = 0; i < 10; i++) {
            ['x', 'y', 'z'].forEach(axis => makeAxesMarks(i * 10, axis));
        }

        const makeString = () => {
            const canvasTexture = new SpritCanvas(this.app);

            ['x', 'y', 'z'].forEach((axis, index) => {
                const position = new THREE.Vector3(...(axis === 'x' ? [100, 0, 0] : axis === 'y' ? [0, 100, 0] : [0, 0, 100]));
                const sprit = canvasTexture.makeSpritCanvas(position, `${axis}-100`);
                this.marksGroup.add(sprit);
            });
        };

        makeString();
        this.app.scene.add(this.marksGroup);
    }

    removeAxes() {
        this.app.scene.remove(this.marksGroup);
    }

    /**
     * 地面网格辅助器
     */
    addGridhelper() {
        const size = 1000;
        const divisions = 10;
        this.gridHelper = new THREE.Group();
        this.gridHelper.cname = '地面网格';
        const geometry = new THREE.PlaneGeometry(1000, 1000, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0.05 });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotateX(Math.PI / 2);
        plane.translateY(-1);

        this.gridHelper.add(new THREE.GridHelper(size, divisions), plane);
        this.app.scene.add(this.gridHelper);
    }

    removeGridhelper() {
        this.app.scene.remove(this.gridHelper);
    }

    /**
     * 箭头辅助器
     */
    addArrowHelper() {
        const arrowDirection = new THREE.Vector3(1, 2, 3).normalize();
        const arrowPoint = new THREE.Vector3(0, 0, 0);
        const arrowLength = 10;
        const arrowColor = 0xffff00;
        this.arrowHelper = new THREE.ArrowHelper(arrowDirection, arrowPoint, arrowLength, arrowColor);
        this.app.scene.add(this.arrowHelper);
    }

    destroyArrowHelper() {
        this.app.scene.remove(this.arrowHelper);
    }

    /**
     * 盒模型辅助器
     */
    addBox3Helper() {
        const box = new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(1, 1, 1), new THREE.Vector3(2, 1, 3));
        this.box3Helper = new THREE.Box3Helper(box, 0xffff00);
        this.app.scene.add(this.box3Helper);
    }

    destroyBox3Helper() {
        this.app.scene.remove(this.box3Helper);
    }

    /**
     * 相机辅助器
     */
    addCameraHelper() {
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.cameraHelper = new THREE.CameraHelper(camera);
        this.app.scene.add(this.cameraHelper);
    }

    destroyCameraHelper() {
        this.app.scene.remove(this.cameraHelper);
    }

    /**
     * 极坐标网格辅助器
     */
    addPolarGridHelper() {
        const helper = new THREE.PolarGridHelper(10, 16, 8, 64);
        this.app.scene.add(helper);
    }

    /**
     * 光源辅助器
     */
    addLightHelper() {
        this.app.scene.children.forEach(item => {
            let helper;
            if (item.type === 'PointLight') {
                helper = new THREE.PointLightHelper(item, 10);
            } else if (item.type === 'DirectionalLight') {
                helper = new THREE.DirectionalLightHelper(item, 5);
            }
            if (helper) {
                this.app.scene.add(helper);
                this.lightHelperList.push(helper);
            }
        });
    }

    removeLightHelper() {
        this.lightHelperList.forEach(item => {
            this.app.scene.remove(item);
        });
        this.lightHelperList = [];
    }

    /**
     * 聚光灯辅助器
     */
    addSpotLightHelper() {
        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(10, 10, 10);
        this.app.scene.add(spotLight);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        this.app.scene.add(spotLightHelper);
    }

    /**
     * 半球光源辅助器
     */
    addHemisphereLightHelper() {
        const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        const helper = new THREE.HemisphereLightHelper(light, 5);
        this.app.scene.add(helper);
    }

    /**
     * 顶点法线辅助器
     */
    addVertexNormalsHelper() {
        const geometry = new THREE.BoxBufferGeometry(10, 10, 10, 2, 2, 2);
        const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const box = new THREE.Mesh(geometry, material);
        const helper = new VertexNormalsHelper(box, 2, 0x00ff00, 1);
        this.app.scene.add(box);
        this.app.scene.add(helper);
    }

    /**
     * 坐标辅助器
     * @param x
     * @param y
     * @param z
     * @param size
     * @param scene
     */
    static addVerticHelper(x, y, z, size, scene) {
        const cube = CubeMesh.makeCubeMesh(x, y, z, size);
        scene.add(cube);
        return cube;
    }

    /**
     * 平面辅助器
     */
    static addPlaneHelper(plane, size, scene) {
        const helper = new THREE.PlaneHelper(plane, size, 0xffff00);
        scene.add(helper);
    }

    /**
     * 线框显示mesh
     */
    static addWireframeGeometry() {
        // https://threejs.org/docs/index.html#api/zh/geometries/WireframeGeometry
    }
}
