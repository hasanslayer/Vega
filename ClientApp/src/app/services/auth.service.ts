// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import { JwtHelperService } from '@auth0/angular-jwt';

(window as any).global = window;

@Injectable()
export class AuthService {
    roles: string[] = [];

    auth0 = new auth0.WebAuth({
        clientID: 'YFjDz4SXuTEDYQckiIZDCzX5p2780HwC',
        domain: 'vega-slayer.auth0.com',
        responseType: 'token id_token',
        audience: 'https://api.vega.com',
        redirectUri: 'https://localhost:5001/vehicles',
        scope: 'openid email profile'
    });


    // 'https://vega-slayer.auth0.com/userinfo'
    constructor(public router: Router) { }

    public login(): void {
        this.auth0.authorize();
    }

    public isInRole(roleName) {
        return this.roles.indexOf(roleName) > -1;
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            // console.log("authResult", authResult) // just for checking
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                this.setSession(authResult);
                this.router.navigate(['/vehicles']);
            } else if (err) {
                this.router.navigate(['/not-found']);
                console.log("the error:", err);
            }
        });
    }

    private setSession(authResult): void {
        // Set the time that the Access Token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);

        this.readRolesFromLocalStorage(authResult);
    }

    private readRolesFromLocalStorage(authResult) {
        var jwtHelper = new JwtHelperService();
        var decoderToken = jwtHelper.decodeToken(authResult.accessToken);
        this.roles = decoderToken['https://vega.com/roles'];
        console.log(decoderToken['https://vega.com/roles']);
    }

    public logout(): void {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        this.roles = [];
        // Go back to the home route
        this.router.navigate(['/']);
    }

    public isAuthenticated(): boolean {
        // Check whether the current time is past the
        // Access Token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
        return new Date().getTime() < expiresAt;
    }

}