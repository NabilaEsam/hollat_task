import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BeneficiaresService {

  constructor(private dbService: NgxIndexedDBService) { }

  getAllBeneficiaries(): Observable<any[]> {
    return new Observable(observer => {
      this.dbService.getAll('users').subscribe((users: any[]) => {
        const beneficiaries = users.filter(user => user.role === 'Benificiary');
        observer.next(beneficiaries);
        observer.complete();
      });
    });
  }

  updateHero(id: number | string, key: string, value: any): Observable<any> {
    return new Observable((observer) => {
      this.dbService.getByKey('users', id)
        .subscribe((user: any) => {
          if (user) {
            user[key] = value;
            this.dbService.update('users', user).subscribe({
              next: (res: any) => {
                observer.next({ success: true });
                observer.complete();
              },
              error: (error: any) => {
                observer.error(error);
              },
            });
          } else {
            observer.error('Beneficiary not found');
          }
        });
    });
  }

  searchBeneficiaries(searchCriteria: { name?: string; budget?: number; }): Observable<any[]> {
    return new Observable((observer) => {
      this.getAllBeneficiaries().subscribe((beneficiaries: any[]) => {
        const { name, budget } = searchCriteria;

        const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
          const matchesName = name
            ? beneficiary.name.toLowerCase().includes(name.toLowerCase())
            : true;
          const matchesBudget = budget ? beneficiary.budget === budget : true;
          return matchesName && matchesBudget;
        });

        observer.next(filteredBeneficiaries);
        observer.complete();
      });
    });
  }
}
