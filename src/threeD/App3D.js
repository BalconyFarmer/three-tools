import * as THREE from "three";

import {SceneCamera} from './sceneBasic/SceneCamera';
import {RaycasterHelper} from "@/threeD/interaction/RaycasterHelper";
import {ImportObjs} from "@/threeD/loaders/ImportObjs";
import {ImportFBX} from '@/threeD/animation/ImportFBX';
import {EventCube} from '@/threeD/interaction/EventCube';
import {JudgeFace3} from '@/threeD/basicMath/JudgeFace3';
import {FlowPipes} from '@/threeD/animation/FlowPipe/FlowPipes';
import {Helper} from '@/threeD/helpers/Helper';
import {Controls} from '@/threeD/sceneBasic/Controls';
import {ExportImport} from '@/threeD/loaders/ExportImport';
import {Car} from '@/threeD/PROJECTS/game/Car';
import {PhysiSimulate} from '@/threeD/PROJECTS/game/PhysiSimulate';
import {MakeBufferGeometryMesh} from './basicMesh/MakeBufferGeometryMesh';
import {MakeBufferGeometryCube} from './basicMesh/MakeBufferGeometryCube';
import {MakeGeometryMesh} from './basicMesh/MakeGeometryMesh';
import {MakeMeshPoint} from './basicMesh/MakeMeshPoint';
import {MakeMeshLine} from './basicMesh/MakeMeshLine';
import {TransformMesh} from './interaction/TransformMesh';
import {TakePoint} from './interaction/TakePoint';
import {Animation} from './animation/Animation';
import {Sound} from './interaction/Sound';
import {ArrowLine} from './helpers/representationalviewer/ArrowLine';
import {Matrix4Practice} from './basicMath/Matrix4Practice';
import {EulerPractice} from './basicMath/EulerPractice';
import {QuaternionPractice} from './basicMath/QuaternionPractice';
import {OutlineShineEffect} from './interaction/OutlineShineEffect';
import {PlayVideo} from './materials/PlayVideo';
import {TextureCanvasAnimation} from './materials/TextureCanvasAnimation';
import {BasicMaterials} from '@/threeD/materials/BasicMaterials';
import {OfflineRender} from './undefinedNow/OfflineRender';
import {GUIApp} from './GUI/GUIApp';
import {ShadowLight} from './undefinedNow/ShadowLight';
import {LittleWindow} from './helpers/representationalviewer/LittleWindow';
import {MultipleElements} from './undefinedNow/MultipleElements';
import {AdvancedMaterial} from './materials/AdvancedMaterial';
import {SkyBox} from './sceneBasic/SkyBox';
import {WaterPlane} from './materials/WaterPlane';
import {LightningStrike} from './LightningStrike';
import {BloomOnly} from "./Bloom/BloomOnly";
import {Grass} from "./Grass";
import {Cloud} from "./Cloud";

export default class App3D {
    constructor(dom) {
        this.dom = dom;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.renderQueue = [];  // 动画队列
        this.eventBus = new THREE.EventDispatcher(); // 3D事件中心
        this.clock = new THREE.Clock();
        this.loopFlag = true;
    }

    initializeComponents() {
        this.raycasterHelper = new RaycasterHelper(this);
        this.objLoaders = new ImportObjs(this);
        this.FBXLoader = new ImportFBX(this);
        this.JudgeFace3 = new JudgeFace3(this);
        this.flowPipes = new FlowPipes(this);
        this.eventCube = new EventCube(this);
        this.helper = new Helper(this);
        this.exportImport = new ExportImport(this);
        this.car = new Car(this);
        this.physiSimulate = new PhysiSimulate(this);
        this.makeBufferGeometryMesh = new MakeBufferGeometryMesh(this);
        this.makeBufferGeometryCube = new MakeBufferGeometryCube(this);
        this.makeGeometryMesh = new MakeGeometryMesh(this);
        this.makeMeshPoint = new MakeMeshPoint(this);
        this.makeMeshLine = new MakeMeshLine(this);
        this.transformMesh = new TransformMesh(this);
        this.takePoint = new TakePoint(this);
        this.animation = new Animation(this);
        this.sound = new Sound(this);
        this.arrowLine = new ArrowLine(this);
        this.matrix4Practice = new Matrix4Practice(this);
        this.eulerPractice = new EulerPractice(this);
        this.quaternionPractice = new QuaternionPractice(this);
        this.outlineShineEffect = new OutlineShineEffect(this);
        this.playVideo = new PlayVideo(this);
        this.canvasTexture = new TextureCanvasAnimation(this);
        this.basicMaterials = new BasicMaterials(this);
        this.GUI3D = new GUIApp(this);
        this.shadowLight = new ShadowLight(this);
        this.littleWindow = new LittleWindow(this);
        this.multipleElements = new MultipleElements(this);
        this.advancedMaterial = new AdvancedMaterial(this);
        this.skyBox = new SkyBox(this);
        this.waterPlane = new WaterPlane(this);
        this.lightningStrike = new LightningStrike(this);
        this.bloomOnly = new BloomOnly(this);
        this.cloud = new Cloud(this);
        this.grass = new Grass(this);
    }

    /**
     * 初始化3D基础场景
     */
    init() {

        this.scene = new THREE.Scene();
        this.scene.autoUpdate = true;
        this.scene.background = new THREE.Color(0x1E1E1E);
        this.sceneCamera = new SceneCamera(this);

        this.initLight(1);
        this.initRenderer();
        this.controls = new Controls(this);
        this.helper = new Helper(this);
        this.startLoop();

        this.initializeComponents();

    }

    addCustomCube() {
        this.makeBufferGeometryCube = new MakeBufferGeometryCube(this);
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

    getMeshByUUIDDispose() {
        if (this.boxHelper) {
            this.scene.remove(this.boxHelper);
        }
    }


    /**
     * 初始化光源
     */
    initLight(intensity) {
        const distance = 500;

        // 环境光
        const ambient = new THREE.AmbientLight(0x444444, intensity);
        this.scene.add(ambient);

        // 点光源位置数组
        const pointLightPositions = [{x: distance, y: 0, z: 0}, {x: -distance, y: 0, z: 0}, {
            x: 0,
            y: distance,
            z: 0
        }, {x: 0, y: -distance, z: 0}, {x: 0, y: 0, z: distance}, {x: 0, y: 0, z: -distance}];

        // 创建并添加点光源
        pointLightPositions.forEach((pos, index) => {
            const pointLight = new THREE.PointLight(0xffffff, intensity);
            pointLight.position.set(pos.x, pos.y, pos.z);
            pointLight.cname = `点光源${index}`;
            this.scene.add(pointLight);
        });

        // 方向光及辅助器
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, intensity);
        directionalLight.position.set(distance, distance, distance);
        directionalLight.cname = '方向光源';
        this.scene.add(directionalLight);
    }


    /**
     * 初始化Renderer
     */
    initRenderer() {
        const {width, height} = this.dom;
        this.renderer = new THREE.WebGLRenderer({canvas: this.dom, antialias: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0.1);
        this.renderer.shadowMap.enabled = true;
    }

    /**
     * loop
     */
    startLoop() {
        const run = () => {
            if (this.loopFlag) {
                requestAnimationFrame(run);
                this.onRender();
                this.renderQueue.forEach(item => item());
                this.eventBus.dispatchEvent({type: 'updateLeftTreeData', message: 'message!'});
            }
        };

        run();
    }

    removeFromQueue(name) {
        this.renderQueue = this.renderQueue.filter(item => item.name !== name);
    }

    /**
     * 更新相机
     */
    onRender() {
        this.renderer.render(this.scene, this.camera); //执行渲染操作
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
}
