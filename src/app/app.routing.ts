import { RouterModule, Routes } from "@angular/router";

import { SwapComponent } from './components/paginas/blockly/swap/swap.component';
import { AuthGuardService } from "./modules/utiles/services/guards.service"
import { ROLES } from "./model/Rol";

const routes: Routes = [
    { path: "bloques/:idTorneo/:idToken", component: SwapComponent, canActivate: [AuthGuardService], data: { rol: ROLES.jugador } },
    { path: "**", pathMatch: "full", redirectTo: "/inicio" }
];

export const appRouting = RouterModule.forRoot(routes, { useHash: true });
