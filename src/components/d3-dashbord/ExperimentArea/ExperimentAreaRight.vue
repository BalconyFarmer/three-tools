<template>
    <div id="rightContainer">

        <ExperimentAreaRightAllClass v-if="allClassShow" :app3D='app3D'></ExperimentAreaRightAllClass>
        <ExperimentAreaRightMaterial v-if="allMaterial" :app3D='app3D'></ExperimentAreaRightMaterial>
        <ExperimentAreaRightGeometries v-if="allGeometries" :app3D='app3D'></ExperimentAreaRightGeometries>
        <ExperimentAreaRightStaticsModels v-if="StaticsModels" :app3D='app3D'></ExperimentAreaRightStaticsModels>
        <ExperimentAreaRightTransform v-if="transformShow " :app3D='app3D'></ExperimentAreaRightTransform>

        <div id='rightToolClass'>
            <a-tooltip placement="left">
                <template slot="title">
                    prompt text
                </template>
                <div :class="allClassShow?'rightToolClassSubSelect': 'rightToolClassSub'">
                    <a-icon class="animate__animated animate__flash" style="color: #ffffff" type="branches"
                            @click="turnOnAllClass"/>
                </div>
            </a-tooltip>

            <a-tooltip placement="left">
                <template slot="title">
                    材质
                </template>
                <div :class="allMaterial?'rightToolClassSubSelect': 'rightToolClassSub'">
                    <a-icon class="animate__animated animate__flash" style="color: #ffffff" type="environment"
                            @click="turnMaterial"/>
                </div>
            </a-tooltip>

            <a-tooltip placement="left">
                <template slot="title">
                    几何体
                </template>
                <div :class="allGeometries?'rightToolClassSubSelect': 'rightToolClassSub'">
                    <a-icon class="animate__animated animate__flash" style="color: #ffffff" type="environment"
                            @click="turnGeometries"/>
                </div>
            </a-tooltip>

            <a-tooltip placement="left">
                <template slot="title">
                    OBJ
                </template>
                <div :class="StaticsModels?'rightToolClassSubSelect': 'rightToolClassSub'">
                    <a-icon class="animate__animated animate__flash" style="color: #ffffff" type="environment"
                            @click="turnStaticsModels"/>
                </div>
            </a-tooltip>

            <a-tooltip placement="left">
                <template slot="title">
                    TRANSFORM
                </template>
                <div :class="transformShow?'rightToolClassSubSelect': 'rightToolClassSub'">
                    <a-icon class="animate__animated animate__flash" style="color: #ffffff" type="api" @click="turnOnTransformShow"/>
                </div>
            </a-tooltip>

        </div>

    </div>
</template>

<script>
import ExperimentAreaRightTransform from './ExperimentAreaRightTransform'
import ExperimentAreaRightAllClass from './ExperimentAreaRightAllClass'
import ExperimentAreaRightMaterial from './ExperimentAreaRightMaterial'
import ExperimentAreaRightGeometries from './ExperimentAreaRightGeometries'
import ExperimentAreaRightStaticsModels from './ExperimentAreaRightStaticsModels'

export default {
    props: {
        app3D: Object,
        required: true
    },
    components: {
        ExperimentAreaRightTransform,
        ExperimentAreaRightAllClass,
        ExperimentAreaRightMaterial,
        ExperimentAreaRightGeometries,
        ExperimentAreaRightStaticsModels
    },
    data() {
        return {
            allClassShow: true,
            allMaterial: false,
            allGeometries: false,
            StaticsModels: false,
            transformShow: false,
        }
    },
    methods: {
        turnOnTransformShow() {
            this.transformShow = true
            this.allClassShow = false
            this.allMaterial = false
            this.allGeometries = false
            this.StaticsModels = false
        },
        turnOnAllClass() {
            this.transformShow = false
            this.allClassShow = true
            this.allMaterial = false
            this.allGeometries = false
            this.StaticsModels = false
        },
        turnMaterial() {
            this.transformShow = false
            this.allClassShow = false
            this.allMaterial = true
            this.allGeometries = false
            this.StaticsModels = false
        },
        turnGeometries() {
            this.transformShow = false
            this.allClassShow = false
            this.allMaterial = false
            this.allGeometries = true
            this.StaticsModels = false
        },
        turnStaticsModels() {
            this.transformShow = false
            this.allClassShow = false
            this.allMaterial = false
            this.allGeometries = false
            this.StaticsModels = true
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss">

#rightContainer {
    position: absolute;
    left: calc(100vw - 300px);
    top: 46px;
    width: 300px;
    height: auto;

    #rightToolClass {
        display: inline-block;
        float: left;
        width: 25px;
        height: calc(100vh);
        box-shadow: 1px 1px 1px #7BA4B4;

        .rightToolClassSub {
            margin-top: 10px;
            display: inline-block;
            //background: #1890FF;
        }

        .rightToolClassSubSelect {
            margin-top: 10px;
            display: inline-block;
            background: #1890FF;
        }
    }

    #rightToolClassSub {
        display: inline;
        float: left;
        width: 275px;
        box-shadow: 1px 1px 1px #7BA4B4;

        strong {
            color: #87e8de;
        }
    }


}
</style>
