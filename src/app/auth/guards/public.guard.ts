import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PublicGuard implements CanMatch, CanActivate {

    constructor(private _authService: AuthService, private _router: Router) { }

    private checkAuthStatus(): boolean | Observable<boolean> {
        return this._authService.checkAuthentication()
            .pipe(
                tap(isAuthenticated => {
                    if (isAuthenticated) this._router.navigate(["./"])
                }),
                map( isAuthenticated => !isAuthenticated)
            );
    }

    canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
        return this.checkAuthStatus();
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.checkAuthStatus();
    }
}