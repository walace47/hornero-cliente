import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { InterceptorTokenService } from './services/interceptor-token.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
  declarations: [ReadMoreComponent],
  imports: [
    CommonModule,
  ],
  exports:[ReadMoreComponent],
  providers:[
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorTokenService, multi: true}

  ]
})
export class UtilesModule { }
