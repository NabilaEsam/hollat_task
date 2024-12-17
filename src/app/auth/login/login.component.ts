import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectButton } from 'primeng/selectbutton';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    TranslateModule,
    SelectButton,
    PasswordModule,
    InputTextModule,
    ReactiveFormsModule,
    Card,
    ButtonModule,
    RouterModule
  ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {

  roles: any[] = [
    { title_ar: 'مستفيد', title_en: 'Benificiary', value: 'Benificiary' },
    { title_ar: 'مسؤول', title_en: 'Admin', value: 'Admin' }
  ];;
  form!: FormGroup;

  private subscription: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    public localizeRouterService: LocalizeRouterService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm(): void {
    this.form = this.fb.group({
      role: ['Benificiary', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: this.translate.instant('error'), detail: this.translate.instant('fill_required_fields') });
      return;
    }

    const data = { ...this.form.value };
    this.login(data);
  }

  login(data: any): void {
    this.subscription.add(this.loginService.login(data)
      .subscribe({
        next: res => {
          if (res.token) {
            localStorage.setItem('HR_DEPARTMENT_TOKEN', res.token);
            this.authService.userSubject$.next(res.user)
          }
          this.messageService.add({ severity: 'success', summary: this.translate.instant('success'), detail: this.translate.instant('logged_in_successfully') });
          this.router.navigate(['/']);
        },
        error: err => {
          this.messageService.add({ severity: 'error', summary: this.translate.instant('error'), detail: this.translate.instant('invalid_login') });
        }
      })
    )
  }

}
