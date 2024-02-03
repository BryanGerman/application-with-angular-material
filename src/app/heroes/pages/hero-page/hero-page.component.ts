import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrl: './hero-page.component.css'
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private _heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this._heroesService.getHeroById(id))
    ).subscribe(hero => {
      if (!hero) return this._router.navigate(["/heroes.list"])
      this.hero = hero;
      return;
    })
  }

  goBack():void{
    this._router.navigate(["heroes/list"])
  }

}
