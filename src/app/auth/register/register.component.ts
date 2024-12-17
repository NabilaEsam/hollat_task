import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Subscription } from 'rxjs';
import { RegisterService } from './services/register.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { FileUpload } from 'primeng/fileupload';
import { InputNumber } from 'primeng/inputnumber';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    TranslateModule,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
    Card,
    ButtonModule,
    RouterModule,
    FileUpload,
    InputNumber,
    ToggleSwitch
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {

  form!: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private registerService: RegisterService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.form = this.fb.group({
      role: ['Benificiary'],
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      technologies: ['', [Validators.required]],
      budget: [null],
      isHero: [false]
    });
  }

  changeIsHero(): void {
    const isHero = this.form.get('isHero')?.value;

    this.form.get('budget')?.setValue(null);
    this.form.get('budget')?.setValidators([]);

    if (isHero) {
      this.form.get('budget')?.setValidators([Validators.required]);
    }

    this.form.get('budget')?.updateValueAndValidity();
  }

  submit(photo: File): void {
    if (this.form.invalid || !photo) {
      this.messageService.add({ severity: 'error', summary: this.translate.instant('error'), detail: this.translate.instant('fill_required_fields') });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const photoBase64 = reader.result as string;
      const data = { ...this.form.value, photo: photoBase64 };

      this.register(data);
    };

    reader.readAsDataURL(photo);
  }

  register(data: any): void {
    this.subscription.add(this.registerService.register(data)
      .subscribe({
        next: res => {
          if (res.token) {
            localStorage.setItem('HR_DEPARTMENT_TOKEN', res.token);
            this.authService.userSubject$.next(res.user)
          }
          this.messageService.add({ severity: 'success', summary: this.translate.instant('success'), detail: this.translate.instant('registered_successfully') });
          this.router.navigate(['/']);
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: this.translate.instant('error'), detail: this.translate.instant('invalid_register') });
        }
      })
    )
  }

}
