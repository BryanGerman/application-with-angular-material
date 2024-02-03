import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { FormControl } from '@angular/forms';
import { concatMap, filter, map } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;

  constructor(private _heroesService: HeroesService) { }

  searchValue() {
    const value: string = this.searchInput.value || '';

    this._heroesService.getHeroes()
      .pipe(
        map(heroes => heroes.filter((hero: Hero) => hero.localized_name.toLowerCase().includes(value)))
      )
      .subscribe(heroes => this.heroes = heroes)
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void{
    if(!event.option.value){
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.localized_name);
    this.selectedHero = hero;
  }
}
