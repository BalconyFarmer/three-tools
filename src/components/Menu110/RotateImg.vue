<template>
    <div class="all_3DMenu">
        <canvas width="2000" height="1000" style="z-index: 99999; border: 1px solid yellow"
                id="D3Container11"></canvas>
    </div>
</template>

<script>
import {RotatePic} from "./RotatePic"

export default {
    name: "Menu3DV1.vue",
    data() {
        return {}
    },
    methods: {
        init3D() {
            const self = this
            const dom = document.getElementById('D3Container11')

            const menuData = [
                {assert: '党员教育0.png', routerAdress: "/PartyMemberPortrait"},
            ]

            this.menu3D = new RotatePic(dom)
            this.menu3D.init3D(menuData)
        },
    },
    mounted() {
        this.init3D()
    }
}
</script>

<style scoped>

.all_3DMenu {
    margin: 0;
    overflow: hidden;
    background: url("./imgs/baseMap.png") center no-repeat;
    background-size: 40% 40%;
    background-position: center 55%;
    background-color: #252526;
}


.all_3DMenu {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}
</style>
