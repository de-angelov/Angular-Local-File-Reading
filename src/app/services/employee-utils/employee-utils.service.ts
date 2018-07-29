import {
  Injectable
} from '@angular/core';
import * as moment from 'moment';



@Injectable({
  providedIn: 'root'
})
export class EmployeeUtilsService {

  constructor() {}

  private GetTotalTimeWorkedTogether(empA, empB): number {
    let timeWorked = 0;
    empA.projects.forEach((x, i) => {
      empB.projects.forEach((y, j) => {
         if(x.projectId===y.projectId){
          const startWorkTogether = moment (x.start) > moment(y.start) ? moment(x.start) : moment(y.start);
          const endWorkTogether  = moment (x.end) > moment( y.end) ? moment(y.end): moment(x.end);
          let duration = moment.duration(endWorkTogether.diff(startWorkTogether)).asDays();
          duration = Math.trunc(duration);
          timeWorked = duration>0? timeWorked+=duration : timeWorked;
        }
      })
    })
    return timeWorked;
  }

  private GetTimeWorkedTogether(empA, empB): number {
    let timeWorked = 0;
    empA.projects.forEach((x, i) => {
      empB.projects.forEach((y, j) => {
         if(x.projectId===y.projectId){
          const startWorkTogether = moment (x.start) > moment(y.start) ? moment(x.start) : moment(y.start);
          const endWorkTogether  = moment (x.end) > moment( y.end) ? moment(y.end): moment(x.end);
          let duration = moment.duration(endWorkTogether.diff(startWorkTogether)).asDays();
          duration = Math.trunc(duration);
          timeWorked = duration > timeWorked ? duration : timeWorked;
        }
      })
    })
    return timeWorked;
  }

  public GetTopTwo(text: string): Object {
    const today = moment(new Date());
    const employees = new Map();
    text
      .split(/\r|\n/)
      .filter((x) => { return x !== ''})
      .map((x) => {
        const temp = x.split(', ');
        const project =    {
          userId: temp[0],
          projectId: temp[1],
          start: temp[2] !== 'NULL' ? temp[2] : moment(new Date).format("YYYY-MM-DD") ,
          end: temp[3] !== 'NULL' ? temp[3] : moment(new Date).format("YYYY-MM-DD"),
        };
        return project;
      })
      .forEach((x) => {
        let tempAr;
        if (employees.has(x.userId)) {
          tempAr = employees.get(x.userId);
          tempAr.push(x);
          employees.set(x.userId, tempAr);
        } else {
          tempAr = [x];
          employees.set(x.userId, [x]);
        }
      });

    let topTimeWorked = 0;
    let topEmployees = [];
    let tempTimeWorked = 0;
    const employeesAr = Array.from(employees)
      .map((x) => { return { empID: x[0], projects: x[1] } });
    employeesAr.forEach((x, i) => {
      if (i !== employeesAr.length - 1) {
        for (let j = i + 1; j < employeesAr.length; j++) {
          const empA = employeesAr[i];
          const empB = employeesAr[j]
          tempTimeWorked = this.GetTimeWorkedTogether(empA, empB);
          if (tempTimeWorked > topTimeWorked) {
            topTimeWorked = tempTimeWorked;
            topEmployees = [empA.empID, empB.empID];
          }
        }
      }
    })
    return {topTimeWorked, topEmployees};
  }
}
