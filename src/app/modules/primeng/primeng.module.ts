import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {StepsModule} from 'primeng/steps';

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
import {TabMenuModule} from 'primeng/tabmenu';
import { HighlightJsModule } from 'ngx-highlight-js';
import {MegaMenuModule} from 'primeng/megamenu';
import {InputMaskModule} from 'primeng/inputmask';
import {SplitButtonModule} from 'primeng/splitbutton';
import {MultiSelectModule} from 'primeng/multiselect';
import { NotifierModule } from "angular-notifier";
import {EditorModule} from 'primeng/editor';
import {MenubarModule} from 'primeng/menubar';
import {SidebarModule} from 'primeng/sidebar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {TooltipModule} from 'primeng/tooltip';
import {AutoCompleteModule} from 'primeng/autocomplete';


import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
  declarations: [],
  imports: [
    TooltipModule,
    AutoCompleteModule,
    SidebarModule,
    OverlayPanelModule,
    MenubarModule,
    EditorModule,
    RadioButtonModule,
    StepsModule,
    NotifierModule,
    ConfirmDialogModule,
    MultiSelectModule,
    SplitButtonModule,
    MegaMenuModule,
    InputMaskModule,
    HighlightJsModule,
    FileUploadModule,
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
    TabMenuModule,
    TableModule,
    CardModule,
    ScrollPanelModule,
    PasswordModule
  ],
  exports:[
    TooltipModule,
    OverlayPanelModule,
    AutoCompleteModule,
    SidebarModule,
    MenubarModule,
    StepsModule,
    EditorModule,
    RadioButtonModule,
    ConfirmDialogModule,
    MultiSelectModule,
    SplitButtonModule,
    InputMaskModule,
    MegaMenuModule,
    HighlightJsModule,
    FileUploadModule,
    CalendarModule,
    NotifierModule,
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
