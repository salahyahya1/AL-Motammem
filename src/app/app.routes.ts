import { Routes } from '@angular/router';
import { ComingSoonComponent } from './core/shared/coming-soon/coming-soon.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../app/core/pages/home/home.component').then(m => m.HomeComponent),
        title: 'الصفحة الرئيسية',
        data: {
            seo: {
                description: 'ERP عربي بخبرة 40 سنة…',
                image: '/assets/og/home.webp',
                canonical: 'https://example.com/'
            }
        }
    },
    {
        path: 'plans',
        loadComponent: () => import('../app/core/pages/plans/plans.component').then(m => m.PlansComponent),
        title: 'الخطط والأسعار',
        data: {
            seo: {
                description: 'خطط وأسعار مرنة…',
                canonical: 'https://example.com/plans'
            }
        }
    },{
        path: 'ComingSoon',
        component:ComingSoonComponent,
             title: 'قريبا',
    },
    { path: '**', redirectTo: '' }
];
