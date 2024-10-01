import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  searchControl = new FormControl('');

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        if (typeof value === 'string') {
          this.userService.filterUsers(value);
        }
      });

    this.userService.fetchUsers();
  }

  handleLogout() {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/signin']);
      },
      (error) => {}
    );
  }

  isSearching() {
    this.userService.setIsUserSearching(true);
  }
}
