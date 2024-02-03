import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseUrl;
  private user?: User

  constructor(private _httpClient: HttpClient) { }

  get currentUser(){
    if( !this.user ) return undefined;
    return structuredClone(this.user)
  }


  login(user:string, password: string):Observable<User>{
    return this._httpClient.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap( user => this.user = user),
      tap( user => localStorage.setItem("token", "ln1l423kjblk2312l3n1"))
    )
  }

  checkAuthentication(): Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false);

    const token = localStorage.getItem("token");
    return this._httpClient.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap( user => this.user = user),
      map(user => !!user),
      catchError( err => of(false))
    )
  }

  logout():void{
    this.user = undefined;
    localStorage.clear();
  }


}
