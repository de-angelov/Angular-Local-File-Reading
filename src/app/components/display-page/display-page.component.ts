import { Component, OnInit } from '@angular/core';
import { ReadFileService } from '../../services/read-file/read-file.service';
import { EmployeeUtilsService } from '../../services/employee-utils/employee-utils.service';
import { IResult } from '../../models/result';


@Component({
  selector: 'app-display-page',
  templateUrl: './display-page.component.html',
  styleUrls: ['./display-page.component.css']
})
export class DisplayPageComponent implements OnInit {
  private errorMsgVisible = false;
  private resultMsgVisible = false; 
  private employeeA: string;
  private employeeB: string = null;
  private timeWorkedTogether: number = null;
  private resultMsg: string = null;
  constructor(
    private readFileService : ReadFileService,
    private employeeUtils : EmployeeUtilsService,
  )  { }
  
  private onSubmit(e){
    e.preventDefault();
    const file = e.target.filePath.files[0];
    this.readFileService.getText(file).subscribe(
      (res)=>{
        const results: IResult = this.employeeUtils.GetTopTwo(res);
        [this.employeeA, this.employeeB] = results.topEmployees;
        if(this.employeeA && this.employeeB){
          this.timeWorkedTogether = results.topTimeWorked;
          this.resultMsg=
          `${this.timeWorkedTogether} days by employee:${this.employeeA} and employee:${this.employeeB}`;
          console.log('Longest time worked on projects together:',this.resultMsg);
          this.resultMsgVisible = true;
          this.errorMsgVisible = false;
        }else{
          this.errorMsgVisible=true;
          this.resultMsgVisible=false;
          this.employeeA=null;
          this.employeeB=null;
          this.timeWorkedTogether=null;
          this.resultMsg=null;
        }
      },
      (error)=>{
        console.log(error);
        this.errorMsgVisible=true;
    });

  }

  ngOnInit() {
  }

}
