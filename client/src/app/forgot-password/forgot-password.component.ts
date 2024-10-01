import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  forgotPasswordForm = {
    email: '',
  };
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  forgotPassword() {
    if (this.forgotPasswordForm.email == '') {
      this.errorMessage = 'The Email field cannot be empty.';
      return;
    }

    this.authService.forgotPassword(this.forgotPasswordForm.email).subscribe(
      () => {
        this.errorMessage = '';
        this.successMessage =
          'A link to reset your password has been sent to your Email ID. The link will expire in 5 minutes.';
      },
      (error) => {
        this.errorMessage =
          error.error.msg || 'Error sending the password reset mail.';
        this.successMessage = '';
      }
    );
  }
}
