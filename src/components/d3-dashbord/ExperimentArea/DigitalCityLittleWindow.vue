<template>
    <div id="littleWindowContainer">
        <div id="header">
            <img :src="close" id="icon1" @click="closeLittleWindow">
        </div>
        <canvas id="littleWindowCanvas0"></canvas>
    </div>
</template>
<script>
import close from '@/assets/关闭.svg';

export default {
    props: {
        app3D: Object,
        required: true
    },
    data() {
        return {
            close: close,
        }
    },
    methods: {
        closeLittleWindow() {
            window.app3D.littleWindow.destroy()
            this.$parent.showLittleWindow = false
            this.$parent.startLittleWindow()
        }
    },

    mounted() {
        this.$nextTick(function () {
        })
    }

}

</script>

<style lang="scss">

#littleWindowContainer {
    position: absolute;
    width: calc(100vw - 600px);
    height: 200px;
    top: calc(100vh - 190px);
    left: 300px;
    z-index: 2000;

    #header {
        width: calc(100vw - 600px);
        height: 20px;
    }

    #icon1 {
        width: 15px;
        height: 15px;
    }
}

</style>
