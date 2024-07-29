<template>
    <div class="hello">
        <div id="homeHeader">
            <div id="newMenu">
                <a-menu v-model="current" mode="horizontal" theme="dark">
                    <a-menu-item key="mail3" @click="goExperimentArea">
                        <a-icon type="appstore" />
                        ExperimentArea
                    </a-menu-item>
                    <a-menu-item key="mail5" @click="goDigitalCity">
                        <a-icon type="appstore" />
                        DigitalCity
                    </a-menu-item>
                    <a-menu-item key="mail6" @click="go3dMenu">
                        <a-icon type="appstore" />
                        3dMenu
                    </a-menu-item>
                    <a-menu-item key="mail7" @click="go3dMenu1">
                        <a-icon type="appstore" />
                        3dMenu1
                    </a-menu-item>
                    <a-menu-item key="mail8" @click="goRotateImg">
                        <a-icon type="appstore" />
                        RotateImg
                    </a-menu-item>
                </a-menu>
            </div>
            <div class="loadNum-container">
                {{ loadNum }}
            </div>
        </div>
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    data() {
        return {
            current: ['mail'],
            loadNum: null
        }
    },
    methods: {
        goExperimentArea() {
            this.$router.push({ path: '/experimentArea' }).catch(error => error)
        },
        goDigitalCity() {
            this.$router.push({ path: '/goDigitalCity' }).catch(error => error)
        },
        go3dMenu() {
            this.$router.push({ path: '/go3dMenu' }).catch(error => error)
        },
        go3dMenu1() {
            this.$router.push({ path: '/go3dMenu1' }).catch(error => error)
        },
        goRotateImg() {
            this.$router.push({ path: '/rotateImg' }).catch(error => error)
        }
    },
    mounted() {
        this.$router.push({ path: '/goDigitalCity' }).catch(error => error)
        $hub.on("loadedProcess", data => {
            this.loadNum = data
        })
    }
}
</script>

<style lang="scss" scoped>
.hello {
    width: 100%;
    height: 100%;

    .loadNum-container {
        position: fixed;
        right: 30px;
        top: 20px;
        z-index: 999999;
    }

    #homeHeader {
        #newMenu {
            // Optional styling for the menu container
        }
    }
}
</style>
