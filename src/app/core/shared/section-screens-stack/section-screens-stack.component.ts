import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

type Card = { src: string; alt: string };

@Component({
  selector: 'app-section-screens-stack',
  standalone: true,
  imports: [NgFor],
  templateUrl: './section-screens-stack.component.html',
  styleUrl: './section-screens-stack.component.scss',
})
export class SectionScreensStackComponent {


}
