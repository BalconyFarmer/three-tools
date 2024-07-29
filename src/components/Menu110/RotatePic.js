import * as THREE from "three"   //ES6
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export class RotatePic {

    constructor(dom) {
        this.dom = dom
        this.width = this.dom.width
        this.height = this.dom.height
        this.scale = 3 // icon大小系数
        this.scene = null
        this.camera = null
        this.renderer = null
        this.eventBus = new THREE.EventDispatcher(); // 3D事件中心
        this.renderQueue = []
    }

    init3D() {
        this.initThree();
        // this.startControl()
        // this.axesHelper()
        this.addPlan()
        this.startAnimation();
    }

    addPlan() {
        const geometry = new THREE.PlaneGeometry(100, 100);
        const self = this
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(require('./110 报警.png'), function (texture) {

            const material = new THREE.MeshLambertMaterial({
                map: texture,
            });
            self.mesh = new THREE.Mesh(geometry, material);

            self.mesh.translateX(0)
            self.mesh.translateY(0)
            self.mesh.translateZ(0)
            self.mesh.rotation.x = -Math.PI / 2;
            self.scene.add(self.mesh)
        })
    }

    /**
     * 开启鼠标控制
     */
    startControl() {
        this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    }

    /**
     * 添加坐标轴
     * @param position
     */
    axesHelper() {
        const axesHelper = new THREE.AxesHelper(150);
        this.scene.add(axesHelper);
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 10000);
        this.camera.position.set(500, 254.22151866633237, 0)
        this.camera.lookAt(this.scene.position)
        this.renderer = new THREE.WebGLRenderer({canvas: this.dom, alpha: true});
        this.renderer.setSize(this.width, this.height);
        const light = new THREE.AmbientLight(0xffffff); // soft white light
        this.scene.add(light);
    }


    startAnimation() {
        const self = this

        function animate() {
            requestAnimationFrame(animate);
            self.renderer.render(self.scene, self.camera);
            if (self.mesh) {
                let quaternion = new THREE.Quaternion();
                quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0).normalize(), -0.005);
                self.mesh.position.applyQuaternion(quaternion);
                self.mesh.rotation.z = self.mesh.rotation.z + 0.01;
            }
        }

        animate();
    }
}
