import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  resetPasswordForm = {
    password: '',
    confirmPassword: '',
  };
  token = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
      console.log(this.token);
    });
  }

  resetPassword() {
    if (
      this.resetPasswordForm.password !== this.resetPasswordForm.confirmPassword
    ) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (
      this.resetPasswordForm.password == '' ||
      this.resetPasswordForm.confirmPassword == ''
    ) {
      this.errorMessage = 'All Fields are required.';
      return;
    }
    this.authService
      .resetPassword(this.token, this.resetPasswordForm.password)
      .subscribe(
        () => {
          this.successMessage = 'Password reset successfully.';
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage =
            error.error.msg || 'Error resetting the password.';
          this.successMessage = '';
        }
      );
  }
}
