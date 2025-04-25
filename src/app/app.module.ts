import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpLoadingService } from './interceptors/httpLoading/httpLoading.service';
import { GenericComponentsModule } from './genericComponents/generic-components.module';
import { HttpAuthService } from './interceptors/httpAuth/http-auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    GenericComponentsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoadingService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpAuthService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
