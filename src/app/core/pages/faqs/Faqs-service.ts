import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class FaqsService {
    constructor(private router: Router, private http: HttpClient) { }

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
    GetAllFAQS() {
        return this.http.get('/api/faqs?type=general')
    }
    AddFAQS(FAQS: any) {
        return this.http.post('/api/faqs/add', FAQS)
    }
    UpdateFAQ(id: number, FAQS: any) {
        return this.http.put('/api/faqs/' + id, FAQS)
    }
    DeleteFAQ(id: number) {
        return this.http.delete('/api/faqs/' + id)
    }

}
