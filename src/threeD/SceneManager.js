import * as THREE from "three";

export class SceneManager {
    constructor(app) {
        this.app = app;
        this.scene = app.scene;
        this.renderer = app.renderer;
        this.camera = app.camera;
        this.dom = app.dom;

        // 绑定方法
        this.app.getMeshByUUIDDispose = this.getMeshByUUIDDispose.bind(this);
        this.app.getSceneChildren = this.getSceneChildren.bind(this);
        this.app.getMeshByUUID = this.getMeshByUUID.bind(this);
        this.app.removeFromQueue = this.removeFromQueue.bind(this);
        this.app.windowRelise = this.windowRelise.bind(this);
        this.app.destroy = this.destroy.bind(this);
    }

    getSceneChildren() {
        const result = [];

        const recurrenceScene = (aim, origin) => {
            origin.forEach(item => {
                const data = {
                    title: item.cname || item.type,
                    key: item.uuid,
                    children: item.children.length > 0 ? [] : null
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

    removeFromQueue(name) {
        this.app.renderQueue = this.app.renderQueue.filter(item => item.name !== name);
    }

    /**
     * 动态调整屏幕大小
     */
    windowRelise() {
        const { innerWidth: width, innerHeight: height } = window;
        this.dom.width = width;
        this.dom.height = height;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    destroy() {
        this.app.loopFlag = false;
        if (this.app.transformMesh) {
            this.app.transformMesh.removeEvent();
        }
    }
}
