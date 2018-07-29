import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReadFileService {

  constructor() { }

  public  getText(file): Observable<any>{  
    const fileReader: FileReader = new FileReader();
    fileReader.readAsText(file);

    return Observable.create((observer) => {
      fileReader.onload = (e:any) =>{
         observer.next(e.target.result);
      },
      fileReader.onerror = error => observer.error(error);
    })
  }

}
