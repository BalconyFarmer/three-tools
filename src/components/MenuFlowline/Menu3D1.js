import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FlowPipe } from "./parts/FlowPipe";

export class Menu3D1 {
    constructor(dom) {
        this.dom = dom;
        this.menuData = null;
        this.menus = [];
        this.width = this.dom.width;
        this.height = this.dom.height;
        this.scale = 3; // icon大小系数
        this.animationStatus = true;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.currentIndex = 1;
        this.eventBus = new THREE.EventDispatcher(); // 3D事件中心
        this.renderQueue = [];
    }

    init3D(menuData) {
        this.menuData = menuData;
        this.initThree();
        this.addPictures();
        this.addMouseEvent();
        this.startAnimation();
        // this.startControl();
        // this.addAxesHelper();
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 10000);
        this.camera.position.set(500, 254.22151866633237, 0);
        this.camera.lookAt(this.scene.position);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.dom, alpha: true });
        this.renderer.setSize(this.width, this.height);

        const ambientLight = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambientLight);
    }

    addPictures() {
        this.menuData.forEach((item, index) => {
            const loader = new THREE.TextureLoader();
            loader.load(require(`./imgs/result/${item.assert}`), (tex) => {
                const material = new THREE.SpriteMaterial({ map: tex });
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(161 / this.scale, 188 / this.scale, 1);
                sprite.position.set(200, 0, 0);

                const angle = (2 * Math.PI / this.menuData.length) * index;
                const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
                sprite.position.applyQuaternion(quaternion);

                this.scene.add(sprite);
                this.menus.push(sprite);
                sprite.routerAdress = item.routerAdress;

                const direction = index % 2 === 0;
                this.addFlowLine([[0, 0, 0], [sprite.position.x, sprite.position.y, sprite.position.z]], direction);
            });
        });
    }

    addFlowLine(data, direction) {
        const flowPipes = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 190)];
        const flowPipe = new FlowPipe(this, flowPipes);
        flowPipe.add(data, direction);
    }

    addMouseEvent() {
        this.dom.addEventListener("click", this.onMouseClick.bind(this), false);
        this.dom.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    }

    onMouseClick(event) {
        const { mouse, raycaster, intersects } = this.getRaycasterData(event);
        if (intersects.length > 0) {
            this.eventBus.dispatchEvent({ type: "jumpRoute", message: intersects[0].object.routerAdress });
        }
    }

    onMouseMove(event) {
        const { mouse, raycaster, intersects } = this.getRaycasterData(event);
        this.animationStatus = intersects.length === 0;
    }

    getRaycasterData(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        mouse.x = (event.offsetX / this.width) * 2 - 1;
        mouse.y = -(event.offsetY / this.height) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects(this.scene.children);
        return { mouse, raycaster, intersects };
    }

    startAnimation() {
        THREE.Object3D.prototype.rotateAroundWorldAxis = (function () {
            const q = new THREE.Quaternion();
            return function (point, axis, angle) {
                q.setFromAxisAngle(axis, angle);
                this.applyQuaternion(q);
                this.position.sub(point);
                this.position.applyQuaternion(q);
                this.position.add(point);
                return this;
            };
        })();

        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
            this.renderQueue.forEach((item) => item());
        };

        animate();
    }

    /**
     * 开启鼠标控制
     */
    startControl() {
        this.controller = new OrbitControls(this.camera, this.renderer.domElement);
        this.controller.autoRotate = true;
    }

    /**
     * 添加坐标轴
     */
    addAxesHelper() {
        const axesHelper = new THREE.AxesHelper(150);
        this.scene.add(axesHelper);
    }

    moveTo(index) {
        if (index) {
            let delta = index - this.currentIndex;
            if (Math.abs(delta) >= 4) {
                delta = delta > 0 ? -(8 - Math.abs(delta)) : 8 - Math.abs(delta);
            }

            const aim = (2 * Math.PI / 8) * delta;
            let i = 0;

            const animateMove = () => {
                requestAnimationFrame(animateMove);
                if (i < 50) {
                    this.camera.rotateAroundWorldAxis(new THREE.Vector3(), new THREE.Vector3(0, 1, 0), aim / 50);
                    i++;
                    this.renderer.render(this.scene, this.camera);
                }
            };

            animateMove();
            this.currentIndex = index;
        }
    }

    destroy() {
        this.dom.removeEventListener("click", this.onMouseClick.bind(this), false);
        this.dom.removeEventListener("mousemove", this.onMouseMove.bind(this), false);
    }
}
