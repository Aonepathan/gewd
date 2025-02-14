import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, NgControl } from '@angular/forms';
import { MatFormField, MatFormFieldControl } from '@angular/material/form-field';
import { Observable, Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'gewd-custom-form-control',
  template: `<ng-content></ng-content>`,
  providers: [
    { provide: MatFormFieldControl, useExisting: CustomFormControlComponent }
  ]
})
export class CustomFormControlComponent implements OnInit, ControlValueAccessor, MatFormFieldControl<any>, OnDestroy, OnChanges {
  get value(): any {
    return this._value;
  }

  @Input()
  set value(value: any) {
    this._value = value;
    this.stateChangeSubject.next();
    if (this.onChange) {
      this.onChange(value);
    }
  }

  @Input('aria-describedby')
  userAriaDescribedBy: string;

  @Input()
  placeholder: string;

  @Input()
  required: boolean;

  @Input()
  disabled: boolean;

  private _value: any;

  @Input()
  focused: boolean;

  get errorState(): boolean {
    return false;
  }

  onChange = (_: any) => {
  };
  onTouched = () => {
  };

  get empty() {
    return typeof this.value === 'number' ? false : !this.value;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }


  constructor(
    formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl) {

    if (this.ngControl !== null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick() {

  }

  writeValue(val: any): void {
    this._value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  readonly autofilled: boolean;
  readonly controlType: string;
  readonly id: string;
  readonly stateChangeSubject = new Subject<void>();
  readonly stateChanges: Observable<void> = this.stateChangeSubject;


  ngOnChanges({value}: SimpleChanges): void {
    if (value && this.onChange) {
      this.onChange(value.currentValue);
      this.stateChangeSubject.next();
    }
  }
}
