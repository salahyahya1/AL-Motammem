import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { BlogsService } from '../pages/blogs/services/blogs-service';
import { map } from 'rxjs';


export const blogResolver: ResolveFn<any> = (route) => {
    const slug = route.paramMap.get('url')!;
    return inject(BlogsService).getBlogByName(slug).pipe(
        map((res: any) => res.data)
    );
};
