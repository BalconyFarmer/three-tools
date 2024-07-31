<template>
    <div id='rightToolClassSub'>
        <div id='models'>
            <div draggable="true" v-for="item in listData" v-on:dragstart="dragstart(item,$event)"
                 v-on:dragend="dragend(item,$event)">
                <img :src=item.imgSrc>
                <div class="titleContainer">{{ item.name }}</div>
                <a-divider type="horizontal" dashed/>
            </div>
        </div>

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
