import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {
  hasSignup = signal(false);

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.hasLoginAction();
  }

  hasLoginAction() {
    if (this.router.routerState.snapshot.url === '/signup')
      return this.hasSignup.update((oldValue) => (oldValue = true));
  }
}
