// router.js

import PictogramChart from "@/components/bar-chart/PictogrammeChart";
import SubgenreChart from "@/components/bar-chart/SubgenreChart.vue";

import { createRouter,createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
    { path: '/', component: PictogramChart },
    { path: '/subgenre-chart/:genre', name: 'subgenre-chart', component: SubgenreChart },
]});

export default router;


