import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AntProviderModule } from './ant-provider.module';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { SidemenuModule } from './components/core/sidemenu/sidemenu.module';
import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './library/alert/alert.service';
import { MaterialModule } from './material.module';
import { StudentService } from './services/student.service';
import { TransferHttp } from './modules/transfer-http/transfer-http';
import { FooterComponent } from './components/core/footer/footer.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent, FooterComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, AngularFireDatabaseModule,

    BrowserModule,
    AppRoutingModule,
    AntProviderModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, SidemenuModule, MaterialModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, AuthenticationService, AlertService, StudentService, TransferHttp],
  bootstrap: [AppComponent]
})
export class AppModule { }
