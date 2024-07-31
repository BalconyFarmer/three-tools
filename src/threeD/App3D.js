import * as THREE from "three";
import {SceneInitializer} from "./SceneInitializer"; // 导入 SceneInitializer 类
import {RaycasterHelper} from "@/threeD/interaction/RaycasterHelper";
import {ImportObjs} from "@/threeD/loaders/ImportObjs";
import {JudgeFace3} from '@/threeD/basicMath/JudgeFace3';
import {FlowPipe} from '@/threeD/animation/FlowPipe/FlowPipe';
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
import {PlayVideo} from './materials/PlayVideo';
import {TextureCanvasAnimation} from './materials/TextureCanvasAnimation';
import {BasicMaterials} from '@/threeD/materials/BasicMaterials';
import {GUIApp} from './GUI/GUIApp';
import {LittleWindow} from './helpers/representationalviewer/LittleWindow';
import {MultipleElements} from './undefinedNow/MultipleElements';
import {AdvancedMaterial} from './materials/AdvancedMaterial';
import {SkyBox} from './sceneBasic/SkyBox';
import {WaterPlane} from './materials/WaterPlane';
import {BloomOnly} from "./Bloom/BloomOnly";
import {Grass} from "./Grass";
import {Cloud} from "./Cloud";
import {SceneManager} from "@/threeD/SceneManager";

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
        this.controls = new Controls(this);
        this.helper = new Helper(this);
        this.raycasterHelper = new RaycasterHelper(this);
        this.objLoaders = new ImportObjs(this);
        this.JudgeFace3 = new JudgeFace3(this);
        this.flowPipe = new FlowPipe(this);
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
        this.playVideo = new PlayVideo(this);
        this.canvasTexture = new TextureCanvasAnimation(this);
        this.basicMaterials = new BasicMaterials(this);
        this.GUI3D = new GUIApp(this);
        this.littleWindow = new LittleWindow(this);
        this.multipleElements = new MultipleElements(this);
        this.advancedMaterial = new AdvancedMaterial(this);
        this.skyBox = new SkyBox(this);
        this.waterPlane = new WaterPlane(this);
        this.bloomOnly = new BloomOnly(this);
        this.cloud = new Cloud(this);
        this.grass = new Grass(this);
    }

    /**
     * 初始化3D基础场景
     */
    init() {
        const sceneInitializer = new SceneInitializer(this, this.dom);
        sceneInitializer.init();
        this.sceneManager = new SceneManager(this);
        this.initializeComponents();
    }

}
