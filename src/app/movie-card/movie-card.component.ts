import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  favorites: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavorites();
  }

  /**
   * The getMovies() function is a void function that calls the getAllMovies() function from the
   * fetchApiData service, which returns an observable of type any. The observable is then subscribed
   * to, and the response is assigned to the movies property
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * This function is called when the user clicks on the "Favorites" tab. It calls the getUser()
   * function from the fetchApiData service, which returns an observable. The observable is then
   * subscribed to, and the response is assigned to the favorites property
   */
  getFavorites(): void {
    this.fetchApiData.getUser().subscribe((resp: any) => {
      this.favorites = resp.FavoriteMovies;
      return this.favorites;
    });
  }

  /**
   * It returns true if the favorites array includes the id passed in as an argument
   * @param {string} id - The id of the movie to check if it's a favorite.
   * @returns A boolean value.
   */
  isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }

  /**
   * The function takes in an id, logs it to the console, then calls the addFavoriteMovie function from
   * the fetchApiData service, which takes in the id as a parameter. The function then subscribes to
   * the result, logs it to the console, opens a snackbar, and then calls the ngOnInit function
   * @param {string} id - string - the id of the movie that we want to add to our favorites
   */
  addToFavorites(id: string): void {
    console.log(id);
    this.fetchApiData.addFavoriteMovie(id).subscribe((result) => {
      console.log(result);
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  /**
   * The function takes in an id as a parameter, and then uses the deleteFavoriteMovie() function from
   * the fetchApiData service to delete the movie from the database
   * @param {string} id - string - the id of the movie to be removed from the favorites list
   */
  removeFromFavorites(id: string): void {
    console.log(id);
    this.fetchApiData.deleteFavoriteMovie(id).subscribe((result) => {
      console.log(result);
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000,
      });
      this.ngOnInit();
    });
  }

  /**
   * The function opens a dialog box with the GenreComponent, and passes in the name and description of
   * the genre
   * @param {string} name - string - the name of the genre
   * @param {string} description - string - the description of the genre
   */
  openGenre(name: string, description: string): void {
    this.dialog.open(GenreComponent, {
      data: {
        Name: name,
        Description: description,
      },
      panelClass: 'genre-dialog-background',
      width: '400px',
    });
  }

  /**
   * This function opens a dialog box with the director's name, bio, and birthday
   * @param {string} name - string - The name of the director
   * @param {string} bio - string, birthday: string
   * @param {string} birthday - string - the birthday of the director
   */
  openDirector(name: string, bio: string, birthday: string): void {
    this.dialog.open(DirectorComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birthday,
      },
      panelClass: 'director-dialog-background',
      width: '400px',
    });
  }

  /**
   * The function takes in a title and description as parameters, and then opens a dialog box with the
   * title and description as the data
   * @param {string} title - string, description: string
   * @param {string} description - string - The description of the movie
   */
  openSummary(title: string, description: string): void {
    this.dialog.open(MovieDetailsComponent, {
      data: {
        Title: title,
        Description: description,
      },
      panelClass: 'summary-dialog-background',
      width: '400px',
    });
  }
}
