import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {
  @Input() user: any;
  @Input() size: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  @Input() showName: boolean = false;

  initials: string = '';
  displayName: string = '';

  ngOnInit() {
    this.setUserInfo();
  }

  ngOnChanges() {
    this.setUserInfo();
  }

  private setUserInfo() {
    if (this.user) {
      if (this.user.name && this.user.name.trim()) {
        this.displayName = this.user.name;
        this.initials = this.getInitials(this.user.name);
      } else if (this.user.username && this.user.username.trim()) {
        this.displayName = this.user.username;
        this.initials = this.getInitials(this.user.username);
      } else {
        this.displayName = 'User';
        this.initials = 'U';
      }
    } else {
      this.displayName = 'User';
      this.initials = 'U';
    }
  }

  private getInitials(name: string): string {
    if (!name || !name.trim()) return 'U';

    const names = name
      .trim()
      .split(' ')
      .filter((n) => n.length > 0);
    if (names.length === 0) return 'U';
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (
        names[0].charAt(0) + names[names.length - 1].charAt(0)
      ).toUpperCase();
    }
  }
}
