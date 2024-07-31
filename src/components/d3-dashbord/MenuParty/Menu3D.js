import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Menu3D {
    constructor(dom) {
        this.dom = dom;
        this.menuData = null;
        this.menus = [];
        this.width = this.dom.width;
        this.height = this.dom.height;
        this.scale = 8; // icon大小系数
        this.animationStatus = true;

        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.eventBus = new THREE.EventDispatcher(); // 3D事件中心
    }

    init3D(menuData) {
        this.menuData = menuData;
        this.initThree();
        this.addPictures();
        this.addMouseEvent();
        this.startAnimation();
        // this.startControl();
        // this.axesHelper();
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(15, this.width / this.height, 0.1, 10000);
        this.camera.position.set(695.18, 254.22, 838.34);
        this.camera.lookAt(this.scene.position);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.dom, alpha: true });
        this.renderer.setSize(this.width, this.height);
    }

    addPictures() {
        this.menuData.forEach((item, index) => {
            const loader = new THREE.TextureLoader();
            loader.load(require(`./imgs/result/${item.assert}`), (tex) => {
                const material = new THREE.SpriteMaterial({ map: tex });
                const sprite = new THREE.Sprite(material);

                sprite.scale.set(298 / this.scale, 467 / this.scale, 1);
                sprite.position.set(200, 0, 0);

                const angle = (2 * Math.PI / this.menuData.length) * index;
                const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
                sprite.position.applyQuaternion(quaternion);

                this.scene.add(sprite);
                this.menus.push(sprite);
                sprite.routerAdress = item.routerAdress;
            });
        });
    }

    addMouseEvent() {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseClick = (event) => {
            mouse.x = (event.offsetX / this.width) * 2 - 1;
            mouse.y = -(event.offsetY / this.height) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);
            if (intersects.length > 0) {
                this.eventBus.dispatchEvent({ type: "jumpRoute", message: intersects[0].object.routerAdress });
            }
        };

        const onMouseMove = (event) => {
            mouse.x = (event.offsetX / this.width) * 2 - 1;
            mouse.y = -(event.offsetY / this.height) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children);
            this.animationStatus = intersects.length === 0;
        };

        this.dom.addEventListener("click", onMouseClick, false);
        this.dom.addEventListener("mousemove", onMouseMove, false);
    }

    startAnimation() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);

            if (this.animationStatus) {
                this.menus.forEach((item) => {
                    const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.005);
                    item.position.applyQuaternion(quaternion);
                });
            }
        };

        animate();
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
    axesHelper() {
        const axesHelper = new THREE.AxesHelper(150);
        this.scene.add(axesHelper);
    }

    addTestCube(position) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(position.x, position.y, position.z);
        this.scene.add(cube);
    }

    destroy() {
        this.dom.removeEventListener("click", this.onMouseClick, false);
        this.dom.removeEventListener("mousemove", this.onMouseMove, false);
    }
}

export { Menu3D };
