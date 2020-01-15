import { Component, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { DetailsStudentComponent } from './details-student/details-student.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  constructor(private studentService: StudentService, private modalService: NzModalService) { }
  mapOfExpandData: { [key: string]: boolean } = {};


  tplModal: NzModalRef;
  listStudent = [];
  listDataStudent = [];


  // tslint:disable-next-line: member-ordering
  searchValue = '';
  // tslint:disable-next-line: member-ordering
  sortName: string | null = null;
  // tslint:disable-next-line: member-ordering
  sortValue: string | null = null;
  // tslint:disable-next-line: member-ordering
  listOfFilterAddress = [{ text: 'London', value: 'London' }, { text: 'Sidney', value: 'Sidney' }];
  // tslint:disable-next-line: member-ordering
  listOfSearchAddress: string[] = [];

  // tslint:disable-next-line: member-ordering
  listOfData: Array<{ name: string; age: number; address: string;[key: string]: string | number }> = [
    {
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park'
    }
  ];
  listOfDisplayData = [...this.listOfData];

  ngOnInit() {
    // this.getFullImforStudent();
  }

  getFullImforStudent() {
    this.studentService.getFullImformationStudent().subscribe((result: any) => {
      this.listStudent = result.Data;
      console.log('SalesmanList', result.Data);

    });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    this.search();
  }

  filterAddressChange(value: string[]): void {
    this.listOfSearchAddress = value;
    this.search();
  }

  search(): void {
    const filterFunc = (item: { name: string; age: number; address: string }) => {
      return (
        (this.listOfSearchAddress.length
          ? this.listOfSearchAddress.some(address => item.address.indexOf(address) !== -1)
          : true) && item.name.indexOf(this.searchValue) !== -1
      );
    };
    const data = this.listOfData.filter((item: { name: string; age: number; address: string }) => filterFunc(item));
    this.listOfDisplayData = data.sort((a, b) =>
      this.sortValue === 'ascend'
        // tslint:disable-next-line: no-non-null-assertion
        ? a[this.sortName!] > b[this.sortName!]
          ? 1
          : -1
        // tslint:disable-next-line: no-non-null-assertion
        : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
    );
  }


  detailOutlets(dataOutlets: any) {
    console.log('data', dataOutlets);
    this.listDataStudent = dataOutlets;
    const modal = this.modalService.create({
      nzTitle: 'Thông Tin Thiếu Nhi',
      nzContent: DetailsStudentComponent,
      nzComponentParams: {
        studentdata: dataOutlets

      },
      // nzStyle: { width: '800px', height: '500px'},
      nzBodyStyle: { width: '800px'},
      nzWidth : '42%'
    });


  }

}
