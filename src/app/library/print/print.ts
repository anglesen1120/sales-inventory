import { LocalStorageConfig } from "../clientconfig/localstorageconfig";
import { Format } from "../format/format";
import * as jsbarcode from 'jsbarcode';
import { String } from "../string/string";

export class Print {

  public static registrationPrint(ord: string, dataSource: any, customerInfo: any) {
    if (parseInt(ord) < 10)
      ord = "0" + ord;
    let user = LocalStorageConfig.GetUser(),
      total = 0;
    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser();
    let svg = `<svg class="barcode"></svg>`;

    let parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.getDatePrint(new Date());

    total = dataSource.reduce((prev, curr) => {
      //convert string kiểu "2,222" => string "2222"
      let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
        curr_number = curr.Price.toString().replace(regex, ''),
        //giá trị prev đầu tiên là object, những lần sau là giá trị đã cộng
        prev_number = prev.toString().replace(regex, '');
      //prev_number = typeof prev === 'object' ? prev.Price.toString().replace(regex, '') : prev.toString().replace(regex, '');
      //cộng số đã convert
      return parseInt(prev_number) + parseInt(curr_number);
    }, 0);

    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @page
        {
            size: auto;
            margin: 10mm 3mm 10mm 3mm;
        }
        .header {
            text-align:center;
            border-bottom: 2px solid #69a3d8;
        }
        .header .info-store {
            font-size: 11px;
        }
        .header .info-store p{
            font-size: 11px;
        }
        .header .info-store p,.header .info-store h3{
            margin:0;
        }
        .header .info-store p:last-child, .content-info p:last-child{
            margin-bottom:5px;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h3 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .content-service {
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #ccc;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 15px;
        }
        .content-info{
            line-height: 15px;
            margin-top: -15px;
        }
        .content-info h5{
            margin-bottom: 2px;
            text-transform: uppercase;
        }
        .right{
            text-align: right;
        }
        .text-center{
            text-align: center;
        }
        .content-service{
            padding-top:20px;
        }
        .content-service .row{
            display: flex;
            font-style: italic;
            word-break: break-all;
            line-height:0.5;
            margin-top:-20px;
        }
        .service_name{
            width:75%;
            word-break: break-all;
            line-height: 1;
        }
        .service_price{
            margin-top:18px;
            width: 25%;
            text-align: right;
            display:block;
        }
        .total p{
            font-size:15px;
            font-weight: bold;
            word-break: break-all;
        }
        .svg{
            margin-top: 15px;
        }
        .content-info p{
            font-size:11px;
            margin-top:2px;
            margin-bottom:2px;
        }
        .header .img img{
            width:150px;
            height:40px;
        }
        .header .info-store h3{
            text-transform: uppercase;
        }
        .date{
            margin-top: -10px;
            margin-bottom: -10px;
            font-size:11px;
        }
        .ord {
            font-size:45px;
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h3>PHIẾU THU</h3>
    </div>
    <p class="date">THỜI GIAN: ${date}</p>
    <div class="content-info">
            <h5>KH: ${customerInfo.FullName}</h5>
            <p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p>
            <p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p>
            <p>SĐT: ${customerInfo.Phone1}</p>
            <p>ĐC: ${customerInfo.Address} ${customerInfo.DistrictName} ${customerInfo.ProvinceName}</p>
    </div>
    <div class="content-service">
       ${dataSource.map((item, i) => `
          <div class="row">
            <p class="service_name"> ${i + 1}. ${item.DetailName}</p>
            <p class="service_price">${String.FormatInputNumber(item.Price)}</p>
          </div>
        `.trim()).join('')}
    </div>
    <div class="total right"><p>Tổng: ${String.FormatInputNumber(total)}</p></div>
  <div class="text-center ord"><span>STT : ${ord}</span></div>
  <div class="text-center svg">${svgHtml}</div>
</body>
</html>

`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static printPrescription(subjectData: any, dataSource: any) {
    
    let user = LocalStorageConfig.GetUser();
    let examination = Format.addDays(new Date(), parseInt(subjectData.Examination));
    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser();
    let svg = `<svg class="barcode"></svg>`;

    let parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], subjectData.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.formatDDMMYYY(new Date());
    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
       .header {
            text-align: center;
            border-bottom: 2px solid #69a3d8;
            display: flex;
            height: 80px;
            padding: 0 0 20px 0;
        }
        .header .img {
            width: 30%;
            text-align: left;
        }
        .header .img img {
            width:100%;
            height: 100%;
        }
        .header .info-store {
            line-height: 2px;
            font-size: 14px;
            text-align: right;
            width: 70%;
        }
        .header .info-store h3{
            text-transform: uppercase;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h1 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .left h3{
            text-transform: uppercase;
        }
        .content-service {
            border-bottom: 1px dotted #69a3d8;
            border-top: 1px dotted #69a3d8;
        }
        .item_name{
		      width: 80%;
			    font-weight: bold;
          word-break: break-all;
          line-height: 15px;
		    }
		    .unit_name{
			    text-align: right;
			    width: 20%;
          line-height: 15px;
		    }
		    .item_use,.item_note{
			    font-style: italic;
		    }
        .m-5 p{
          margin-top:5px;
		    }
        .flex{
			    display: flex;
		    }
		    .flex .left{
			    width: 50%;
		    }
        .flex .center{
			    width: 25%;
		    }
        .flex .right{
			    width: 25%;
		    }
        .flex p, .flex h3{
          margin: 0;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
        }
        .content-info h3{
            margin-bottom: 2px;
            margin-top: 2px;
        }
        .right{
            text-align: right;
        }
        @page  
        { 
            size: auto;
            margin: 15mm 15mm 15mm 15mm;  
        }
        .text-center{
            text-align: center;
        }
        .content-service .row{
            display: flex;
        }
        .content-service{
            line-height: 0;
        }
        
        .service_name{
            width:80%;
        }
        .service_price{
            width: 20%;
            text-align: right;
        }
        .content-bottom{
			    display:flex;
          margin-top: 5px;
		    }
		    .content-bottom .left{
			    width:60%;
			    position: relative;
		    }
		    .content-bottom .left .bottom{
			    position: absolute;
			    bottom: 0;
		    }
		    .content-bottom .right h3{
			    margin-top: 100px;
		    }
		    .content-bottom .right{
			    width:40%;
		    }
        .float_right{float:right;}
        .content-info p, .content-service p, .content-bottom p{
            font-size: 15px;
        }
        .top h3, .top p{margin:2px;}
        .svg{margin-top:10px;}
        .first{width:300px;}
        .second{
            margin-left: 20px;
        }
        .examination{
            text-decoration: underline;
        }
        .icdcode{
          font-weight: bold;
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h1>TOA THUỐC</h1>
    </div>
    <div class="content-info">
      <div class="flex">
        <div class="left"><h3>KH: ${subjectData.FullName}</h3></div>
        <div class="center"><p>Giới tính: ${subjectData.Sex == 1 ? 'Nam' : 'Nữ'}</p></div>
        <div class="right"><p>Ngày sinh: ${Format.formatDDMMYYY(subjectData.Birthday)}</p></div>
      </div>
      <p>ĐC: ${subjectData.Address} </p>
      <p class="icdcode">Chẩn đoán: ${subjectData.ICDCode} - ${subjectData.ICDCodeName} </p>
    </div>
    <div class="content-service">
       ${dataSource.data.map((item, i) => `
          <div class="row">
            <p class="item_name"> ${i + 1}. ${item.ItemName}</p>
            <p class="unit_name">${item.Quantity} ${item.UnitName}</p>
          </div>
          <div class="row m-5">
            <p class="item_use first">- ${item.TimeUse}: ${item.QuantityPerUse} ${item.UnitName} (${item.UserUsing})</p><p class="second">- Cách dùng: ${item.ItemUsing}</p>
          </div>
          <div class="row m-5">
            <p class="item_note">- Lời dặn: ${item.Note != null ? item.Note : ''}</p>
          </div>
        `.trim()).join('')}
    </div>
    <div class="content-bottom">
		  <div class="left">
			  <div class="top">
				  <p>Lời dặn: <span>${subjectData.Advice}</span></p>
				  <p class="examination">Ngày tái khám: ${examination}</span></p><span>
			  </div>
        <div class="svg">${svgHtml}</div>
			  <div class="bottom">
				  <span>Khi tái khám nhớ mang theo giấy tờ liên quan</span>
			  </div>
		  </div>
		  <div class="right">
			  <p>Ngày ${Format.getDD(new Date())} tháng ${Format.getMM(new Date())} năm ${Format.getYYYY(new Date())}</p>
        <h3>${user.Data.Position}</h3>
		  </div>
	  </div>
</body>
</html>


`;
    //<h3>${user.Data.Position}. ${user.Data.FullName}</h3>
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static paymentPrintConfigGroup(ord: string, isGroupService: boolean, showPrice: boolean, dataSource: any, customerInfo: any, totalGroup) {
    if (parseInt(ord) < 10)
      ord = "0" + ord;
    let displayShowPrice: string = "block",
      displayShowDetailPrice: string = "",
      marginTop: string = "15px",
      user = LocalStorageConfig.GetUser(),
      total = 0;
    if (isGroupService) {
      displayShowDetailPrice = "hidden-price";
      total = totalGroup;
    }
    else {
      //in service
      dataSource;
      if (!showPrice) {
        //k show price
        displayShowPrice = "none";
        marginTop = "15px";
      }
    }
    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser();
    let svg = `<svg class="barcode"></svg>`;

    let parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.getDatePrint(new Date());
    if (!isGroupService) {
      total = dataSource.reduce((prev, curr) => {
        //convert string kiểu "2,222" => string "2222"
        let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
          curr_number = curr.Price.toString().replace(regex, ''),
          //giá trị prev đầu tiên là object, những lần sau là giá trị đã cộng
          prev_number = prev.toString().replace(regex, '');
        //prev_number = typeof prev === 'object' ? prev.Price.toString().replace(regex, '') : prev.toString().replace(regex, '');
        //cộng số đã convert
        return parseInt(prev_number) + parseInt(curr_number);
      }, 0);
    }

    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @page  
        { 
            size: auto;
            margin: 10mm 3mm 10mm 3mm;  
        }
        .header {
            text-align:center;
            border-bottom: 2px solid #69a3d8;
        }
        .header .info-store {
            font-size: 12px;
        }
        .header .info-store p{
            font-size: 11px;
        }
        .header .info-store p,.header .info-store h3{
            margin:0;
        }
        .header .info-store p:last-child, .content-info p:last-child{
            margin-bottom:5px;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h3 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .content-service {
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #ccc;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 15px;
        }
        .content-info{
            line-height: 15px;
            margin-top: -15px;
        }
        .content-info h5{
            margin-bottom: 2px;
            text-transform: uppercase;
        }
        .right{
            text-align: right;
        }
        .text-center{
            text-align: center;
        }
        .content-service .row{
            display: flex;
            font-style: italic;
            word-break: break-all;
            line-height:0.5;
            margin-top:-20px;
        }
        .content-service{
            padding-top:20px;
        }
        .service_name{
            width:75%;
            word-break: break-all;
            line-height: 1;
        }
        .service_price{
            margin-top:18px;
            width: 25%;
            text-align: right;
            display:${displayShowPrice};
        }
        .total{
            display:${displayShowPrice};
            
        }
        .total p{
            font-size:15px;
            font-weight: bold;
            word-break: break-all
        }
        .svg{
            margin-top:${marginTop};
        }
        .content-info p{
            font-size:11px;
            margin-top:2px;
            margin-bottom:2px;
        }
        .header .img img{
            width:150px;
            height:40px;
        }
        .header .info-store h3{
            text-transform: uppercase;
        }
        .hidden-price{
            display: none;
        }
        .date{
            margin-top: -10px;
            margin-bottom: -10px;
            font-size:11px;
        }
        .ord {
            font-size:45px;
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h3>PHIẾU THU</h3>
    </div>
    <p class="date">THỜI GIAN: ${date}</p>
    <div class="content-info">
            <h5>KH: ${customerInfo.FullName}</h5>
            <p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p>
            <p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p>
            <p>ĐC: ${customerInfo.Address} </p>
    </div>
    <div class="content-service">
       ${dataSource.map((item, i) => `
          <div class="row">
            <p class="service_name"> ${i + 1}. ${item.DetailName}</p>
            <p class="service_price ${displayShowDetailPrice}">${String.FormatInputNumber(item.Price)}</p>
          </div>
        `.trim()).join('')}
    </div>
    <div class="total right"><p>Tổng: ${String.FormatInputNumber(total)}</p></div>
    <div class="text-center ord"><span>STT : ${ord}</span></div>
    <div class="text-center svg">${svgHtml}</div>
  
</body>
</html>


`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static paymentPrintConfig(ord: string, isGroupService: boolean, showPrice: boolean, dataSource: any, customerInfo: any, totalGroup) {
    if (parseInt(ord) < 10)
      ord = "0" + ord;
    let displayShowPrice: string = "block",
      displayShowDetailPrice: string = "",
      marginTop: string = "15px",
      className="",
      user = LocalStorageConfig.GetUser(),
      total = 0;
    if (isGroupService) {
      dataSource.map((x: any) => x.DetailName = x.GroupDetailName);
      displayShowDetailPrice = "hidden-price";
      total = totalGroup;
      className = "isGroup";
    }
    else {
      //in service
      dataSource;
      if (!showPrice) {
        //k show price
        displayShowPrice = "none";
        marginTop = "15px";
      }
    }
    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser();
    let svg = `<svg class="barcode"></svg>`;

    let parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.getDatePrint(new Date());
    if (!isGroupService) {
      total = dataSource.reduce((prev, curr) => {
        //convert string kiểu "2,222" => string "2222"
        let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
          curr_number = curr.Price.toString().replace(regex, ''),
          //giá trị prev đầu tiên là object, những lần sau là giá trị đã cộng
          prev_number = prev.toString().replace(regex, '');
        //prev_number = typeof prev === 'object' ? prev.Price.toString().replace(regex, '') : prev.toString().replace(regex, '');
        //cộng số đã convert
        return parseInt(prev_number) + parseInt(curr_number);
      }, 0);
    }

    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @page  
        { 
            size: auto;
            margin: 10mm 3mm 10mm 3mm;  
        }
        .header {
            text-align:center;
            border-bottom: 2px solid #69a3d8;
        }
        .header .info-store {
            font-size: 11px;
        }
        .header .info-store p,.header .info-store h3{
            margin:0;
        }
        .header .info-store p:last-child, .content-info p:last-child{
            margin-bottom:5px;
        }
        .header .info-store p{
            font-size: 11px;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h3 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .content-service {
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #ccc;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 15px;
        }
        .content-info{
            line-height: 15px;
            margin-top: -15px;
        }
        .content-info h5{
            margin-bottom: 2px;
            text-transform: uppercase;
        }
        .right{
            text-align: right;
        }
        .text-center{
            text-align: center;
        }
        .content-service .row{
            display: flex;
            font-style: italic;
            word-break: break-all;
            line-height:0.5;
            margin-top:-20px;
        }
        .content-service{
            padding-top:20px;
        }
        .service_name{
            width:75%;
            word-break: break-all;
            line-height: 1;
        }
        .service_price{
            margin-top:18px;
            width: 25%;
            text-align: right;
            display:${displayShowPrice};
        }
        .total{
            display:${displayShowPrice};
            
        }
        .total p{
            font-size:15px;
            font-weight: bold;
            word-break: break-all
        }
        .svg{
            margin-top:${marginTop};
        }
        .content-info p{
            font-size:11px;
            margin-top:2px;
            margin-bottom:2px;
        }
        .header .img img{
            width:150px;
            height:40px;
        }
        .header .info-store h3{
            text-transform: uppercase;
        }
        .hidden-price{
            display: none;
        }
        .isGroup .service_name{
            width: 100%;
        }
        .date{
            margin-top: -10px;
            margin-bottom: -10px;
            font-size:11px;
        }
        .ord {
            font-size:45px;
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h3>PHIẾU THU</h3>
    </div>
    <p class="date">THỜI GIAN: ${date}</p>
    <div class="content-info">
            <h5>KH: ${customerInfo.FullName}</h5>
            <p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p>
            <p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p>
            <p>ĐC: ${customerInfo.Address} </p>
    </div>
    <div class="content-service">
       ${dataSource.map((item, i) => `
          <div class="row ${className}">
            <p class="service_name"> ${i + 1}. ${item.DetailName}</p>
            <p class="service_price ${displayShowDetailPrice}">${String.FormatInputNumber(item.Price)}</p>
          </div>
        `.trim()).join('')}
    </div>
    <div class="total right"><p>Tổng: ${String.FormatInputNumber(total)}</p></div>
    <div class="text-center ord"><span>STT : ${ord}</span></div>
    <div class="text-center svg">${svgHtml}</div>
</body>
</html>


`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static printChooseService(dataSource: any, customerInfo: any, title: any, groupServiceName: string = "") {
    let displayShowGroup: string = "none",
      groupServiceClass = "";
    if (groupServiceName != "") {
      groupServiceClass = "group-service_item";
      displayShowGroup = "unset";
    }
    let user = LocalStorageConfig.GetUser();
    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser(),
      svg = `<svg class="barcode"></svg>`,
      parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.formatDDMMYYY(new Date());
    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
       .header {
            text-align: center;
            border-bottom: 2px solid #69a3d8;
            display: flex;
            height: 80px;
            padding: 0 0 20px 0;
        }
        .header .img {
            width: 30%;
            text-align: left;
        }
        .header .img img {
            height: 100%;
            width: 100%;
        }
        .header .info-store {
            line-height: 2px;
            font-size: 14px;
            text-align: right;
            width: 70%;
        }
       .header .info-store h3{
            text-transform: uppercase;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h1 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .left h3{
            text-transform: uppercase;
        }
        .content-service {
            border-bottom: 1px dotted #69a3d8;
            border-top: 1px dotted #69a3d8;
        }
        .item_name{
		        width: 80%;
			      font-weight: bold;
            word-break: break-all;
		    }
		    .unit_name{
			    text-align: right;
			    width: 20%;
		    }
		    .item_use,.item_note{
			    font-style: italic;
		    }
        .m-5 p{
          margin-top:5px;
		    }
        .flex{
			    display: flex;
		    }
		    .flex .left{
			    width: 50%;
		    }
        .flex .center{
			    width: 25%;
		    }
        .flex .right{
			    width: 25%;
		    }
        .flex p, .flex h3{
          margin: 0;
        }
       .footer {
            width: 100%;
            text-align: right;
            line-height: 8px;
        }

        .footer p {
            text-align: right;
            font-size: 15px;
        }

        .footer p:nth-child(2) {
            margin-right: 55px;
        }

        .footer h3 {
            margin-top: 100px;
        }
        .info-store p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
        }
        .content-info h3{
            margin-bottom: 2px;
            margin-top: 2px;
        }
        .right{
            text-align: right;
        }
        @page  
        { 
            size: auto;
            margin: 15mm 15mm 15mm 15mm;  
        }
        .text-center{
            text-align: center;
        }
        .item_name{
            line-height: 5px;
        }
        .content-info p, .content-service p{
            font-size: 15px;
        }
        .svg{margin-top:10px;}
        .group-service_item{
            padding-left:30px;
        }
        .group-service_name{
            display: ${displayShowGroup};
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h1>${title}</h1>
    </div>
    <div class="content-info">
      <div class="flex">
        <div class="left"><h3>KH: ${customerInfo.FullName}</h3></div>
        <div class="center"><p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p></div>
        <div class="right"><p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p></div>
      </div>
      <p>ĐC: ${customerInfo.Address} </p>
    </div>
    <div class="content-service">
      <h3 class="group-service_name">${groupServiceName}</h3>
        ${dataSource.map((item, i) => `
            <p class="item_name ${groupServiceClass}"> ${i + 1}. ${item.DetailName}</p>
        `.trim()).join('')}
    </div>
    <div class="footer">
        <p>Ngày ${Format.getDD(new Date())} tháng ${Format.getMM(new Date())} năm ${Format.getYYYY(new Date())}</p>
        <h3>${user.Data.Position}</h3>
    </div>
    <div class="text-center">${svgHtml}</div>
</body>
</html>


`;
    // <h3>${user.Data.Position}.${user.Data.FullName}</h3>
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static secretaryRePrintGroupServiceConfig(showPrice: boolean, dataSource: any, customerInfo: any, title: any) {
    let displayShowPrice: string = "unset",
      marginTop: string = "0",
      service_name: string = "80%",
      user = LocalStorageConfig.GetUser(),
      total: number = 0;
    total = dataSource.reduce((prev, curr) => {
      //convert string kiểu "2,222" => string "2222"
      let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
        curr_number = curr.AmountPaid.toString().replace(regex, ''),
        //giá trị prev đầu tiên là object, những lần sau là giá trị đã cộng
        prev_number = prev.toString().replace(regex, '');
      //prev_number = typeof prev === 'object' ? prev.Price.toString().replace(regex, '') : prev.toString().replace(regex, '');
      //cộng số đã convert
      return parseInt(prev_number) + parseInt(curr_number);
    }, 0);

    //in groupService
    if (!showPrice) {
      //k show price
      displayShowPrice = "none";
      marginTop = "15px";
    }

    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser();
    let svg = `<svg class="barcode"></svg>`;

    let parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.formatDDMMYYY(new Date());

    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @page  
        { 
            size: auto;
            margin: 10mm 3mm 10mm 3mm;  
        }
        .header {
            text-align:center;
            border-bottom: 2px solid #69a3d8;
        }
        .header .info-store {
            font-size: 12px;
        }
        .header .info-store p, .header .info-store h3, .content-info p, .content-service .row p{
            margin:0;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h3 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .content-service {
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #ccc;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
            margin-bottom:5px;
        }
        .content-info h5{
            margin-bottom: 2px;
            margin-top: 0;
            text-transform: uppercase;
        }
        .right{
            text-align: right;
        }
        .text-center{
            text-align: center;
        }
        .content-service .row{
            display: flex;
            padding:5px 0;
            font-weight: bold;
        }
        .service_name{
            width:${service_name};
        }
        .service_price{
            width: 20%;
            text-align: right;
            display:${displayShowPrice};
        }
        .total{
          display:${displayShowPrice};
        }
        .total p{
            font-size:25px;
            font-weight: bold;
            word-break: break-all
        }
        .svg{
          margin-top:${marginTop};
        }
        .item_magin-left{
            margin-left:15px;
        }
.content-service .row h5{
margin: 0;
}
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/logo-falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h3>${title}</h3>
    </div>
    <div class="content-info">
            <h5>KH: ${customerInfo.FullName}</h5>
            <p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p>
            <p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p>
            <p>ĐC: ${customerInfo.Address} </p>
    </div>
    <div class="content-service">
        ${dataSource.map((item, i) => `
          <div class="row">
            <h5 class="service_name"> ${i + 1}. ${item.GroupServiceName}</h5>
            <h5 class="service_price">${String.FormatInputNumber(item.AmountPaid)}</h5>
          </div>

            ${item.RequestGroupServiceDetailList.map((item1, i) => `
              <div class="row item_magin-left">
                <p class="service_name"> ${i + 1}. ${item1.GroupDetailName}</p>
              </div>
            `.trim()).join('')}

        `.trim()).join('')}
      
    </div>
    <div class="total right"><p>Tổng: ${String.FormatInputNumber(total)}</p></div>
  <div class="text-center svg">${svgHtml}</div>
  <div class="right"><label>${date}</label></div>
</body>
</html>


`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static rePrintConfig(isGroupService: boolean, showPrice: boolean, dataSource: any, customerInfo: any, title: any, totalGroup: any = 0, groupServiceName: any = "") {
    let displayShowPrice: string = "unset",
      displayShowName: string = "unset",
      marginTop: string = "0",
      class_margin: string = "",
      service_name:string= "80%",
      user = LocalStorageConfig.GetUser(),
      total = 0;
    if (isGroupService) {
      debugger
      dataSource.map((x: any) => {
        x.DetailName = x.GroupDetailName;
      });
      //in groupService
      if (!showPrice) {
        //k show price
        displayShowPrice = "none";
        marginTop = "15px";
      }
      if (groupServiceName == "")
        displayShowName = "none";
      total = totalGroup;
      class_margin = "item_magin-left";
      service_name = "100%";
    }
    else {
      //in service
      if (!showPrice) {
        //k show price
        displayShowPrice = "none";
        marginTop = "15px";
      }
    }
    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser();
    let svg = `<svg class="barcode"></svg>`;

    let parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.formatDDMMYYY(new Date());

    if (!isGroupService) {
      total = dataSource.reduce((prev, curr) => {
        //convert string kiểu "2,222" => string "2222"
        let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
          curr_number = curr.Price.toString().replace(regex, ''),
          //giá trị prev đầu tiên là object, những lần sau là giá trị đã cộng
          prev_number = prev.toString().replace(regex, '');
        //prev_number = typeof prev === 'object' ? prev.Price.toString().replace(regex, '') : prev.toString().replace(regex, '');
        //cộng số đã convert
        return parseInt(prev_number) + parseInt(curr_number);
      }, 0);
    }

    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @page  
        { 
            size: auto;
            margin: 10mm 3mm 10mm 3mm;  
        }
        .header {
            text-align:center;
            border-bottom: 2px solid #69a3d8;
        }
        .header .info-store {
            font-size: 12px;
        }
        .header .info-store p, .header .info-store h3, .content-info p, .content-service .row p{
            margin:0;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h3 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .content-service {
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #ccc;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
            margin-bottom:5px;
        }
        .content-info h5{
            margin-bottom: 2px;
            margin-top: 0;
            text-transform: uppercase;
        }
        .right{
            text-align: right;
        }
        .text-center{
            text-align: center;
        }
        .content-service .row{
            display: flex;
            padding:5px 0;
            font-weight: bold;
        }
        .service_name{
            width:${service_name};
        }
        .service_price{
            width: 20%;
            text-align: right;
            display:${displayShowPrice};
        }
        .total{
          display:${displayShowPrice};
        }
        .total p{
            font-size:25px;
            font-weight: bold;
            word-break: break-all
        }
        .svg{
          margin-top:${marginTop};
        }
        .item_magin-left{
            margin-left:15px;
        }
        .content-service h4{
            display:${displayShowName};
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/logo-falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h3>${title}</h3>
    </div>
    <div class="content-info">
            <h5>KH: ${customerInfo.FullName}</h5>
            <p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p>
            <p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p>
            <p>ĐC: ${customerInfo.Address} </p>
    </div>
    <div class="content-service">
      <h4>${groupServiceName}</h4>
       ${dataSource.map((item, i) => `
          <div class="row ${class_margin}">
            <p class="service_name"> ${i + 1}. ${item.DetailName}</p>
            <p class="service_price">${String.FormatInputNumber(item.Price)}</p>
          </div>
        `.trim()).join('')}
    </div>
    <div class="total right"><p>Tổng: ${String.FormatInputNumber(total)}</p></div>
  <div class="text-center svg">${svgHtml}</div>
  <div class="right"><label>${date}</label></div>
</body>
</html>


`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static doctorRePrintConfig(isGroupService: boolean, showPrice: boolean, dataSource: any, customerInfo: any, title: any, totalGroup: any = 0, groupServiceName: any = "") {
    let displayShowPrice: string = "block",
      displayShowName: string = "block",
      class_margin: string ="",
      marginTop: string = "0",
      user = LocalStorageConfig.GetUser(),
      total = 0;

    if (groupServiceName == "")
      displayShowName = "none";

    if (isGroupService) {
      dataSource.map((x: any) => {
        x.DetailName = x.GroupDetailName;
      });
      //print groupService
      if (!showPrice) {
        //k show price
        displayShowPrice = "none";
        marginTop = "15px";
      }
      
      total = totalGroup;
      class_margin = "item_magin-left";
    }
    else {
      //print service
      if (!showPrice) {
        //k show price
        marginTop = "15px";
      }
    }
    if (!isGroupService) {
      total = dataSource.reduce((prev, curr) => {
        //convert string kiểu "2,222" => string "2222"
        let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
          curr_number = curr.Price.toString().replace(regex, ''),
          //giá trị prev đầu tiên là object, những lần sau là giá trị đã cộng
          prev_number = prev.toString().replace(regex, '');
        //prev_number = typeof prev === 'object' ? prev.Price.toString().replace(regex, '') : prev.toString().replace(regex, '');
        //cộng số đã convert
        return parseInt(prev_number) + parseInt(curr_number);
      }, 0);
    }
      
    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser(),
      svg = `<svg class="barcode"></svg>`,
      parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.formatDDMMYYY(new Date());
    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
       .header {
            text-align: center;
            border-bottom: 2px solid #69a3d8;
            display: flex;
            height: 80px;
            padding: 0 0 20px 0;
        }
        .header .img {
            width: 30%;
            text-align: left;
        }
        .header .img img {
            height: 100%;
            width: 100%;
        }
        .header .info-store {
            line-height: 2px;
            font-size: 14px;
            text-align: right;
            width: 70%;
        }
       .header .info-store h3{
            text-transform: uppercase;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h1 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .left h3{
            text-transform: uppercase;
        }
        .content-service {
            border-bottom: 1px dotted #69a3d8;
            border-top: 1px dotted #69a3d8;
                }
        .content-service .row{
            display: flex;
            font-weight: bold;
            word-break: break-all
        }
        .item_name{
		        width: 80%;
			      font-weight: bold;
            word-break: break-all;
		    }
		    .unit_name{
			    text-align: right;
			    width: 20%;
		    }
		    .item_use,.item_note{
			    font-style: italic;
		    }
        .m-5 p{
          margin-top:5px;
		    }
        .flex{
			    display: flex;
		    }
		    .flex .left{
			    width: 50%;
		    }
        .flex .center{
			    width: 25%;
		    }
        .flex .right{
			    width: 25%;
		    }
        .flex p, .flex h3{
          margin: 0;
        }
       .footer {
            width: 100%;
            text-align: right;
            line-height: 8px;
        }

        .footer p {
            text-align: right;
            font-size: 15px;
        }

        .footer p:nth-child(2) {
            margin-right: 55px;
        }

        .footer h3 {
            margin-top: 100px;
        }
        .info-store p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
        }
        .content-info h3{
            margin-bottom: 2px;
            margin-top: 2px;
        }
        .right{
            text-align: right;
        }
        @page  
        { 
            size: auto;
            margin: 15mm 15mm 15mm 15mm;  
        }
        .text-center{
            text-align: center;
        }
        .item_name{
            line-height: 5px;
        }
        .content-info p, .content-service p{
            font-size: 15px;
        }
        .content-service p{
            margin: 5px 0;
        }
        .svg{margin-top:10px;}
        .service_name{
            width:80%;
        }
        .service_price{
            width: 20%;
            text-align: right;
            display:${displayShowPrice};
        }
        .total{
          display:${displayShowPrice};
        }
        .total p{
            font-size:25px;
            font-weight: bold;
            word-break: break-all
        }
        .group-service_item{
            padding-left:30px;
        }
        .content-service h3{
            display:${displayShowName};
            margin-bottom: 0;
        }
        .item_magin-left{
            margin-left:30px;
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h1>${title}</h1>
    </div>
    <div class="content-info">
      <div class="flex">
        <div class="left"><h3>KH: ${customerInfo.FullName}</h3></div>
        <div class="center"><p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p></div>
        <div class="right"><p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p></div>
      </div>
      <p>ĐC: ${customerInfo.Address} </p>
    </div>
    <div class="content-service">
      <h3>${groupServiceName}</h3>
       ${dataSource.map((item, i) => `
          <div class="row ${class_margin}">
            <p class="service_name"> ${i + 1}. ${item.DetailName}</p>
            <p class="service_price">${String.FormatInputNumber(item.Price)}</p>
          </div>
        `.trim()).join('')}
    </div>
    <div class="total right"><p>Tổng: ${String.FormatInputNumber(total)}</p></div>
  <div class="text-center svg">${svgHtml}</div>
  <div class="right"><label>${date}</label></div>
</body>
</html>


`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static printMedicaRecord(dataSourceService: any, dataSourcePrescription: any, customerInfo: any) {
    let user = LocalStorageConfig.GetUser();
    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
       .header {
            text-align: center;
            border-bottom: 2px solid #69a3d8;
            display: flex;
            height: 80px;
            padding: 0 0 20px 0;
        }
        .header .img {
            width: 30%;
            text-align: left;
        }
        .header .img img {
            width:100%;
            height: 100%;
        }
        .header .info-store {
            line-height: 2px;
            font-size: 14px;
            text-align: right;
            width: 70%;
        }
        .header .info-store h3{
            text-transform: uppercase;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h1 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .left h3{
            text-transform: uppercase;
        }
        .item_name{
		      width: 80%;
			    font-weight: bold;
          word-break: break-all;
          line-height: 15px;
		    }
		    .unit_name{
			    text-align: right;
			    width: 20%;
          line-height: 15px;
		    }
		    .item_use,.item_note{
			    font-style: italic;
		    }
        .m-5 p{
          margin-top:5px;
		    }
        .flex{
			    display: flex;
		    }
		    .flex .left{
			    width: 50%;
		    }
        .flex .center{
			    width: 25%;
		    }
        .flex .right{
			    width: 25%;
		    }
        .flex h3{
          margin: 0;
        }
        .flex p{
          margin: 5px 0;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
        }
        .content-info h3{
            margin-bottom: 2px;
            margin-top: 2px;
        }
        .right{
            text-align: right;
        }
        @page  
        { 
            size: auto;
            margin: 15mm 15mm 15mm 15mm;  
        }
        .text-center{
            text-align: center;
        }
        .content-service .row,
        .content-prescription .row{
            display: flex;
        }
        
        .service_name{
            width:50%;
        }
        .service_result{
            width: 50%;
        }
        
        .float_right{float:right;}

        .content-reasons p,
        .content-medical_history p,
        .content-biometric p,
        .content-service p,
        .content-examination p,
        .content-diagnose p,
        .content-prescription p{
            font-size: 15px;
            margin: 2px 0;
        }
        .content-info p{
            font-size: 15px;
        }
        .content-reasons,
        .content-medical_history,
        .content-biometric,
        .content-service,
        .content-examination,
        .content-diagnose,
        .content-prescription{
            margin-top: 3px;
        }
        .content-reasons h3,
        .content-medical_history h3,
        .content-biometric h3,
        .content-service h3,
        .content-examination h3,
        .content-diagnose h3,
        .content-prescription h3{
            margin: 0;
        }
        .content-prescription .col-12,
        .content-prescription h3{
            margin-bottom: -20px;
        }
        .top h3, .top p{margin:2px;}
        .svg{margin-top:10px;}
        .first{width:300px;}
        .second{
            margin-left: 20px;
        }
        .examination{
            text-decoration: underline;
        }
        .icdcode{
            font-weight: bold;
        }
        .title-group {
            text-decoration: underline;
        }
        .col-1 {
            width: 8.33333333%;
        }
        .col-2 {
            width: 16.66666667%;
        }
       .col-3 {
            width: 25%;
        }
        .col-4 {
            width: 33.33333333%;
        }
        .col-auto {
            width: 20%;
        }
        .col-6 {
            width: 50%;
        }
        .col-12 {
            width: 100%;
        }
        .col-qty {
            width: 6.33333333%;
        }
        .col-time_use {
            width: 18.666667%;
        }
        .text-left{
            text-align: left;
        }
        .text-right{
            text-align: right;
        }
        .title-group{
            text-decoration: underline;
        }
        .flex .address{
            width: 75%;
        }
        .flex .phone{
            width: 25%;
            text-align: right;
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h1>BỆNH ÁN ĐIỆN TỬ</h1>
    </div>
    <div class="content-info">
      <h3 class="title-group">1.THÔNG TIN KHÁCH HÀNG</h3>
      <div class="flex">
        <div class="left"><p>KH: ${customerInfo.fullName}</p></div>
        <div class="center"><p>Giới tính: ${customerInfo.sex == 1 ? 'Nam' : 'Nữ'}</p></div>
        <div class="right"><p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.birthday)}</p></div>
      </div>
      <div class="flex">
        <div class="address"><p>ĐC: ${customerInfo.address} </p></div>
        <div class="phone"><p>SĐT: ${customerInfo.phone1}</p></div>
      </div>
    </div>
    <div class="content-reasons">
      <h3 class="title-group">2.LÝ DO KHÁM</h3>
      <p>${customerInfo.reasons}</p>
    </div>
  <div class="content-medical_history">
    <h3 class="title-group">3.BỆNH SỬ</h3>
    <p>${customerInfo.medicalHistory}</p>
  </div>

  <div class="content-biometric">
    <h3 class="title-group">4.THÔNG TIN SINH TRẮC</h3>
      <div class="flex">
        <p class="col-auto">Cân nặng (kg): ${customerInfo.weight}</p>
        <p class="col-auto">Chiều cao (cm): ${customerInfo.hight}</p>
        <p class="col-2">Mạch: ${customerInfo.circuit}</p>
        <p class="col-3">Huyết áp (mmHg): ${customerInfo.bloodPressure}</p>
        <p class="col-2">BMI: ${parseFloat(customerInfo.bMI).toFixed(3)}</p>
      </div>
  </div>
  <div class="content-examination">
    <h3 class="title-group">5.KHÁM BỆNH</h3>
    <p>${customerInfo.examination}</p>
  </div>
  <div class="content-service">
    <h3 class="title-group">6.CẬN LÂM SÀN</h3>
    ${dataSourceService.map((item, i) => `
          <div class="row">
            <p class="service_name"> ${i + 1}. ${item.DetailName}</p>
            <p class="service_result">${item.Result}</p>
          </div>
        `.trim()).join('')}
  </div>
  <div class="content-diagnose">
    <h3 class="title-group">7.CHẨN ĐOÁN</h3>
    <p>${customerInfo.diagnose}</p>
  </div>
<div class="content-prescription">
    <h3 class="title-group">8.TOA THUÔC</h3>
    <div class="col-12 row">
      <h5 class="text-left col-6">TÊN SẢN PHẨM</h5>
      <h5 class="text-left col-1">ĐVT</h5>
      <h5 class="text-left col-time_use">TĐD</h5>
      <h5 class="text-left col-1">HTD</h5>
      <h5 class="text-left col-1">SL/Lần</h5>
      <h5 class="text-left col-qty">SL</h5>
    </div>
    ${dataSourcePrescription.map((item, i) => `
          <div class="row">
            <div class="col-6"><p>${i + 1}. ${item.ItemName}</p></div>
            <div class="col-1"><p>${item.UnitName}</p></div>
            <div class="col-time_use"><p>${item.TimeUse}</p></div>
            <div class="col-1"><p>${item.ItemUsing}</p></div>
            <div class="col-1 text-right"><p>${item.QuantityPerUse}</p></div>
            <div class="col-qty text-right"><p>${item.Quantity}</p></div>
          </div>
        `.trim()).join('')}
  </div>
</body>
</html>


`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static doctorRePrintGroupServiceConfig(showPrice: boolean, dataSource: any, customerInfo: any, title: any) {
    let displayShowPrice: string = "unset",
      marginTop: string = "0",
      service_name: string = "80%",
      user = LocalStorageConfig.GetUser(),
      total: number = 0;

    total = dataSource.reduce((prev, curr) => {
      //convert string kiểu "2,222" => string "2222"
      let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
        curr_number = curr.AmountPaid.toString().replace(regex, ''),
        //giá trị prev đầu tiên là object, những lần sau là giá trị đã cộng
        prev_number = prev.toString().replace(regex, '');
      //prev_number = typeof prev === 'object' ? prev.Price.toString().replace(regex, '') : prev.toString().replace(regex, '');
      //cộng số đã convert
      return parseInt(prev_number) + parseInt(curr_number);
    }, 0);

    //in groupService
    if (!showPrice) {
      //k show price
      displayShowPrice = "none";
      marginTop = "15px";
    }

    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser();
    let svg = `<svg class="barcode"></svg>`;

    let parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.formatDDMMYYY(new Date());

    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @page  
        { 
            size: auto;
            margin: 15mm 15mm 15mm 15mm;  
        }
       .header {
            text-align: center;
            border-bottom: 2px solid #69a3d8;
            display: flex;
            height: 80px;
            padding: 0 0 20px 0;
        }
        .header .img {
            width: 30%;
            text-align: left;
        }
        .header .img img {
            height: 100%;
            width: 100%;
        }
        .header .info-store {
            line-height: 2px;
            font-size: 14px;
            text-align: right;
            width: 70%;
        }
       .header .info-store h3{
            text-transform: uppercase;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h3 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .content-service {
            border-bottom: 1px solid #ccc;
            border-top: 1px solid #ccc;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
            margin-bottom:5px;
        }
        .content-info h5{
            margin-bottom: 2px;
            margin-top: 0;
            text-transform: uppercase;
        }
        .right{
            text-align: right;
        }
        .text-center{
            text-align: center;
        }
        .content-service .row{
            display: flex;
            padding:5px 0;
            font-weight: bold;
        }
        .service_name{
            width:${service_name};
        }
        .service_price{
            width: 20%;
            text-align: right;
            display:${displayShowPrice};
        }
        .total{
          display:${displayShowPrice};
        }
        .total p{
            font-size:25px;
            font-weight: bold;
            word-break: break-all
        }
        .svg{
          margin-top:${marginTop};
        }
        .item_magin-left{
            margin-left:15px;
        }
.content-service .row h5{
margin: 0;
}
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/logo-falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h3>${title}</h3>
    </div>
    <div class="content-info">
            <h5>KH: ${customerInfo.FullName}</h5>
            <p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p>
            <p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p>
            <p>ĐC: ${customerInfo.Address} </p>
    </div>
    <div class="content-service">
        ${dataSource.map((item, i) => `
          <div class="row">
            <h5 class="service_name"> ${i + 1}. ${item.GroupServiceName}</h5>
            <h5 class="service_price">${String.FormatInputNumber(item.AmountPaid)}</h5>
          </div>

            ${item.RequestGroupServiceDetailList.map((item1, i) => `
              <div class="row item_magin-left">
                <p class="service_name"> ${i + 1}. ${item1.GroupDetailName}</p>
              </div>
            `.trim()).join('')}

        `.trim()).join('')}
      
    </div>
    <div class="total right"><p>Tổng: ${String.FormatInputNumber(total)}</p></div>
  <div class="text-center svg">${svgHtml}</div>
  <div class="right"><label>${date}</label></div>
</body>
</html>


`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static doctorRePrintGroupServiceConfig1(showPrice: boolean, dataSource: any, customerInfo: any, title: any) {
    let displayShowPrice: string = "block",
      displayShowName: string = "block",
      class_margin: string = "",
      marginTop: string = "0",
      user = LocalStorageConfig.GetUser(),
      total = 0;

    if (!showPrice) {
      //k show price
      displayShowPrice = "none";
      marginTop = "15px";
    }
    total = dataSource.reduce((prev, curr) => {
      //convert string kiểu "2,222" => string "2222"
      let regex = new RegExp('[^' + String.DECIMAL_SEPARATOR + '\\d]', 'g'),
        curr_number = curr.AmountPaid.toString().replace(regex, ''),
        //giá trị prev đầu tiên là object, những lần sau là giá trị đã cộng
        prev_number = prev.toString().replace(regex, '');
      //prev_number = typeof prev === 'object' ? prev.Price.toString().replace(regex, '') : prev.toString().replace(regex, '');
      //cộng số đã convert
      return parseInt(prev_number) + parseInt(curr_number);
    }, 0);
    //khởi tạo thẻ barcode, sau đó bỏ thẻ barcode đã được khởi tạo vào html
    let parser = new DOMParser(),
      svg = `<svg class="barcode"></svg>`,
      parsedHtml = parser.parseFromString(svg, 'text/html');

    //chi tiết tại https://github.com/lindell/JsBarcode
    jsbarcode(parsedHtml.getElementsByClassName('barcode')[0], customerInfo.CusCode, {
      width: 2,
      height: 40,
      margin: 0,
      displayValue: true,
    });
    let svgHtml = parsedHtml.getElementsByClassName('barcode')[0].outerHTML;
    let date = Format.formatDDMMYYY(new Date());
    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
       .header {
            text-align: center;
            border-bottom: 2px solid #69a3d8;
            display: flex;
            height: 80px;
            padding: 0 0 20px 0;
        }
        .header .img {
            width: 30%;
            text-align: left;
        }
        .header .img img {
            height: 100%;
            width: 100%;
        }
        .header .info-store {
            line-height: 2px;
            font-size: 14px;
            text-align: right;
            width: 70%;
        }
       .header .info-store h3{
            text-transform: uppercase;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title h1 {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .left h3{
            text-transform: uppercase;
        }
        .content-service {
            border-bottom: 1px dotted #69a3d8;
            border-top: 1px dotted #69a3d8;
                }
        .content-service .row{
            display: flex;
            font-weight: bold;
            word-break: break-all
        }
        .item_name{
		        width: 80%;
			      font-weight: bold;
            word-break: break-all;
		    }
		    .unit_name{
			    text-align: right;
			    width: 20%;
		    }
		    .item_use,.item_note{
			    font-style: italic;
		    }
        .m-5 p{
          margin-top:5px;
		    }
        .flex{
			    display: flex;
		    }
		    .flex .left{
			    width: 50%;
		    }
        .flex .center{
			    width: 25%;
		    }
        .flex .right{
			    width: 25%;
		    }
        .flex p, .flex h3{
          margin: 0;
        }
       .footer {
            width: 100%;
            text-align: right;
            line-height: 8px;
        }

        .footer p {
            text-align: right;
            font-size: 15px;
        }

        .footer p:nth-child(2) {
            margin-right: 55px;
        }

        .footer h3 {
            margin-top: 100px;
        }
        .info-store p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
        }
        .content-info h3{
            margin-bottom: 2px;
            margin-top: 2px;
        }
        .right{
            text-align: right;
        }
        @page  
        { 
            size: auto;
            margin: 15mm 15mm 15mm 15mm;  
        }
        .text-center{
            text-align: center;
        }
        .item_name{
            line-height: 5px;
        }
        .content-info p, .content-service p{
            font-size: 15px;
        }
        .content-service p{
            margin: 5px 0;
        }
        .svg{margin-top:10px;}
        .service_name{
            width:80%;
        }
        .service_price{
            width: 20%;
            text-align: right;
            display:${displayShowPrice};
        }
        .total{
          display:${displayShowPrice};
        }
        .total p{
            font-size:25px;
            font-weight: bold;
            word-break: break-all
        }
        .group-service_item{
            padding-left:30px;
        }
        .content-service h3{
            display:${displayShowName};
            margin-bottom: 0;
        }
        .item_magin-left{
            margin-left:30px;
        }
        .content-service .row h4{
            margin: 0;
        }
        .content-service .group{
            margin-top: 10px;
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
        <h1>${title}</h1>
    </div>
    <div class="content-info">
      <div class="flex">
        <div class="left"><h3>KH: ${customerInfo.FullName}</h3></div>
        <div class="center"><p>Giới tính: ${customerInfo.Sex == 1 ? 'Nam' : 'Nữ'}</p></div>
        <div class="right"><p>Ngày sinh: ${Format.formatDDMMYYY(customerInfo.Birthday)}</p></div>
      </div>
      <p>ĐC: ${customerInfo.Address} </p>
    </div>
    <div class="content-service">
      ${dataSource.map((item, i) => `
          <div class="row group">
            <h4 class="service_name"> ${i + 1}. ${item.GroupServiceName}</h4>
            <h4 class="service_price">${String.FormatInputNumber(item.AmountPaid)}</h4>
          </div>

            ${item.RequestGroupServiceDetailList.map((item1, i) => `
              <div class="row item_magin-left">
                <p class="service_name"> ${i + 1}. ${item1.GroupDetailName}</p>
              </div>
            `.trim()).join('')}

        `.trim()).join('')}
    </div>
    <div class="total right"><p>Tổng: ${String.FormatInputNumber(total)}</p></div>
  <div class="text-center svg">${svgHtml}</div>
  <div class="right"><label>${date}</label></div>
</body>
</html>


`;
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

  public static printRPLD( dataSource: any, startDate:any, endDate: any) {
    let user = LocalStorageConfig.GetUser(),
      total = dataSource.SumServiceReceive - dataSource.SumServicePaid + dataSource.SumGroupServiceReceive - dataSource.SumGroupServicePaid;

    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
       .header {
            text-align: center;
            border-bottom: 2px solid #69a3d8;
            display: flex;
            height: 80px;
            padding: 0 0 20px 0;
        }
        .header .img {
            width: 30%;
            text-align: left;
        }
        .header .img img {
            width:100%;
            height: 100%;
        }
        .header .info-store {
            line-height: 2px;
            font-size: 14px;
            text-align: right;
            width: 70%;
        }
        .header .info-store h3{
            text-transform: uppercase;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title div {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .title h1, .title h3 {
            margin: 0;
        }
        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .left h3{
            text-transform: uppercase;
        }
        .content-service {
            border-bottom: 1px dotted #69a3d8;
            border-top: 1px dotted #69a3d8;
        }
        .item_name{
		      width: 80%;
			    font-weight: bold;
          word-break: break-all;
          line-height: 15px;
		    }
		    .unit_name{
			    text-align: right;
			    width: 20%;
          line-height: 15px;
		    }
		    .item_use,.item_note{
			    font-style: italic;
		    }
        .m-5 p{
          margin-top:5px;
		    }
        .flex{
			    display: flex;
		    }
		    .flex .left{
			    width: 50%;
		    }
        .flex .center{
			    width: 25%;
		    }
        .flex .right{
			    width: 25%;
		    }
        .flex p, .flex h3{
          margin: 0;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
        }
        .content-info h3{
            margin-bottom: 2px;
            margin-top: 2px;
        }
        .right{
            text-align: right;
        }
        @page  
        { 
            size: auto;
            margin: 15mm 15mm 15mm 15mm;  
        }
        .text-center{
            text-align: center;
        }
        .content-service .row{
            display: flex;
        }
        .content-service{
            line-height: 0;
        }
        
        .service_name{
            width:80%;
        }
        .service_price{
            width: 20%;
            text-align: right;
        }
        .content-bottom{
          margin-top: 5px;
          
		    }
		    .content-bottom .right h3{
			    margin-top: 100px;
		    }
        .float_right{float:right;}
        .content-info p, .content-service p, .content-bottom p{
            font-size: 15px;
        }
        table{
            width:100%;
            border: 1px solid #ddd;
            margin-top: 20px;
        }
        table thead tr th, table tbody tr td{
            border: 1px solid #ddd;
        }
        table thead tr th{
            background: #ccc;
        }
        table tbody tr td, table thead tr th{
           font-size: 20px;
        }
        table tbody tr td:first-child{
           text-align: center;
        }
        table tbody tr td:last-child{
           text-align: right;
        }
         table tbody tr td span{
           float: right;
           font-weight: bold;
        }
        table tbody tr:last-child td:last-child{
           background: #ccc;
        }
        @media print {
           table tbody tr:last-child td:last-child,
           table thead tr th {
                background-color: #ccc;
                -webkit-print-color-adjust: exact; 
            }
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
      <div>
        <h1>BẢNG KÊ CHI TIẾT NỘP TIỀN</h1>
        <h3>Doanh số ngày
          ${Format.getDD(new Date(startDate))}/${Format.getMM(new Date(startDate))}/${Format.getYYYY(new Date(startDate))}
          - ${Format.getDD(new Date(endDate))}/${Format.getMM(new Date(endDate))}/${Format.getYYYY(new Date(endDate))}
        </h3>
      </div>
    </div>
    <div>
       <table class="table">
    <thead>
      <tr>
        <th>STT</th>
        <th>NỘI DUNG</th>
        <th>SỐ LƯỢNG/THÀNH TIỀN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Số lượng khách hàng <span>(A)</span></td>
        <td>${dataSource.CountRegistration}</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Số lượng dịch vụ lẻ<span>(B)</span></td>
        <td>${dataSource.CountService}</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Tổng tiền dịch vụ lẻ(Đã thu) <span>(C)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumServiceReceive)} VNĐ</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Tổng tiền dịch vụ lẻ(Chi trả)<span>(D)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumServicePaid)} VNĐ</td>
      </tr>
      <tr>
        <td>5</td>
        <td>Số lượng dịch vụ gói <span>(E)</span></td>
        <td>${dataSource.CountGroupService}</td>
      </tr>
      <tr>
        <td>6</td>
        <td>Tổng tiền dịch vụ gói(Đã thu)<span>(F)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumGroupServiceReceive)} VNĐ</td>
      </tr>
      <tr>
        <td>7</td>
        <td>Tổng tiền dịch vụ gói(Chi trả)<span>(G)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumGroupServicePaid)} VNĐ</td>
      </tr>
      <tr>
        <td>8</td>
        <td>Số lượng toa thuốc <span>(H)</span></td>
        <td>${dataSource.CountPrescription}</td>
      </tr>
      <tr>
        <td>9</td>
        <td>Tổng tiền toa thuốc <span>(I)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumPrescriptionReceive)} VNĐ</td>
      </tr>
      <tr>
        <td>10</td>
        <td>Tổng tiền mặt thực tế <span>(J=C-D+F-G)</span></td>
        <td>${String.FormatInputNumber(total)} VNĐ</td>
      </tr>
    </tbody>
  </table>
    </div>
    <div class="content-bottom">
		  <div class="right">
			  <p>Ngày ${Format.getDD(new Date())} tháng ${Format.getMM(new Date())} năm ${Format.getYYYY(new Date())}</p>
        <h3>${user.Data.Position}</h3>
		  </div>
	  </div>
</body>
</html>


`;
    //<h3>${user.Data.Position}. ${user.Data.FullName}</h3>
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }



  public static printRPLDAcountant(dataSource: any, startDate: any, endDate: any) {
    let user = LocalStorageConfig.GetUser(),
      total = dataSource.SumServiceReceive + dataSource.SumGroupServiceReceive ;

    let html = `<!doctype html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
       .header {
            text-align: center;
            border-bottom: 2px solid #69a3d8;
            display: flex;
            height: 80px;
            padding: 0 0 20px 0;
        }
        .header .img {
            width: 30%;
            text-align: left;
        }
        .header .img img {
            width:100%;
            height: 100%;
        }
        .header .info-store {
            line-height: 2px;
            font-size: 14px;
            text-align: right;
            width: 70%;
        }
        .header .info-store h3{
            text-transform: uppercase;
        }
        .title {
            border-top: 5px solid #1b3e77;
            text-align:center;
        }
        .title div {
            border: 1px dotted #69a3d8;
            border-radius: 10px;
            margin-top: 5px;
        }

        .title h1, .title h3 {
            margin: 0;
        }
        .right h3{
            margin-bottom: 0;
        }
        .right div{
            display: flex;
        }
        .right p:nth-child(2){
            margin-left: 15px;
        }
        .left h3{
            text-transform: uppercase;
        }
        .content-service {
            border-bottom: 1px dotted #69a3d8;
            border-top: 1px dotted #69a3d8;
        }
        .item_name{
		      width: 80%;
			    font-weight: bold;
          word-break: break-all;
          line-height: 15px;
		    }
		    .unit_name{
			    text-align: right;
			    width: 20%;
          line-height: 15px;
		    }
		    .item_use,.item_note{
			    font-style: italic;
		    }
        .m-5 p{
          margin-top:5px;
		    }
        .flex{
			    display: flex;
		    }
		    .flex .left{
			    width: 50%;
		    }
        .flex .center{
			    width: 25%;
		    }
        .flex .right{
			    width: 25%;
		    }
        .flex p, .flex h3{
          margin: 0;
        }
        .footer{
            float: right;
            text-align: right;
        }
        .footer p:nth-child(1n+1){
            text-align: center;
        }
        p{
            font-size: 12px;
        }
        .content-info{
            line-height: 15px;
        }
        .content-info h3{
            margin-bottom: 2px;
            margin-top: 2px;
        }
        .right{
            text-align: right;
        }
        @page  
        { 
            size: auto;
            margin: 15mm 15mm 15mm 15mm;  
        }
        .text-center{
            text-align: center;
        }
        .content-service .row{
            display: flex;
        }
        .content-service{
            line-height: 0;
        }
        
        .service_name{
            width:80%;
        }
        .service_price{
            width: 20%;
            text-align: right;
        }
        .content-bottom{
          margin-top: 5px;
          
		    }
		    .content-bottom .right h3{
			    margin-top: 100px;
		    }
        .float_right{float:right;}
        .content-info p, .content-service p, .content-bottom p{
            font-size: 15px;
        }
        table{
            width:100%;
            border: 1px solid #ddd;
            margin-top: 20px;
        }
        table thead tr th, table tbody tr td{
            border: 1px solid #ddd;
        }
        table thead tr th{
            background: #ccc;
        }
        table tbody tr td, table thead tr th{
           font-size: 20px;
        }
        table tbody tr td:first-child{
           text-align: center;
        }
        table tbody tr td:last-child{
           text-align: right;
        }
         table tbody tr td span{
           float: right;
           font-weight: bold;
        }
        table tbody tr:last-child td:last-child{
           background: #ccc;
        }
        @media print {
           table tbody tr:last-child td:last-child,
           table thead tr th {
                background-color: #ccc;
                -webkit-print-color-adjust: exact; 
            }
        }
    </style>
</head>
<body onload="window.print();window.close();">
    <div class="header">
        <div class="img"><img src="assets/images/falinic.png" /></div>
        <div class="info-store">
            <h3>${user.Data.TitleStore}</h3>
            <p>${user.Data.AddressStore}</p>
            <p>ĐT: ${user.Data.PhoneStore}</p>
            <p>Giờ làm việc: Sáng <span>${user.Data.StartWorkingStore}</span></p>
            <p>Chiều: <span>${user.Data.EndWorkingStore}</span> (Ngày lễ nghỉ)</p>
        </div>
    </div>
    <div class="title">
      <div>
        <h1>BẢNG KÊ CHI TIẾT NỘP TIỀN</h1>
        <h3>Doanh số ngày
          ${Format.getDD(new Date(startDate))}/${Format.getMM(new Date(startDate))}/${Format.getYYYY(new Date(startDate))}
          - ${Format.getDD(new Date(endDate))}/${Format.getMM(new Date(endDate))}/${Format.getYYYY(new Date(endDate))}
        </h3>
      </div>
    </div>
    <div>
       <table class="table">
    <thead>
      <tr>
        <th>STT</th>
        <th>NỘI DUNG</th>
        <th>SỐ LƯỢNG/THÀNH TIỀN</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Số lượng khách hàng <span>(A)</span></td>
        <td>${dataSource.CountRegistration}</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Số lượng dịch vụ lẻ<span>(B)</span></td>
        <td>${dataSource.CountService}</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Tổng tiền dịch vụ lẻ(Đã thu) <span>(C)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumServiceReceive)} VNĐ</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Tổng tiền dịch vụ lẻ(Chi trả)<span>(D)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumServicePaid)} VNĐ</td>
      </tr>
      <tr>
        <td>5</td>
        <td>Số lượng dịch vụ gói <span>(E)</span></td>
        <td>${dataSource.CountGroupService}</td>
      </tr>
      <tr>
        <td>6</td>
        <td>Tổng tiền dịch vụ gói(Đã thu)<span>(F)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumGroupServiceReceive)} VNĐ</td>
      </tr>
      <tr>
        <td>7</td>
        <td>Tổng tiền dịch vụ gói(Chi trả)<span>(G)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumGroupServicePaid)} VNĐ</td>
      </tr>
      <tr>
        <td>8</td>
        <td>Số lượng toa thuốc <span>(H)</span></td>
        <td>${dataSource.CountPrescription}</td>
      </tr>
      <tr>
        <td>9</td>
        <td>Tổng tiền toa thuốc <span>(I)</span></td>
        <td>${String.FormatInputNumber(dataSource.SumPrescriptionReceive)} VNĐ</td>
      </tr>
      <tr>
        <td>10</td>
        <td>Tổng tiền mặt thực tế <span>(J=C+F)</span></td>
        <td>${String.FormatInputNumber(total)} VNĐ</td>
      </tr>
    </tbody>
  </table>
    </div>
    <div class="content-bottom">
		  <div class="right">
			  <p>Ngày ${Format.getDD(new Date())} tháng ${Format.getMM(new Date())} năm ${Format.getYYYY(new Date())}</p>
        <h3>${user.Data.Position}</h3>
		  </div>
	  </div>
</body>
</html>


`;
    //<h3>${user.Data.Position}. ${user.Data.FullName}</h3>
    let a = window.open('', '_blank', 'top=0,left=0,height=800px,width=1350px');
    if (a == null)
      return;
    a.document.open();
    a.document.write(html);
    a.document.close();
  }

}
