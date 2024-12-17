import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lang-icon',
  standalone: true,
  imports: [],
  templateUrl: './lang-icon.component.html',
  styleUrls: ['./lang-icon.component.scss']
})
export class LangIconComponent implements OnInit {

  currentLang: string = '';

  constructor(
    private localizeRouterService: LocalizeRouterService,
    private router: Router,
    private translateService: TranslateService,
    @Inject(DOCUMENT) private dom: any
  ) { }

  ngOnInit(): void {
    this.currentLang = this.localizeRouterService.parser.currentLang;
  }

  setCurrentUrl(): void {
    const lang = this.currentLang == 'en' ? 'ar' : 'en';
    this.translateService.setDefaultLang(lang);
    let currentUrl: string = this.router.url.replace('/' + this.localizeRouterService.parser.currentLang, '');
    this.router.navigateByUrl(`${lang}${currentUrl}`);
    this.currentLang = lang;
    const htmlTag = this.dom.getElementsByTagName('html')[0] as HTMLHtmlElement;
    htmlTag.dir = lang == 'en' ? 'ltr' : 'rtl';
    htmlTag.lang = lang;
  }

}
