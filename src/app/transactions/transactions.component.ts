import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Router } from '@angular/router';



@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  allTransactions:any;
  searchKey:string=''
  constructor(private api:ApiService, private router:Router){}
  ngOnInit(): void {
    if(!localStorage.getItem("token")){
      alert('Please Log In !!!')
      this.router.navigateByUrl('')
    }
    this.api.getAllTransactions().subscribe((result:any)=>{
      this.allTransactions = result.transactions
      console.log(this.allTransactions);
    })
  }
  search(event:any){
    this.searchKey = event.target.value
  }
  generatePDF(){
    var pdf = new jsPDF()
    let col = ['Type','FromAcno','ToAcno','Amount']
    let row:any = []
    pdf.setFontSize(16);
    pdf.text('TRANSACTION HISTORY', 11, 8);
    pdf.setFontSize(12);
    pdf.setTextColor(99);
    var itemNew = this.allTransactions
    itemNew.forEach(element => {
      var temp = [element.type,element.fromAcno,element.toAcno,element.amount]
      row.push(temp)
    });
    (pdf as any).autoTable(col,row,{startY:10})
    pdf.output('dataurlnewwindow')
    pdf.save('ministatement.pdf');
  }
}
