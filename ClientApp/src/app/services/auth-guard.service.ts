import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(protected auth: AuthService) { }

    canActivate() {
        if (this.auth.isAuthenticated())
            return true;

        window.location.href = 'https://vega-slayer.auth0.com/login?state=ZULM41cyGyfRgu38MObjZRJELbbH5uWi&client=YFjDz4SXuTEDYQckiIZDCzX5p2780HwC';
        return false;


    }
}