import { Routes } from '@angular/router';
import { ComingSoonComponent } from './core/shared/coming-soon/coming-soon.component';
import { BlogVeiwComponent } from './core/pages/blogs/blog-veiw/blog-veiw.component';
import { CreateBlogComponent } from './core/pages/blogs/create-blog/create-blog.component';
import { EditBlogComponent } from './core/pages/blogs/edit-blog/edit-blog.component';

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
                },
                // children: [
                //     {
                //         path: 'hero',
                //         loadComponent: () => import('./core/pages/home/section1/section1.component').then(m => m.Section1Component)
                //     }
                // ]
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
                path: 'products',
                loadComponent: () => import('./core/pages/products/products.component').then(m => m.ProductsComponent),
                title: 'المنتجات',
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
                loadComponent: () => import('./core/pages/blogs/main-blogs/main-blogs.component')
                    .then(m => m.MainBlogsComponent),
                title: 'المدونات',
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./core/pages/blogs/blogs.component')
                            .then(m => m.BlogsComponent),
                        title: 'المدونات'
                    },
                    {
                        path: 'BlogVeiw/:url',
                        loadComponent: () => import('./core/pages/blogs/blog-veiw/blog-veiw.component')
                            .then(m => m.BlogVeiwComponent),
                        title: `مدونه`
                    },
                    { path: 'CreateBlog', component: CreateBlogComponent, title: 'انشاء مدونة جديدة', data: { seo: { robots: 'noindex, nofollow' } } },
                    { path: 'EditBlog/:url', component: EditBlogComponent, title: 'تعديل مدونة', data: { seo: { robots: 'noindex, nofollow' } } }
                ]
            },
            {
                path: 'FAQS',
                loadComponent: () => import('./core/pages/faqs/faqs.component')
                    .then(m => m.FAQSComponent),
                title: `FAQS`
            },
            {
                path: 'ContactUs',
                loadComponent: () => import('./core/pages/contact-us/contact-us.component')
                    .then(m => m.ContactUsComponent),
                title: `تواصل معنا`
            },
            {
                path: 'TermsPlicy',
                loadComponent: () => import('./core/pages/terms-plicy/terms-plicy.component')
                    .then(m => m.TermsPlicyComponent),
                title: `تواصل معنا`
            },
            {
                path: 'PrivacyPlicy',
                loadComponent: () => import('./core/pages/privacy-plicy/privacy-plicy.component')
                    .then(m => m.PrivacyPlicyComponent),
                title: `تواصل معنا`
            },
            {
                path: 'coming-soon',
                loadComponent: () => import('./core/shared/coming-soon/coming-soon.component')
                    .then(m => m.ComingSoonComponent),
                title: 'قريبًا',
                data: { seo: { robots: 'noindex, nofollow' } }
            },
            {
                path: 'login',
                loadComponent: () => import('./core/auth/login/login.component')
                    .then(m => m.LoginComponent),
                title: 'تسجيل الدخول',
                data: { seo: { robots: 'noindex, nofollow' } }
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
