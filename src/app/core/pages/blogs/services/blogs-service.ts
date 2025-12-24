import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
export type BlogApiItem = {
    id: number;
    title: string;
    metaTitle: string;
    metaDescription: string;
    altText: string;
    mainImage: string; // "/uploads/img20.png"
    url: string;       // slug ar
    englishURL: string;
    category: string;
    readNum: number;
    createdAt: string;
    updatedAt: string;
};

export type AllBlogsResponse = {
    success: boolean;
    data: BlogApiItem[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };
};

export type MostReadResponse = {
    success: boolean;
    data: BlogApiItem[];
};

@Injectable({
    providedIn: 'root',
})
export class BlogsService {
    constructor(private router: Router, private http: HttpClient) { }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    getMostReadBlogs() {
        return this.http.get('/api/articles/mostread');
    }
    getAllBlogs(page: number) {
        return this.http.get(`/api/articles/allblogs?page=${page}`);
    }
    getBlogByName(name: string) {
        return this.http.get(`/api/articles/${name}`);
    }

    AddBlog(blog: any) {
        return this.http.post('api/articles/add', blog);
    }

    UpdateBlog(id: number, blog: any) {
        return this.http.put(`api/articles/${id}`, blog);
    }

    DeleteBlog(id: number) {
        return this.http.delete(`api/articles/${id}`);
    }
    UploadImage(image: any) {
        return this.http.post(`api/images/upload-image`, image);
    }
}
