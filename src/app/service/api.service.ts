import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http : HttpClient 
  ) { 

  
  }
  public api:string = "https://sportservice.inplaynet.tech/api/sport/getheader/en";

  getData() {
  
    return this.http.get(this.api);

  }

}
