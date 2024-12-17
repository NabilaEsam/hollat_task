import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { ButtonModule } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { AuthService } from './core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, Toast],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(
    private localizeRouterService: LocalizeRouterService,
    private authService: AuthService,
    @Inject(DOCUMENT) private dom: any
  ) { }

  ngOnInit(): void {
    this.checkLanguage();
    this.getUserData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkLanguage(): void {
    const htmlTag = this.dom.getElementsByTagName('html')[0] as HTMLHtmlElement;
    if (this.localizeRouterService.parser.currentLang == 'en') {
      htmlTag.dir = 'ltr';
      htmlTag.lang = 'en';
    } else {
      htmlTag.dir = 'rtl';
      htmlTag.lang = 'ar';
    }
  }

  getUserData(): void {
    const token = localStorage.getItem('HR_DEPARTMENT_TOKEN');
    if (token) {
      this.subscription.add(this.authService.getUserData(token)
        .subscribe({
          next: res => {
            this.authService.userSubject$.next(res);
          }
        })
      )
    }
  }

}
