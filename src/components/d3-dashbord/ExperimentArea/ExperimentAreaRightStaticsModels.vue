<template>
    <div id='rightToolClassSub'>
        <div id='models'>
            <div v-for="item in listData" draggable="true" v-on:dragend="dragend(item,$event)"
                 v-on:dragstart="dragstart(item,$event)">
                <img :src=item.imgSrc>
                <div class="titleContainer">{{ item.name }}</div>
                <a-divider dashed type="horizontal"/>
            </div>
        </div>
        <a @click="addAnimationTest">动画小车</a>
        <a @click="addSkimmer">加载蛋分</a>
        <a @click="addAdvancedMaterial">心脏 AdvancedMaterial</a>
        <a @click="makeMeshPoint">点集显示</a>
        <a @click="makeMeshLine">线集显示</a>
    </div>
</template>

<script>
import * as THREE from "three";
import {serverAdress} from '@/config';

export default {
    props: {
        app3D: Object,
        required: true
    },
    data() {
        return {
            listData: [
                {
                    name: 'Plane-Engine.obj',
                    index: serverAdress + '/3Dstatic/model3D/飞机/飞机引擎/Plane-Engine.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/飞机引擎/Screenshot.png'
                },
                {
                    name: 'F-35 ',
                    index: serverAdress + '/3Dstatic/model3D/飞机/f-35/F-35 A Lightning II Nete.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/f-35/Screenshot.png'
                },
                {
                    name: '0ni_Tak1mlar1/0ni_Tak1mlar1.obj',
                    index: serverAdress + '/3Dstatic/model3D/飞机/0ni_Tak1mlar1/0ni_Tak1mlar1.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/0ni_Tak1mlar1/Screenshot.png'
                },
                {
                    name: 'varytest',
                    index: serverAdress + '/3Dstatic/model3D/飞机/varytest/无标题.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/varytest/Screenshot.png'
                },
                {
                    name: 'ENSCAPE+MATERIALS.obj',
                    index: serverAdress + '/3Dstatic/model3D/飞机/材质预览/ENSCAPE+MATERIALS.obj',
                    imgSrc: serverAdress + '/3Dstatic/model3D/飞机/材质预览/Screenshot.png'
                },
                {
                    name: '路灯',
                    index: serverAdress + '/3Dstatic/model3D/digitalCity/2路灯/总成.obj',
                    imgSrc: ''
                }
            ],


            name3D: null,
            fileList: [],
            uploading: false,
            videoIntroduce: null,
            objResource: []
        }
    },
    methods: {
        makeMeshPoint() {
            window.app3D.makeMeshPoint.start();
        },
        makeMeshLine() {
            window.app3D.makeMeshLine.start();
        },
        addAdvancedMaterial() {
            window.app3D.advancedMaterial.add();
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
        dragstart(item, event) {

        },
        dragend(item, event) {

            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();

            this.mouse.x = (event.clientX / window.app3D.dom.width) * 2 - 1;
            this.mouse.y = -(event.clientY / window.app3D.dom.height) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, window.app3D.camera);

            let target = []
            window.app3D.scene.children.forEach(item => {
                target.push(item)
                if (item.type === 'Group') {
                    item.children.forEach(item => {
                        target.push(item)
                    })
                }
            })
            const intersects = this.raycaster.intersectObjects(target);

            if (intersects[0]) {
                if (intersects[0].point) {
                    const vec3 = intersects[0].point
                    console.warn('intersects[0].point', intersects[0].point)
                    window.app3D.objLoaders.loadOBJ(item.index, item.name, vec3)
                }
            }

        },
    },
    mounted() {
    }
}
</script>

<style lang="scss">
#rightToolClassSub {
    display: inline;
    float: left;
    width: 275px;
    height: calc(100vh - 50px);
    border: solid #99A1A9 1px;
    color: #7DD3CA;
    overflow-y: scroll;

    #models {
        height: 500px;
        overflow: auto;

        img {
            width: 50px;
            height: 50px;
        }

        .titleContainer {
            display: inline-block;
            height: 50px;
        }

        .ant-divider-horizontal {
            display: block;
            clear: both;
            width: 100%;
            min-width: 100%;
            height: 1px;
            margin: 1px 0;
        }
    }

    #videoUploadContainer {
        background-color: #3C3F41;
        overflow: auto;
    }

}
</style>
