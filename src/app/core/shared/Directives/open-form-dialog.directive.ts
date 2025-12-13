import { Directive, HostListener } from '@angular/core';
import { FormDialogService } from '../services/form-dialog.service';

@Directive({
    selector: '[appOpenFormDialog]',
    standalone: true
})
export class OpenFormDialogDirective {
    constructor(private formDialogService: FormDialogService) { }

    @HostListener('click')
    onClick() {
        this.formDialogService.open();
    }
}
