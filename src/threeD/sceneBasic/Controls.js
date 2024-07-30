import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "./FirstPersonControls";

export class Controls {
    constructor(app) {
        this.app = app;
        this.controller = new OrbitControls(this.app.camera, this.app.renderer.domElement);
        this.firstPersonControls = null;
        this.renderQueueFunction = null; // To store the reference to the renderQueue function
    }

    /**
     * 开启自动旋转
     * @param speed
     */
    startAutoRun(speed) {
        this.controller.autoRotate = true; // 开启自动旋转
        this.controller.autoRotateSpeed = speed || 10; // 移动速度

        const self = this;
        this.renderQueueFunction = function updateAutoRun() {
            self.controller.update(self.app.clock.getDelta()); // 更新时间
        };

        // 在 requestAnimationFrame 循环中调用 updateAutoRun
        function render() {
            self.renderQueueFunction(); // 调用 updateAutoRun
            // 其他渲染逻辑
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);
    }


    /**
     * 停止自动旋转
     */
    stopAutoRun() {
        this.controller.autoRotate = false;
        const index = this.app.renderQueue.indexOf(this.renderQueueFunction);
        if (index > -1) {
            this.app.renderQueue.splice(index, 1); // Remove the function from the queue
        }
        this.renderQueueFunction = null;
    }

    /**
     * 旋转限度
     * @param minAzimuthAngle
     * @param maxAzimuthAngle
     * @param minPolarAngle
     * @param maxPolarAngle
     * @param minDistance
     * @param maxDistance
     */
    setLimit(minAzimuthAngle, maxAzimuthAngle, minPolarAngle, maxPolarAngle, minDistance, maxDistance) {
        this.controller.minAzimuthAngle = minAzimuthAngle || 0;
        this.controller.maxAzimuthAngle = maxAzimuthAngle || Math.PI / 2;
        this.controller.minPolarAngle = minPolarAngle || 0;
        this.controller.maxPolarAngle = maxPolarAngle || Math.PI / 2;
        this.controller.minDistance = minDistance || 10;
        this.controller.maxDistance = maxDistance || 100;
    }

    /**
     * 启动轨道相机控制器
     */
    startOrbitControls() {
        this.controller.enabled = true;
        this.stopFirstPersonControls();
        this.controller.reset();
    }

    stopOrbitControls() {
        this.controller.enabled = false;
        this.controller.saveState();
    }

    /**
     * 启动第一人称相机控制器
     * @param personalControlPosition
     * @param lookPosition
     */
    startFirstPersonControls(personalControlPosition, lookPosition) {
        this.stopOrbitControls();
        this.stopAutoRun();
        this.firstPersonControls = new FirstPersonControls(this.app, personalControlPosition, lookPosition);
    }

    /**
     * 停止第一人称相机控制器
     */
    stopFirstPersonControls() {
        if (this.firstPersonControls) {
            this.firstPersonControls.destroy();
            this.firstPersonControls = null;
        }
    }

    /**
     * 移除所有监听事件
     */
    disposeOrbitControlsEvent() {
        this.controller.dispose();
    }
}

