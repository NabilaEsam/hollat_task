import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LangIconComponent } from '../shared/components/lang-icon/lang-icon.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    RouterOutlet,
    LangIconComponent,
    ButtonModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
