import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { TilesComponent } from './tiles/tiles.component';
import { ViewerComponent } from './viewer/viewer.component';
import { ImportComponent } from './import/import.component';

@NgModule({
  declarations: [
    AppComponent,
    TilesComponent,
    ViewerComponent,
    ImportComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
