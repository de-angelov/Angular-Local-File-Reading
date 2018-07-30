import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeUtilsService {

  constructor() {}

  public GetTopTwo(text: string): Object {
    const employees = new Map();
    text
      .split(/\r|\n/)
      .filter((x) => { return x !== ''})
      .map((x) => {
        const temp = x.split(', ');
        const project = {
          userId: temp[0],
          projectId: temp[1],
          start: temp[2] !== 'NULL' ? temp[2] : moment(new Date).format("YYYY-MM-DD"),
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
    .map((x) => { return { empID: x[0], projects: x[1]}});
   
    employeesAr.forEach((x, i) => {
      if (i !== employeesAr.length - 1) {
        for (let j = i + 1; j < employeesAr.length; j++) {
          const empA = employeesAr[i];
          const empB = employeesAr[j]
          const commonProjects = this.GetCommonProjectsDuration(empA, empB);
          tempTimeWorked = this.GetDurationWithoutTimeOverlaps(commonProjects);
          if (tempTimeWorked > topTimeWorked) {
            topTimeWorked = tempTimeWorked;
            topEmployees = [empA.empID, empB.empID];
          }
        }
      }
    })
    return {
      topTimeWorked,
      topEmployees
    };
  }

  private IsOverlapAtStart(x, temp): boolean{
    if (temp.start >= x.start && x.start <= temp.end && x.end <= temp.end){
      return true;
    }
    return false;
  }

  private IsOverlapAtEnd(x, temp): boolean{
    if(temp.start <= x.start && x.start <= temp.end && x.end >= temp.end){
      return true;
    }
    return false;
  }

  private IsOverlapFull(x, temp):  boolean{
    if(temp.start <= x.start && x.start <= temp.end && x.end <= temp.end) {
      return true;
    }
    return false;
  }

  private AddDurationAsDays(start:moment.Moment, end:moment.Moment, timeWorked:number):number {
    let duration = moment.duration(end.diff(start)).asDays();
    duration = Math.trunc(duration);
    timeWorked = duration > 0 ? timeWorked += duration : timeWorked;
    return timeWorked;
  }

  private GetCommonProjectsDuration(empA, empB): object[] {
    const commonProjects: object[] = [];
    empA.projects.forEach((x, i) => {
      empB.projects.forEach((y, j) => {
        if (x.projectId === y.projectId) {
          const startWorkTogether = moment(x.start) > moment(y.start) ? moment(x.start) : moment(y.start);
          const endWorkTogether = moment(x.end) > moment(y.end) ? moment(y.end) : moment(x.end);
          let duration = moment.duration(endWorkTogether.diff(startWorkTogether)).asDays();
          if (duration > 0) {
            commonProjects.push({
              start: startWorkTogether,
              end: endWorkTogether
            });
          }
        }
      })
    })
    return commonProjects;
  }

  private GetDurationWithoutTimeOverlaps(commonProject): number {
    let timeWorked = 0;
    let start: moment.Moment;
    let end: moment.Moment;
    let temp = { start, end }
    commonProject.forEach((x, i) => {
      switch (i) {
        case 0:
          temp.start = moment(x.start);
          temp.end = moment(x.end);
          if(commonProject.length===1){
            timeWorked = this.AddDurationAsDays(temp.start, temp.end, timeWorked);
          }
          break;
        case commonProject.length - 1:
          if (this.IsOverlapFull(x, temp)) {
            timeWorked = this.AddDurationAsDays(temp.start, temp.end, timeWorked);
          } else if (this.IsOverlapAtEnd(x, temp)) {
            timeWorked = this.AddDurationAsDays(temp.start, x.end, timeWorked);
          } else if(this.IsOverlapAtStart(x, temp)) {
            timeWorked = this.AddDurationAsDays(x.start, temp.end, timeWorked);
          } else {
            timeWorked = this.AddDurationAsDays(temp.start, temp.end, timeWorked);
            timeWorked = this.AddDurationAsDays(x.start, x.end, timeWorked);
          }
          break;
        default:
          if (this.IsOverlapAtEnd(x, temp)) {
            temp.end = x.end;
          } else if (this.IsOverlapAtStart(x, temp)) {
            temp.start = x.start;
          } else {
            timeWorked = this.AddDurationAsDays(temp.start, temp.end, timeWorked);
            timeWorked = this.AddDurationAsDays(x.start, x.end, timeWorked);
          }
          break;
      }
    })
    return timeWorked;
  }
}
