import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {DataViewModule} from 'primeng/dataview';
import {PanelModule} from 'primeng/panel';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {PasswordModule} from 'primeng/password';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {ToastModule} from 'primeng/toast';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';


@NgModule({
  declarations: [],
  imports: [
    CalendarModule,
    InputTextareaModule,
    MessagesModule,
    ToastModule,
    MessageModule,
    CommonModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    TabViewModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    CardModule,
    ScrollPanelModule,
    PasswordModule
  ],
  exports:[
    CalendarModule,
    InputTextareaModule,
    ToastModule,
    MessagesModule,
    MessageModule,    
    PanelModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    TabViewModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ScrollPanelModule,
    PasswordModule,
    TableModule
  ]
})
export class PrimengModule { }
