import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  signinForm = {
    username: '',
    password: '',
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignin() {
    if (this.signinForm.username == '' || this.signinForm.password == '') {
      this.errorMessage = 'All fields are required.';
      return;
    }

    this.authService
      .signin(this.signinForm.username, this.signinForm.password)
      .subscribe(
        (response) => {
          this.router.navigate(['/']);
        },
        (error) => {
          this.errorMessage = error.error.msg || 'Error during Sign in.';
        }
      );
  }
}
