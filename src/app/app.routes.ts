import { Routes } from '@angular/router';
import { ComingSoonComponent } from './core/shared/coming-soon/coming-soon.component';
import { BlogVeiwComponent } from './core/pages/blogs/blog-veiw/blog-veiw.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/layout/layout/layout.component')
            .then(m => m.LayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./core/pages/home/home.component').then(m => m.HomeComponent),
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
                path: 'about',
                loadComponent: () => import('./core/pages/about/about.component').then(m => m.AboutComponent),
                title: 'من نحن',
                data: {
                    seo: {
                        description: 'ERP عربي بخبرة 40 سنة…',
                        image: '/assets/og/about.webp',
                        canonical: 'https://example.com/'
                    }
                }
            },
            {
                path: 'solutions',
                loadComponent: () => import('./core/pages/solutions/solutions.component').then(m => m.SolutionsComponent),
                title: 'الحلول والقطاعات',
                data: {
                    seo: {
                        description: 'ERP عربي بخبرة 40 سنة…',
                        image: '/assets/og/about.webp',
                        canonical: 'https://example.com/'
                    }
                }
            },
            {
                path: 'plans',
                loadComponent: () => import('./core/pages/plans/plans.component').then(m => m.PlansComponent),
                title: 'الخطط والأسعار',
                data: {
                    seo: {
                        description: 'خطط وأسعار مرنة…',
                        canonical: 'https://example.com/plans'
                    }
                }
            },
            {
                path: 'blogs',
                loadComponent: () => import('./core/pages/blogs/blogs.component')
                    .then(m => m.BlogsComponent),
                title: 'المدونات'
            },
            {
                path: 'BlogVeiw',
                loadComponent: () => import('./core/pages/blogs/blog-veiw/blog-veiw.component')
                    .then(m => m.BlogVeiwComponent),
                title: `مدونه`
            },
            {
                path: 'ContactUs',
                loadComponent: () => import('./core/pages/contact-us/contact-us.component')
                    .then(m => m.ContactUsComponent),
                title: `تواصل معنا`
            },
            {
                path: 'coming-soon',
                loadComponent: () => import('./core/shared/coming-soon/coming-soon.component')
                    .then(m => m.ComingSoonComponent),
                title: 'قريبًا'
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
