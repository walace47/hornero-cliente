import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ThemeService{
    themes:string[] = ['vela-purple', "b-light-blue"]
    themeAplied:string = this.themes[0]

    constructor(@Inject(DOCUMENT) private document: Document) {
        let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
        const themeSaved = localStorage.getItem('theme')
        if(themeSaved){
            this.themeAplied = themeSaved
        }

        if (themeLink) {
            themeLink.href = this.themeAplied + '.css';
        }
    }

    isLigth(){
        return this.themeAplied === this.themes[1]
    }

    isDark(){
        return this.themeAplied === this.themes[0]
    }
    switchToDark(){
        this.applyTheme(this.themes[0])

    }
    switchToLight(){
        this.applyTheme(this.themes[1])
    }
    private applyTheme(theme:string){
        let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
        if (themeLink) {
            localStorage.setItem("theme", theme);
            this.themeAplied = theme;
            themeLink.href = theme + '.css';
        }

    }

}
