import { Component, OnInit, Optional, Inject, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Format } from 'src/app/library/format/format';
import * as moment from 'moment';


@Component({
  selector: 'app-details-student',
  templateUrl: './details-student.component.html',
  styleUrls: ['./details-student.component.css']
})
export class DetailsStudentComponent implements AfterViewInit, OnInit {
  @Input() studentdata: any;

  formEditStudent: FormGroup;
  dateFormat = 'yyyy/MM/dd';
  inputValue = 'my site';
  constructor(private modal: NzModalRef, private formBuilder: FormBuilder, ) {

  }

  ngOnInit() {
    console.log('datastudent', this.studentdata);
    this.formEditStudent = this.formBuilder.group({
      FirstName: [this.studentdata.FirstName === 0 ? '' : this.studentdata.FirstName, Validators.required],
      UserName: [this.studentdata.StudentName === 0 ? '' : this.studentdata.StudentName, Validators.required],
      FartherName: [this.studentdata.FirstName === 0 ? '' : this.studentdata.FartherName, Validators.required],
      MotherName: [this.studentdata.FartherName === 0 ? '' : this.studentdata.MotherName, Validators.required],
      BirthDay: [this.studentdata.DateBirthday === 0 ? '' : this.studentdata.DateBirthday, Validators.required],
      Class: [this.studentdata.ClassName === 0 ? '' : this.studentdata.ClassName, Validators.required],
      ClassGroup: [this.studentdata.ClassGroupName === 0 ? '' : this.studentdata.ClassGroupName, Validators.required],
      GiaoXu: [this.studentdata.ParishName === 0 ? '' : this.studentdata.ParishName, Validators.required],
      Address: [this.studentdata.Address === 0 ? '' : this.studentdata.Address, Validators.required],
      Phone: [this.studentdata.Phone === 0 ? '' : this.studentdata.Phone, Validators.required]

    });

  }

  ngAfterViewInit() {
    // console.log('datatest', this.student.listDataStudent);

  }

  destroyModal(): void {
    this.modal.destroy({ data: 'this the result data' });
  }

 


}
