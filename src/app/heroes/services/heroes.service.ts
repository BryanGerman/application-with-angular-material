import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private _baseUrl = environment.baseUrl;

  constructor(private _httpClient: HttpClient) { }

  getHeroes(): Observable<Hero[]>{
    return this._httpClient.get<Hero[]>(`${this._baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined>{
    return this._httpClient.get<Hero>(`${this._baseUrl}/heroes/${id}`)
    .pipe(
      catchError( error => of(undefined))
    )
  }

  addHero(hero: Hero):Observable<Hero>{
    return this._httpClient.post<Hero>(`${this._baseUrl}/heroes`, hero);
  }

  updateHero(hero: Hero):Observable<Hero>{
    if(!hero.id) throw Error("Hero id is required!")

    return this._httpClient.patch<Hero>(`${this._baseUrl}/heroes/${hero.id}`, hero);
  }

  deleteHeroById(id: string):Observable<boolean>{
    
    return this._httpClient.delete(`${this._baseUrl}/heroes/${id}`)
    .pipe(
      map( resp => true),
      catchError( err => of(false)),
      
    );
  }
}
