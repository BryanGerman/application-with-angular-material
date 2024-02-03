import { Component, OnInit } from '@angular/core';
import { AttackType, Role, PrimaryAttr, Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { v4 } from "uuid";

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent implements OnInit {
  public attackType = { ...AttackType };
  public roles = { ...Role };
  public attributes = { ...PrimaryAttr };

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    name: new FormControl<string>('', { nonNullable: true }),
    localized_name: new FormControl<string>(''),
    attack_type: new FormControl<AttackType>(AttackType.Melee),
    primary_attr: new FormControl<PrimaryAttr>(PrimaryAttr.Agi),
    roles: new FormControl<Role[]>([Role.Carry]),
    legs: new FormControl<number>(0),
    alt_image: new FormControl(''),

  });

  constructor(
    private _heroesService: HeroesService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
    ) { }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }
  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this._heroesService.updateHero(this.currentHero)
        .subscribe( hero => {
          this.showSnackBar(`${hero.localized_name} actualizado!`)
        })

        return;
    }

    this.currentHero.id = v4()
    this._heroesService.addHero(this.currentHero).subscribe(
      hero => {
        this._router.navigate(['/heroes/edit', hero.id])
        this.showSnackBar(`${hero.localized_name} creado!`)
      }
    )

    //
  }

  ngOnInit(): void {
      if(!this._router.url.includes("edit")) return;

      this._activatedRoute.params.pipe(
        switchMap( ({id}) => this._heroesService.getHeroById(id)),
      ).subscribe(
        hero => {
          if(!hero) return this._router.navigateByUrl("/");

          this.heroForm.reset( hero );
          return;
        }
      )
  }

  onDeleteHero(){
    if( !this.currentHero.id ) throw Error("Hero id is required!")
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed()
    .pipe(
      filter( result => result),
      switchMap( () => this._heroesService.deleteHeroById( this.currentHero.id )),
      filter( wasDeleted => wasDeleted)
    )
    .subscribe(result => {
      this._router.navigate(['/'])
    })
  }

  showSnackBar( message: string ){
    this._snackBar.open(message, 'done', {
      duration: 2500
    })
  }

}
