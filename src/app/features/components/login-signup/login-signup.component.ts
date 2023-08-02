import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '@core-services/authentication.service';

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
})
export class LoginSignupComponent implements OnInit {
  hasSignup = signal(false);
  authenticationForm!: FormGroup;
  errorMessage!: string;
  hasError: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.hasLoginAction();
    this.validatorsLoginOrSignup();
  }

  hasLoginAction() {
    if (this.router.routerState.snapshot.url === '/signup')
      return this.hasSignup.update((oldValue) => (oldValue = true));
  }

  validatorsLogin() {
    this.authenticationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  validatorsSignup() {
    this.authenticationForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  validatorsLoginOrSignup() {
    this.router.routerState.snapshot.url === '/signup'
      ? this.validatorsSignup()
      : this.validatorsLogin();
  }

  login() {
    try {
      this.authenticationService.login(this.authenticationForm.value);
      this.router.navigate(['/homePage']);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  signup() {
    try {
      this.authenticationService.signup(this.authenticationForm.value);
      this.router.navigate(['']);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  submit() {
    this.router.routerState.snapshot.url === '/signup'
      ? this.signup()
      : this.login();
  }
}
