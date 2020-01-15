import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AntProviderModule } from 'src/app/ant-provider.module';
import { StudentService } from 'src/app/services/student.service';
import { TransferHttp } from 'src/app/modules/transfer-http/transfer-http';
import { DetailsStudentComponent } from './details-student/details-student.component';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
    entryComponents: [DetailsStudentComponent],
    declarations: [DetailsStudentComponent, StudentComponent],
    
    imports: [CommonModule, StudentRoutingModule, ReactiveFormsModule, FormsModule, AntProviderModule, MaterialModule],

})


export class StudentModule { }
