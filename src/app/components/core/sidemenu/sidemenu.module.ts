import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidemenuComponent } from './sidemenu.component';
import { AntProviderModule } from 'src/app/ant-provider.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
@NgModule({
    declarations: [SidemenuComponent],
    imports: [
        CommonModule, AntProviderModule, BrowserModule, FormsModule, HttpClientModule, BrowserAnimationsModule, RouterModule
    ], exports: [SidemenuComponent]
})
export class SidemenuModule { }