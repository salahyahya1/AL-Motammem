import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccordionComponent } from "../../shared/accordion/accordion.component";
import { TranslatePipe } from '@ngx-translate/core';

type FaqItem = { title: string; answer: string; startOpen: boolean };

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, AccordionComponent, TranslatePipe],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FAQSComponent {
  FAQS: FaqItem[] = [
    { title: "FAQS.Q1.T1", answer: 'FAQS.Q1.A1', startOpen: true },
    { title: "FAQS.Q2.T1", answer: 'FAQS.Q2.A1', startOpen: false },
    { title: "FAQS.Q3.T1", answer: 'FAQS.Q3.A1', startOpen: false },
    { title: "FAQS.Q4.T1", answer: 'FAQS.Q4.A1', startOpen: false },
    { title: "FAQS.Q5.T1", answer: 'FAQS.Q5.A1', startOpen: false },
    { title: "FAQS.Q6.T1", answer: 'FAQS.Q6.A1', startOpen: false },
    { title: "FAQS.Q7.T1", answer: 'FAQS.Q7.A1', startOpen: false },
    { title: "FAQS.Q8.T1", answer: 'FAQS.Q8.A1', startOpen: false },
    { title: "FAQS.Q9.T1", answer: 'FAQS.Q9.A1', startOpen: false },
    { title: "FAQS.Q10.T1", answer: 'FAQS.Q10.A1', startOpen: false },
    { title: "FAQS.Q11.T1", answer: 'FAQS.Q11.A1', startOpen: false },
    { title: "FAQS.Q12.T1", answer: 'FAQS.Q12.A1', startOpen: false },
    { title: "FAQS.Q13.T1", answer: 'FAQS.Q13.A1', startOpen: false },
    { title: "FAQS.Q14.T1", answer: 'FAQS.Q14.A1', startOpen: false },
    { title: "FAQS.Q15.T1", answer: 'FAQS.Q15.A1', startOpen: false },
  ];

}
