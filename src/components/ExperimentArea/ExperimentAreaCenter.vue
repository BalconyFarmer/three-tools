<template>
    <div id="centerContainer">
        <div id="centerTool">
            <div id="toolList">
                <span :class="axesFlag ? 'backDiv' : ''">
                    <img :src="axesSvg" class="icon0" @click="axesToggle" />
                </span>
                <span :class="statsFlag ? 'backDiv' : ''">
                    <img :src="statsSvg" class="icon1" style="width: 20px" @click="statsToggle" />
                </span>
                <span :class="grideLineFlag ? 'backDiv' : ''">
                    <img :src="grideLineSvg" class="icon1" @click="startGrideLine" />
                </span>
                <span :class="cameraLookRightFlag ? 'backDiv' : ''">
                    <img :src="leftSee" class="icon1" style="width: 15px" @click="cameraLookRight" />
                </span>
                <span :class="transformFlag ? 'backDiv' : ''">
                    <img :src="transformMesh" class="icon1" style="width: 15px" @click="startTransform" />
                </span>
                <span :class="startLightHelperFlag ? 'backDiv' : ''">
                    <img :src="lightIcon" class="icon1" style="width: 15px" @click="startLightHelper" />
                </span>
                <span :class="startTakePointFlag ? 'backDiv' : ''">
                    <img :src="takePointIcon" class="icon1" style="width: 15px" @click="startTakePoint" />
                </span>

                <a-switch default-checked:false size="small" @change="casterMeshChange" />
            </div>
        </div>

        <div id="file">
            <a-dropdown>
                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                    文件管理
                    <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                    <a-menu-item>保存</a-menu-item>
                    <a-menu-item>新建场景</a-menu-item>
                    <a-menu-item @click="exportScene">导出场景</a-menu-item>
                    <a-menu-item @click="importScene">导入场景</a-menu-item>
                    <a-menu-item>新建Mesh</a-menu-item>
                    <a-menu-item @click="exportMesh">导出Mesh</a-menu-item>
                    <a-menu-item @click="importMesh">导入Mesh</a-menu-item>
                    <a-menu-item>下载</a-menu-item>
                    <a-menu-item>另存为</a-menu-item>
                </a-menu>
            </a-dropdown>
        </div>

        <div id="drawTools">
            <img :src="icon5" class="icon5" style="width: 20px" @click="" />
            <img :src="icon0" class="icon5" style="width: 20px" @click="" />
            <img :src="icon1" class="icon5" style="width: 20px" @click="" />
            <img :src="icon2" class="icon5" style="width: 20px" @click="" />
            <img :src="icon3" class="icon5" style="width: 20px" @click="" />
            <img :src="icon4" class="icon5" style="width: 20px" @click="" />
            <img :src="icon6" class="icon5" style="width: 20px" @click="" />
            <img :src="icon7" class="icon5" style="width: 20px" @click="" />
            <img :src="icon8" class="icon5" style="width: 20px" @click="" />
            <img :src="icon9" class="icon5" style="width: 20px" @click="" />
            <img :src="icon10" class="icon5" style="width: 20px" @click="" />
            <img :src="icon11" class="icon5" style="width: 20px" @click="" />
        </div>
    </div>
</template>

<script>
import axesSvg from '@/assets/axes.svg';
import statsSvg from '@/assets/stats.svg';
import grideLineSvg from '@/assets/网格.svg';
import bottomSee from '@/assets/俯视图.svg';
import leftSee from '@/assets/左视图.svg';
import transformMesh from '@/assets/移动.svg';
import lightIcon from '@/assets/灯.svg';
import takePointIcon from '@/assets/拾取点.svg';

import icon0 from '@/assets/leftTools/布尔运算.svg';
import icon1 from '@/assets/leftTools/尺子-测量.svg';
import icon2 from '@/assets/leftTools/脚印.svg';
import icon3 from '@/assets/leftTools/拉伸.svg';
import icon4 from '@/assets/leftTools/铅笔.svg';
import icon5 from '@/assets/leftTools/拾取.svg';
import icon6 from '@/assets/leftTools/橡皮.svg';
import icon7 from '@/assets/leftTools/旋转.svg';
import icon8 from '@/assets/leftTools/移动.svg';
import icon9 from '@/assets/leftTools/油漆桶.svg';
import icon10 from '@/assets/leftTools/圆形.svg';
import icon11 from '@/assets/leftTools/正方形.svg';

import { readScene, saveScene } from '@/api/api/';
import * as THREE from 'three';
import { serverAdress } from '@/config';

const FileSaver = require('file-saver');

export default {
    props: {
        app3D: Object,
        required: true
    },
    data() {
        return {
            axesSvg,
            statsSvg,
            grideLineSvg,
            bottomSee,
            leftSee,
            transformMesh,
            lightIcon,
            takePointIcon,

            icon0,
            icon1,
            icon2,
            icon3,
            icon4,
            icon5,
            icon6,
            icon7,
            icon8,
            icon9,
            icon10,
            icon11,

            axesFlag: false,
            statsFlag: false,
            grideLineFlag: false,
            transformFlag: false,
            cameraLookBottomFlag: false,
            cameraLookRightFlag: false,
            startLightHelperFlag: false,
            startTakePointFlag: false
        };
    },
    methods: {
        axesToggle() {
            if (this.axesFlag) {
                if (window.app3D.helper) {
                    window.app3D.helper.removeAxes();
                }
                this.axesFlag = false;
            } else {
                if (window.app3D.helper) {
                    window.app3D.helper.addAxes();
                }
                this.axesFlag = true;
            }
        },
        statsToggle() {
            if (this.statsFlag) {
                window.app3D.helper.removeStats();
                this.statsFlag = false;
            } else {
                window.app3D.helper.addStats();
                this.statsFlag = true;
            }
        },
        startGrideLine() {
            if (this.grideLineFlag) {
                window.app3D.helper.removeGridhelper();
                this.grideLineFlag = false;
            } else {
                window.app3D.helper.addGridhelper();
                this.grideLineFlag = true;
            }
        },
        startTransform() {
            if (this.transformFlag) {
                window.app3D.transformMesh.removeEvent();
                this.transformFlag = false;
            } else {
                window.app3D.transformMesh.addEvent();
                this.transformFlag = true;
            }
        },
        cameraLookRight() {
            window.app3D.sceneCamera.cameraLookRight();
        },
        startLightHelper() {
            if (this.startLightHelperFlag) {
                window.app3D.helper.removeLightHelper();
                this.startLightHelperFlag = false;
            } else {
                window.app3D.helper.addLightHelper();
                this.startLightHelperFlag = true;
            }
        },
        startTakePoint() {
            if (this.startTakePointFlag) {
                window.app3D.takePoint.stop();
                this.startTakePointFlag = false;
            } else {
                window.app3D.takePoint.start();
                this.startTakePointFlag = true;
            }
        },
        exportMesh() {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            // window.app3D.scene.add(cube);

            const data = cube.toJSON();
            const content = JSON.stringify(data);

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            FileSaver.saveAs(blob, 'Mesh.json');
        },
        importMesh() {
            var loader = new THREE.ObjectLoader();
            const self = this;

            loader.load(
                // 资源的URL
                `${serverAdress}/3Dstatic/JsonExportImport/helloworld.json`,

                // onLoad回调
                // Here the loaded data is assumed to be an object
                function (obj) {
                    // Add the loaded object to the scene
                    window.app3D.scene.add(obj);
                },

                // onProgress回调
                function (xhr) {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                },

                // onError回调
                function (err) {
                    console.error('An error happened');
                }
            );
        },
        casterMeshChange(event) {
            if (event) {
                this.$parent.startLittleWindow();
            } else {
                this.$parent.stopLittleWindow();
            }
        },
        exportScene() {
            const scene = window.app3D.scene;
            const data = scene.toJSON();
            const content = JSON.stringify(data);
            // const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            // FileSaver.saveAs(blob, "Scene.json");

            saveScene(content);
        },
        importScene() {
            const self = this;

            readScene().then(function (response) {
                var loader = new THREE.ObjectLoader();
                const reg = './static/';
                const url = response.data.replace(reg, serverAdress + '/');

                loader.load(
                    // 资源的URL
                    url,
                    // onLoad回调
                    // Here the loaded data is assumed to be an object
                    function (obj) {
                        // Add the loaded object to the scene
                        window.app3D.scene = obj;
                    },

                    // onProgress回调
                    function (xhr) {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                    },

                    // onError回调
                    function (err) {
                        console.error('An error happened');
                    }
                );
            });
        }
    },
    mounted() {
        this.$nextTick(function () {
            this.axesToggle();
            this.startGrideLine();
        });
    }
};
</script>

<style lang="scss">
#centerContainer {
    #centerTool {
        position: absolute;
        width: 300px;
        height: auto;
        top: 60px;
        left: calc(100vw / 2 - 150px);
        border: solid #99a1a9 1px;

        span {
            margin: 5px;
        }

        #toolList {
            background-color: #001529;
            display: inline;

            .backDiv {
                background-color: #1890ff;
            }

            img {
                width: 20px;
                height: 20px;
                //filter: brightness(10%);
            }
        }
    }

    #file {
        position: absolute;
        top: 47px;
        left: calc(100vw - 300px - 100px);
        height: auto;
        border: solid #99a1a9 1px;

        a {
            color: white;
        }
    }

    #drawTools {
        position: absolute;
        width: 22px;
        height: auto;
        top: 147px;
        left: calc(300px);
        border: solid #99a1a9 1px;

        img {
            margin-top: 5px;
            margin-bottom: 5px;
        }
    }
}
</style>
