import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Api2Service {

  constructor(
    private http : HttpClient 
  ) { 

  
  }
  public api2:string = "https://sportservice.inplaynet.tech/api/sport/getheader/teams/en";

  getData2() {
  
    return this.http.get(this.api2);

  }
}
