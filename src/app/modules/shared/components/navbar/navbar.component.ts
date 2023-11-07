import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LoginService } from 'src/app/modules/shared/service/login.service';
import { ThemeService } from '../../service/theme.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    items: MenuItem[];

    public display: boolean
    constructor(public loginService: LoginService, public themeService:ThemeService) {
        this.display = false;
    }

    private createCommonNavbar() {
        this.items = [
            {
                label: 'Zorzal',
                routerLink: ['/inicio']
            },
            {
                label: 'Torneo',
                items: [
                    {
                        label: 'Torneos',
                        routerLink: ['/torneos'],
                        icon: "pi pi-fw pi-search"
                    }
                ]
            },
            {
                label: 'Ayuda',
                routerLink: ['/ayuda']
            },
            {
                label: 'Acerca de',
                routerLink: ['about']
            },
            {
                label: 'Usuario',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Crear usuario',
                        icon: 'pi pi-fw pi-user-plus',
                        routerLink: ['/crear-usuario', 'nuevo']

                    },
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-user',
                        command: () => {
                            this.loginService.setDisplay(true)
                        },
                    }
                ]
            },
        ];
        if(this.themeService.isDark()){
            this.items = [...this.items, {
                icon:"pi pi-moon",
                command:() => {
                    this.themeService.switchToLight();
                    this.crearBarraNavbarItems()
                }
            }]
        }
        if(this.themeService.isLigth()){
            this.items = [...this.items, {
                icon:"pi pi-sun",
                command:() => {
                    console.log("cambiando a light")
                    this.themeService.switchToDark();
                    this.crearBarraNavbarItems()

                }
            }]
        }
    }
    private modifyloginNavbarItems() {
        this.items.splice(2, 0,
            {
                label: 'Stubs',
                routerLink: ['/stubs']
            })
        const usuarioItem = this.items.find(e => e.label.toLocaleLowerCase() === 'usuario');
        usuarioItem.items = [{
            label: 'Log out',
            icon: 'pi pi-fw pi-user',
            command: () => {
                this.loginService.logout();
            }
        }]
    }
    private modifyDocenteNavbarItems() {
        const torneoItem = this.items.find((e: MenuItem) => e.label.toLocaleLowerCase() === 'torneo')
        torneoItem?.items?.push({
            label: 'Crear Torneo',
            routerLink: ['/crear-torneo', '/nuevo']
        })

    }
    private modifyAdminNavbarItems() {
        this.items.splice(4, 0,
            {
                label: 'Problemas',
                routerLink: ['/problemas']
            })
        const usuarioItem = this.items.find(e => e.label.toLocaleLowerCase() === 'usuario');
        usuarioItem?.items.push(({
            label: 'Buscar usuarios',
            icon: "pi pi-fw pi-search",
            routerLink: ['/usuarios']
        }))
    }
    private crearBarraNavbarItems() {
        console.log("pase por aca")
        this.items = [];
        this.createCommonNavbar();
        if (this.loginService.isLogin()) {
            this.modifyloginNavbarItems()
        }
        if (this.loginService.isDocente()) {
            this.modifyDocenteNavbarItems()
        }
        if (this.loginService.isAdmin()) {
            this.modifyAdminNavbarItems()
        }
    }

    ngOnInit() {
        this.crearBarraNavbarItems();
        this.loginService.getLoginStateObservable().subscribe({
            next: () => this.crearBarraNavbarItems(),
            error: (e)=> console.log(e)
        })

    }
    mostrarLogin() {
        this.display = true;
        this.loginService.setDisplay(true)

    }
    cerrarDisplay(mensaje: string) {
        this.display = false
        this.loginService.setDisplay(false)
    }

}
