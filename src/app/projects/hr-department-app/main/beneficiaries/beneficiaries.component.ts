import { Component, OnDestroy, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { RatingModule, RatingRateEvent } from 'primeng/rating';
import { BeneficiaresService } from './services/beneficiares.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { TagModule } from 'primeng/tag';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ProfileDialogComponent } from './profile-dialog/profile-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [
    TranslateModule,
    TableModule,
    CommonModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    RatingModule,
    ButtonModule,
    TagModule,
  ],
  providers: [DialogService],
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss',
})
export class BeneficiariesComponent implements OnInit, OnDestroy {

  searchName: string = '';
  searchBudget: string = '';
  beneficiaries: any[] = [];
  userData: any;

  private subscription: Subscription = new Subscription();

  constructor(
    private beneficiaryService: BeneficiaresService,
    private authService: AuthService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.getAllBeneficiaries();
    this.getUserData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getUserData(): void {
    this.subscription.add(this.authService.userSubject$.subscribe({
      next: (res: any) => {
        this.userData = res;
      }
    }))
  }

  getAllBeneficiaries(): void {
    this.subscription.add(this.beneficiaryService.getAllBeneficiaries()
      .subscribe({
        next: (res: any) => {
          this.beneficiaries = res;
        }
      })
    )
  }

  getSeverity(status: string | boolean): any {
    switch (status) {
      case false:
        return 'warn';
      case true:
        return 'success';
      default:
        return 'warn';
    }
  }

  detectRatingFun(event: RatingRateEvent, id: number | string): void {
    this.updateUserData(id, 'rating', event.value);
  }

  updateUserData(id: number | string, key: string, value: any): void {
    this.subscription.add(this.beneficiaryService.updateHero(id, key, value)
      .subscribe({
        next: (res: any) => {
          this.getAllBeneficiaries();
        }
      })
    )
  }

  approveHero(id: number | string): void {
    this.updateUserData(id, 'isVerified', true);
  }

  search(): void {
    const budget = this.searchBudget.trim() ? Number(this.searchBudget) : undefined;
    const name = this.searchName.trim() ? this.searchName : undefined;

    if (!name && !budget) {
      this.getAllBeneficiaries();
    } else {
      this.subscription.add(this.beneficiaryService.searchBeneficiaries({ name, budget })
        .subscribe((data: any[]) => {
          this.beneficiaries = data;
        })
      )
    }
  }

  clearFilters(): void {
    this.searchName = '';
    this.searchBudget = '';
    this.getAllBeneficiaries();
  }

  viewProfile(user: any): void {
    this.dialogService.open(ProfileDialogComponent, {
      closable: true,
      dismissableMask: true,
      header: `${user.name}'s Profile`,
      width: '50%',
      data: { user }
    });
  }

}
