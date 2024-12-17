import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Menubar } from 'primeng/menubar';
import { LangIconComponent } from '../../shared/components/lang-icon/lang-icon.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    Menubar,
    DropdownModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    LangIconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService,
    private localizeRouterService: LocalizeRouterService
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(): void {
    const token = localStorage.getItem('HR_DEPARTMENT_TOKEN');
    if (token) {
      this.subscription.add(this.authService.logout(token)
        .subscribe({
          next: res => {
            this.resetData();
          },
          error: err => {
            this.resetData();
          }
        })
      )
    } else {
      this.resetData();
    }
  }

  resetData(): void {
    localStorage.removeItem('HR_DEPARTMENT_TOKEN');
    this.authService.userSubject$.next(null);
    this.router.navigate([`/${this.localizeRouterService.parser.currentLang}/auth/login`]);
    this.messageService.add({ severity: 'success', summary: this.translate.instant('success'), detail: this.translate.instant('logged_out_successfully') });
  }

}
