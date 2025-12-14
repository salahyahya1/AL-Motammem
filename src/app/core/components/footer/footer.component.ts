import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() phone = '201016889890';

  // الرسالة الجاهزة
  @Input() message = 'مرحبًا، أريد الاستفسار عن خدماتكم.';

  get link(): string {
    return `https://wa.me/${this.phone}?text=${encodeURIComponent(this.message)}`;
  }

  open() {
    window.open(this.link, '_blank', 'noopener,noreferrer');
  }
}
