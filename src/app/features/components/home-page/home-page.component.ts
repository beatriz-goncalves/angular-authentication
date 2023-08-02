import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@core-services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    try {
      this.authenticationService.logout(this.fetchUserLogged());
      sessionStorage.removeItem('userLogged');
      this.router.navigate(['']);
    } catch (error) {
      console.error('ERROR: ', error);
    }
  }

  fetchUserLogged() {
    var userLogged: any = sessionStorage.getItem('userLogged');
    return JSON.parse(userLogged);
  }
}
