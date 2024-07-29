<template>
    <div class="all_3DMenu">
        <canvas id="D3Container11" height="1000" style="z-index: 99999; border: 1px solid yellow"
                width="2000"></canvas>
    </div>
</template>

<script>
import {RotatePic} from "./RotatePic"

export default {
    name: "Menu3DV1.vue",
    data() {
        return {}
    },
    mounted() {
        const dom = document.getElementById('D3Container11')
        this.menu3D = new RotatePic(dom)
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
