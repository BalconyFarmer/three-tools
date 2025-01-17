import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import ExperimentArea from "../components/d3-dashbord/ExperimentArea/ExperimentArea";
import DigitalCity from "../components/d3-dashbord/DigitalCity/DigitalCity";
import MenuD3 from "../components/d3-dashbord/MenuParty/MenuD3";
import MenuD31 from "../components/d3-dashbord/MenuFlowline/Menu3d2"
import RotateImg from "../components/d3-dashbord/Menu110/RotateImg";

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'HomePage',
            component: HomePage,
            children: [
                {path: 'goDigitalCity', component: DigitalCity},
                {path: 'experimentArea', component: ExperimentArea, children: []},
                {path: 'go3dMenu', component: MenuD3, children: []},
                {path: 'go3dMenu1', component: MenuD31, children: []},
                {path: 'rotateImg', component: RotateImg, children: []},
            ]
        }
    ],
    mode: "history", // hash
    base: process.env.NODE_ENV === "development" ? "/test" : "/Three3D",
})

router.beforeEach((to, from, next) => {
    next()
    localStorage.setItem('currentRouter', to.path)
})
export default router
