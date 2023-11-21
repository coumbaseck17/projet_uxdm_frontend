import { createRouter, createWebHistory } from 'vue-router';

import TreemapV1 from '@/components/TreemapDir/TreeMap.vue';
import PictrogrammeChart from "@/components/pictogramme-chart/PictrogrammeChart";
import SunburstChart from '@/components/sunburst-chart/SunburstChart.vue';
import BarChart from '@/components/bar-chart/BarChartV1.vue';

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
            component: SunburstChart,
        },
        {
            path: '/barchart',
            component: BarChart,
        },
    ],
});


export default router;
