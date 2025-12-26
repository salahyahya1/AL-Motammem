import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type DialogVariant = 'success' | 'error' | 'info' | 'warning';
export type DialogBtnStyle = 'primary' | 'outline' | 'danger';

export interface DialogButton {
  id: string;          // عشان تعرف مين اتضغط
  text: string;        // نص الزر
  style?: DialogBtnStyle;
  disabled?: boolean;
}
@Component({
  selector: 'app-messege-dialog',
  imports: [CommonModule],
  templateUrl: './messege-dialog.component.html',
  styleUrl: './messege-dialog.component.scss'
})
export class MessegeDialogComponent {
  @Input() open = false;

  @Input() dir: 'rtl' | 'ltr' = 'rtl';
  @Input() closeOnBackdrop = true;
  @Input() showCloseX = true;

  @Input() variant: DialogVariant = 'success';
  @Input() title = '';
  @Input() message = '';

  // الأزرار (عددهم + محتواهم)
  @Input() buttons: DialogButton[] = [
    { id: 'ok', text: 'حسناً', style: 'primary' }
  ];

  // Events للصفحة اللي بتناديه
  @Output() closed = new EventEmitter<void>();
  @Output() action = new EventEmitter<string>(); // بيرجع id بتاع الزر

  get icon() {
    switch (this.variant) {
      case 'success': return '✅';
      case 'error': return '⚠️';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }

  get iconWrapClass() {
    switch (this.variant) {
      case 'success': return 'bg-green-100';
      case 'error': return 'bg-red-100';
      case 'warning': return 'bg-yellow-100';
      default: return 'bg-blue-100';
    }
  }

  get iconClass() {
    switch (this.variant) {
      case 'success': return 'text-green-700';
      case 'error': return 'text-red-700';
      case 'warning': return 'text-yellow-700';
      default: return 'text-blue-700';
    }
  }

  close() {
    this.open = false;
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.id === 'dialog-backdrop' && this.closeOnBackdrop) {
      this.close();
    }
  }

  onBtnClick(btn: DialogButton) {
    this.action.emit(btn.id);
  }

  btnClass(style: DialogBtnStyle = 'primary') {
    // نفس شكل الصورة: outline + red + primary
    if (style === 'outline') {
      return 'border border-[#3B28FF] text-[#3B28FF] hover:bg-[#3B28FF]/5';
    }
    if (style === 'danger') {
      return 'bg-red-500 text-white hover:bg-red-600 shadow';
    }
    return 'bg-[#3B28FF] text-white hover:bg-[#2c1fe6] shadow';
  }
}
