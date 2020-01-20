import { Component, OnInit } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx";

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
  file : UploadFile;
  

  constructor(private http: HttpClient, private messenger : NzMessageService) { }

  beforUpload = (file): boolean => {
    this.fileList = this.fileList.concat(file);
    if(this.fileList.length >1)
    {
      this.messenger.info("Chỉ có thể chọn một file để import");
      

    }
    
    console.log("filename", file);
    console.log("file-list",this.fileList);
    return false;
  }

  handleUpload (){
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();


  }

  handleChange (file : UploadFile): void{
    console.log("file name",file.name);

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
