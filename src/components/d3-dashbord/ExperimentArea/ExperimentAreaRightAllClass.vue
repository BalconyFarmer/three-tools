<template>
    <div id="rightToolClassSub">
        <a @click="clearAll">清空</a>
        <el-divider></el-divider>
        <div>
            <strong class="animation-section animate__flash">自定义着色器</strong>
            <a @click="addCloud">云</a>
            <a @click="addGrass">草坪</a>
            <a @click="bloomOnly">局部泛光</a>
            <a @click="addWater">水纹效果</a>
        </div>
        <el-divider></el-divider>

        <div>
            <strong>环境相关</strong>
            <a @click="addBackgroundImg">背景图片</a>
            <a @click="addBackgroundBox">背景包围盒</a>
        </div>
        <el-divider></el-divider>

        <div>
            <strong>控制相关</strong>
            <a @click="startPersonalControl">开启第一人称</a>
            <a @click="stopPersonalControl">关闭第一人称</a>
            <a @click="startAutoRunCamera">相机自动旋转</a>
        </div>
        <el-divider></el-divider>

        <el-divider></el-divider>


        <div>
            <strong>动态物质</strong>
            <a @click="startAnimatioinEditor">开启动画编辑器</a>
            <a @click="stopAnimationEditor">关闭动画编辑器</a>
            <a @click="addSound">声音</a>
            <a @click="addGUITest">GUI</a>
            <a @click="makePlayVideo">播放视频</a>
            <a @click="addCanvasAnimation">Canvas 动画</a>
        </div>

        <el-divider></el-divider>


        <div>
            <strong>计算相关</strong>
            <a @click="JudgeFace3">JudgeFace3</a>
            <a @click="addMatrix4Practice">Matrix4 练习</a>
            <a @click="addEulerPractice">Euler 练习</a>
            <a @click="addQuaternionPractice">Quaternion 练习</a>
            <a @click="makeBufferGeometryMesh">Buffer Geometry Mesh</a>
        </div>

        <el-divider></el-divider>

        <div>
            <strong>辅助查看器 Helper</strong>
            <a @click="addCameraHelper">相机助手</a>
            <a @click="addPolarGridHelper">极坐标网格助手</a>
            <a @click="addHemisphereLightHelper">半球光助手</a>
            <a @click="addVertexNormalsHelper">顶点法线助手</a>
        </div>
        <el-divider></el-divider>

        <div>
            <strong>其他</strong>
            <a @click="dialogVisible = true">Canvas</a>
            <el-dialog :visible.sync="dialogVisible" height="80%" title="Canvas 绘图" width="90%">
                <Canvas class="canvasComponents"></Canvas>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import * as THREE from "three";
import {serverAdress} from "@/config";
import Canvas from "./Canvas/Canvas";

export default {
    components: {
        Canvas
    },
    data() {
        return {
            dialogVisible: false
        };
    },
    methods: {

        addGUITest() {
            window.app3D.GUI3D.start();
        },
        addCameraHelper() {
            window.app3D.helper.addCameraHelper();
        },
        addPolarGridHelper() {
            window.app3D.helper.addPolarGridHelper();
        },
        addHemisphereLightHelper() {
            window.app3D.helper.addHemisphereLightHelper();
        },
        addVertexNormalsHelper() {
            window.app3D.helper.addVertexNormalsHelper();
        },

        makePlayVideo() {
            window.app3D.playVideo.mamkeMesh();
        },
        addCanvasAnimation() {
            window.app3D.canvasTexture.addMesh();
        },
        addMatrix4Practice() {
            window.app3D.matrix4Practice.start();
        },
        addEulerPractice() {
            window.app3D.eulerPractice.start();
        },
        addQuaternionPractice() {
            window.app3D.quaternionPractice.makeMesh();
        },
        makeBufferGeometryMesh() {
            window.app3D.makeBufferGeometryMesh.start();
        },
        JudgeFace3() {
            window.app3D.JudgeFace3.init();
        },
        addSound() {
            window.app3D.sound.start();
        },
        startAutoRunCamera() {
            window.app3D.controls.startAutoRun();
        },
        startPersonalControl() {
            const position = new THREE.Vector3(0, 0, 0);
            const lookPosition = new THREE.Vector3(100, 100, 100);
            window.app3D.controls.startFirstPersonControls(position, lookPosition);
        },
        stopPersonalControl() {
            window.app3D.controls.stopFirstPersonControls();
        },
        addBackgroundImg() {
            window.app3D.skyBox.addJpgBackground();
        },
        clearAll() {
            window.app3D.sceneManager.clearScene();
        },
        bloomOnly() {
            window.app3D.bloomOnly.bloom();
        },
        addCloud() {
            const clouds = [
                {position: [10, 20, -21], size: 10},
                {position: [0, 37, 6], size: 15}
            ];
            clouds.forEach(cloud => window.app3D.cloud.addCloud(cloud.position, cloud.size));
        },
        addGrass() {
            window.app3D.grass.add();
        },
        addBackgroundBox() {
            window.app3D.skyBox.addSkyBox();
        },
        addWater() {
            window.app3D.waterPlane.add();
        },
        startAnimatioinEditor() {
            this.$parent.$parent.startAnimatioinEditor();
        },
        stopAnimationEditor() {
            this.$parent.$parent.stopAnimationEditor();
        }
    },
    mounted() {
        this.$nextTick(function () {
        });
    }
};
</script>

<style lang="scss">
.canvasComponents {
    width: 100%;
    height: 100%;
}

.el-dialog__body {
    height: 500px !important;
}

#rightToolClassSub {
    display: inline;
    float: left;
    width: 275px;
    height: calc(100vh - 50px);
    border: solid #99a1a9 1px;
    overflow: auto;

    div {
        color: #7dd3ca;
    }

    a {
        color: #1890ff;
        display: block;
    }
}
</style>
