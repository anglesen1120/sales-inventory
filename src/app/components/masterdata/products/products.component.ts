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
  fileList: UploadFile[] = [];
  listOfData: ItemData[] = [];
  file: UploadFile;
  arrayBuffer: any;
  datastring : any;

  constructor(private http: HttpClient, private messenger: NzMessageService) { }

  beforUpload = (files): boolean => {
    let url = files.name;
    let oReq = new XMLHttpRequest();
    oReq.open("GET",url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(e){
      var arraybuffer = oReq.response;

      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");


      var workbook = XLSX.read(bstr, {type:"binary"});
      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
    }
    this.fileList = this.fileList.concat(files);
    if (this.fileList.length > 1) {
      this.messenger.info("Chỉ có thể chọn một file để import");


    } else {



    }


    console.log("filename", files);
    console.log("file-list", this.fileList);
    return false;
  }

  handleUpload() {
    let a = 1;
    let b = 2;
    let c = a + b;
    console.log("datatest button", c);
    const reader = new FileReader();
    var url = this.fileList[0].name;
    let jsonData = null;
    let oReq = new XMLHttpRequest();
    oReq.open("GET",url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(e){
      var arraybuffer = oReq.response;

      var data = new Uint8Array(arraybuffer);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");


      var workbook = XLSX.read(bstr, {type:"binary"});
      console.log("work book", workbook);
      /* DO SOMETHING WITH workbook HERE */
      var first_sheet_name = workbook.SheetNames[0];
      /* Get worksheet */
      var worksheet = workbook.Sheets[first_sheet_name];
      //console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
      // oReq.send();
      jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("Jsondata", jsonData);
      //reader.readAsBinaryString(this.fileList);

    }

    

    



  }

  handleChange(evt) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    // const file = ev.target.files[0];
    reader.onload = (event) => {
      console.log("event", event);
      const data = reader.result;
      console.log("data", data);
     
    }
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
