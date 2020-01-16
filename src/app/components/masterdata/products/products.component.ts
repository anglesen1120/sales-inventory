import { Component, OnInit } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  uploading = false;
  fileList : UploadFile[] = [];
  listOfData: ItemData[] = [];

  constructor(private http: HttpClient, private messenger : NzMessageService) { }

  beforUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  }

  handleUpload (){

  }

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
  }
  

}
