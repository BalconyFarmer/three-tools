import * as THREE from "three";

export class SceneCamera {
    constructor(app) {
        this.app = app;
        this.camera = null;
        this.init();
    }

    // 初始化相机
    init() {
        const { width, height } = this.app.dom;
        const aspectRatio = width / height;

        // 创建透视相机
        this.camera = new THREE.PerspectiveCamera(30, aspectRatio, 1, 10000);

        // 设置相机初始位置和方向
        this.setPositionAndLookAt(new THREE.Vector3(300, 300, 300), this.app.scene.position);

        // 将相机添加到应用中
        this.app.camera = this.camera;
    }

    // 设置相机位置和方向
    setPositionAndLookAt(position, target) {
        this.camera.position.copy(position);
        this.camera.lookAt(target);
    }

    // 俯视图
    cameraLookBottom() {
        this.setPositionAndLookAt(new THREE.Vector3(0, 1000, 0), this.app.scene.position);
    }

    // 左视图
    cameraLookRight() {
        this.setPositionAndLookAt(new THREE.Vector3(-1000, 0, 0), this.app.scene.position);
    }
}
