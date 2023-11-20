import { createRouter, createWebHistory } from 'vue-router';

import TreemapV1 from '@/components/TreemapDir/TreeMap.vue';
import PictrogrammeChart from "@/components/pictogramme-chart/PictrogrammeChart";
import TreemapV3 from '@/components/TreemapDir/TreeMap.vue';
import TreemapV4 from '@/components/TreemapDir/TreeMap.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/treemap',
            component: TreemapV1,
        },
        {
            path: '/pictogram',
            component: PictrogrammeChart,
        },
        {
            path: '/sunburst',
            component: TreemapV3,
        },
        {
            path: '/barchart',
            component: TreemapV4,
        },
    ],
});


export default router;
