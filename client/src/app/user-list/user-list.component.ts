import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: {
    id: string;
    username: string;
    name: string;
    email: string;
  }[] = [];
  isUserSearching: boolean = false;
  selectedUser: any;

  constructor(
    private userService: UserService,
    public modalService: ModalService
  ) {}

  ngOnInit() {
    this.userService.users$.subscribe((users) => {
      this.users = users;
    });

    this.userService.isUserSearching$.subscribe((value) => {
      this.isUserSearching = value;
      //console.log(this.isUserSearching);
    });
  }

  stopSearching() {
    this.userService.setIsUserSearching(false);
  }

  openUserModal(user: any): void {
    this.selectedUser = user;
    this.modalService.openModal(user);
  }
}
