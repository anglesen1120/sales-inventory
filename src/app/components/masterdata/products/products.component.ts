import { Component, OnInit } from '@angular/core';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import * as XLSX from "xlsx";
import { read } from 'fs';


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
  fileList: Array<string>=[];
  listOfData: ItemData[] = [];
  fileupload: UploadFile;
  arrayBuffer: any;
  datastring : any;
  storeData: any;  
  jsonData: any; 
  worksheet: any;
  fileUploaded: File; 

  constructor(private http: HttpClient, private messenger: NzMessageService) { }

  beforUpload(event) {
    this.fileList = event.target.files;
    const fileUploaded = event.target.files[0];



    console.log("test import");
    let workBook = null; 
    let jsonData = null;
    const reader = new FileReader();
    // File excel is this.fileUploaded
    reader.onload = (event) =>{
      const data = reader.result;
      console.log("data", data);
      workBook = XLSX.read(data, {type:"binary"});
      console.log("event", event);
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      //const dataString = JSON.stringify(jsonData);
      console.log("datastring", jsonData.Sheet1);
      this.listOfData = jsonData.Sheet1
    }
    reader.readAsBinaryString(fileUploaded);
    
    
  }

  handleUpload() {
    let a = 1;
    let b = 2;
    let c = a + b;
    console.log("datatest button", c);
    
    
    
    
  }

  readExcell (){
    // let readFile = new FileReader();
    // readFile.onload = (e) =>{
    //   this.storeData = readFile.result;
    //   console.log("test data import", this.storeData);
    //   var data = new Uint8Array(this.storeData);
    //   var arr = new Array();
    //   // for (var i=0; i =data.length; i++)
    //   // arr[i] = String.fromCharCode(data[i]);
    //   var bstr = arr.join("");
    //   var workbook = XLSX.read(bstr, {type:"binary"});
    //   var first_sheet_name = workbook.SheetNames[0];
    //   this.worksheet = workbook.SheetNames[first_sheet_name];
    // }
    // readFile.readAsArrayBuffer(this.fileUploaded);
    console.log("test import");
    let workBook = null; 
    let jsonData = null;
    const reader = new FileReader();
    // File excel is this.fileUploaded
    reader.onload = (event) =>{
      const data = reader.result;
      console.log("data", data);
      workBook = XLSX.read(data, {type:"binary"});
      console.log("event", event);

    }
  }

  handleChange(event) {
    
    
    //this.readExcell();
    console.log("test change", event);
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
