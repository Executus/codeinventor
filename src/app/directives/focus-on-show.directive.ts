import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusOnShow]'
})
export class FocusOnShowDirective implements OnInit {

  constructor(private elRef: ElementRef) { 
    if (!elRef.nativeElement['focus']) {
      throw new Error('Element does not accept focus - remove directive.');
    }
  }

  ngOnInit(): void {
    const input: HTMLInputElement = this.elRef.nativeElement as HTMLInputElement;
    input.focus();
  }
}
