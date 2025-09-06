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
export class NavbarComponent implements OnInit {
  searchControl = new FormControl('');
  loggedUser: any;

  // Select options
  groupOptions = [
    { label: 'Create Group', value: 'create' },
    { label: 'All Groups', value: 'all' },
  ];

  userOptions = [{ label: 'Logout', value: 'logout' }];

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authService.getLoggedUser().subscribe((user) => {
      this.loggedUser = user;
    });

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

  onGroupSelect(event: any) {
    if (event.value === 'create') {
      // Handle create group
      console.log('Create group selected');
    } else if (event.value === 'all') {
      // Handle all groups
      console.log('All groups selected');
    }
  }

  onUserSelect(event: any) {
    if (event.value === 'logout') {
      this.handleLogout();
    }
  }
}
