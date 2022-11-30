import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public router: Router) {}
  ngOnInit(): void {}

  /**
   * The function toMovies() navigates to the movies component
   */
  toMovies(): void {
    /**
     * The function toProfile() is a void function that navigates to the profile page
     */
    this.router.navigate(['movies']);
  }

  /**
   * The function toProfile() is a void function that navigates to the profile page
   */
  toProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * The function navigates to the welcome page and clears the local storage
   */
  logout(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}
