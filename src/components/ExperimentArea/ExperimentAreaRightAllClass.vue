<template>
    <div id="rightToolClassSub">
        <a @click="clearAll">清空</a>
        <strong>环境相关</strong>
        <a @click="bloomOnly">局部泛光</a>
        <a @click="addCloud">云</a>
        <a @click="addGrass">草坪</a>
        <a @click="addBackgroundImg">背景图片</a>
        <a @click="addBackgroundBox">背景包围盒</a>
        <a @click="startPersonalControl">开启第一人称</a>
        <a @click="stopPersonalControl">关闭第一人称</a>
        <a @click="addShadows">开启阴影</a>
        <a @click="makePhysiSimulate">物理模拟</a>
        <a @click="addOutlineShineEffect">外轮廓高亮效果</a>

        <br><br>
        <strong>事件</strong>
        <a @click="addEventCube">addEventCube</a>

        <br><br>
        <strong>动态物质</strong>
        <a @click="addAnimationTest">动画小车</a>
        <a @click="addSkimmer">加载蛋分</a>
        <a @click="startAnimatioinEditor">开启动画编辑器</a>
        <a @click="stopAnimationEditor">关闭动画编辑器</a>
        <a @click="addFlowPipe">流动管道flowPipe</a>
        <a @click="addFBX">addFBX</a>
        <a @click="startAutoRunCamera">相机自动旋转</a>
        <a @click="addSound">声音</a>
        <a @click="addWater">水纹效果</a>
        <a @click="addAdvancedMaterial">心脏 AdvancedMaterial</a>
        <a @click="addGUITest">GUI</a>
        <a @click="makeMeshPoint">点集显示</a>
        <a @click="makeMeshLine">线集显示</a>
        <a @click="makePlayVideo">makePlayVideo</a>
        <a @click="addCanvasAnimation">addCanvasAnimation</a>

        <br><br>
        <strong>计算相关</strong>
        <a @click="makeCar">碰撞检测</a>
        <a @click="startTestBSP">BSP计算</a>
        <a @click="JudgeFace3">JudgeFace3</a>
        <a @click="addMatrix4Practice">addMatrix4Practice</a>
        <a @click="addEulerPractice">addEulerPractice</a>
        <a @click="addQuaternionPractice">addQuaternionPractice</a>
        <a @click="makeGeometryMesh">makeGeometryMesh</a>
        <a @click="makeBufferGeometryMesh">makeBufferGeometryMesh</a>
        <a @click="addCustomCube">Box</a>

        <br><br>
        <strong>辅助查看器helper</strong>
        <a @click="makeOfflineRender">makeOfflineRender</a>
        <a @click="addCameraHelper">addCameraHelper</a>
        <a @click="addPolarGridHelper">addPolarGridHelper</a>
        <a @click="addHemisphereLightHelper">addHemisphereLightHelper</a>
        <a @click="addFaceNormalsHelper">addFaceNormalsHelper</a>
        <a @click="addVertexNormalsHelper">addVertexNormalsHelper</a>

        <strong>其他</strong>
        <a @click="dialogVisible = true">canvas</a>
        <el-dialog :visible.sync="dialogVisible" height="80%" title="canvas绘图" width="90%">
            <Canvas class="canvasComponents"></Canvas>
        </el-dialog>
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
        addAdvancedMaterial() {
            window.app3D.advancedMaterial.add();
        },
        addFlowPipe() {
            window.app3D.flowPipes.creatPipe();
        },
        addAnimationTest() {
            const mesh = serverAdress + "/3Dstatic/model3D/警车/警车/obj/policeCar.obj";
            const times = [0, 5, 10];
            const positions = [-164, 87, -0.9, -71, 87, 6.9, -71, 87, 109];
            window.app3D.animation.start(mesh, times, positions);
        },
        addSkimmer() {
            const mesh = serverAdress + "/3Dstatic/model3D/蛋分/SimLab_2022-10-20-15-40-52.obj";
            window.app3D.objLoaders.loadOBJ(mesh, "蛋分");
        },
        addGUITest() {
            window.app3D.GUI3D.start();
        },
        addCameraHelper() {
            window.app3D.helper.addCameraHelper();
        },
        startTestBSP() {
            // window.app3D.bSPCalculate.startTestBSP();
        },
        addPolarGridHelper() {
            window.app3D.helper.addPolarGridHelper();
        },
        addHemisphereLightHelper() {
            window.app3D.helper.addHemisphereLightHelper();
        },
        addFaceNormalsHelper() {
            window.app3D.helper.addFaceNormalsHelper();
        },
        addVertexNormalsHelper() {
            window.app3D.helper.addVertexNormalsHelper();
        },
        addEventCube() {
            window.app3D.eventCube.addCube();
        },
        addFBX() {
            window.app3D.FBXLoader.loadFBX(`${serverAdress}/3Dstatic/model3D/SambaDancing.fbx`);
        },
        makeMeshPoint() {
            window.app3D.makeMeshPoint.start();
        },
        makeMeshLine() {
            window.app3D.makeMeshLine.start();
        },
        makePlayVideo() {
            window.app3D.playVideo.mamkeMesh();
        },
        addShadows() {
            window.app3D.shadowLight.init();
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
        addOutlineShineEffect() {
            window.app3D.outlineShineEffect.run();
        },
        makeBufferGeometryMesh() {
            window.app3D.makeBufferGeometryMesh.start();
        },
        makeGeometryMesh() {
            window.app3D.makeGeometryMesh.start();
        },
        makeOfflineRender() {
            window.app3D.offLineRender.start();
        },
        makePhysiSimulate() {
            window.app3D.physiSimulate.init();
        },
        makeCar() {
            window.app3D.car.init();
        },
        JudgeFace3() {
            window.app3D.JudgeFace3.init();
        },
        addSound() {
            window.app3D.sound.start();
        },
        addCustomCube() {
            window.app3D.addCustomCube();
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
