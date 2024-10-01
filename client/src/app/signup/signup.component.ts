import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm = {
    username: '',
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSignup() {
    if (
      this.signupForm.username == '' ||
      this.signupForm.name == '' ||
      this.signupForm.email == '' ||
      this.signupForm.mobileNumber == '' ||
      this.signupForm.password == ''
    ) {
      this.errorMessage = 'All fields are required.';
      return;
    }
    this.authService
      .signup(
        this.signupForm.username,
        this.signupForm.name,
        this.signupForm.email,
        this.signupForm.mobileNumber,
        this.signupForm.password
      )
      .subscribe(
        () => {
          this.router.navigate(['/signin']);
        },
        (error) => {
          this.errorMessage = error.error.msg || 'Error during signup.';
        }
      );
  }
}
