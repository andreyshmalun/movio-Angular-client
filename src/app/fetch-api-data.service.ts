import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { flatMap, map, find } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movio.onrender.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  //User registration

  /**
   * It takes in a userDetails object, and returns an Observable of type any
   * @param {any} userDetails - This is the object that contains the user details that we want to send
   * to the server.
   * @returns The userRegistration method is returning an observable of type any.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  //User login

  /**
   * It takes in a userDetails object, and returns an Observable of type any
   * @param {any} userDetails - This is the object that contains the user's email and password.
   * @returns Observable<any>
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  //Get all movies

  /**
   * It returns an observable of type any, which is the result of a get request to the movies endpoint,
   * with the token in the header
   * @returns An observable of any type.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Get one movie

  /**
   * This function takes a string as an argument, and returns an observable of type any
   * @param {string} title - string - the title of the movie you want to get
   * @returns The movie with the title that was passed in.
   */
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}movies/${title}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Get director

  /**
   * This function takes a director name as a parameter and returns an observable of type any
   * @param {string} directorName - The name of the director you want to search for.
   * @returns The movies that have the director name that was passed in.
   */
  getDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}movies/directors/${directorName}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Get genre

  /**
   * This function takes a string as a parameter and returns an observable of type any
   * @param {string} genreName - The name of the genre you want to get movies for.
   * @returns The movies that are in the genre that was passed in.
   */
  getGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}movies/genres/${genreName}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Get user

  /**
   * It gets the user from the API, and returns an observable of the user
   * @returns An observable of the user object.
   */
  getUser(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}users`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(
        flatMap(this.extractResponseData),
        find((u: any) => u.Username === username),
        catchError(this.handleError)
      );
  }

  //Get favourite movies for a user

  /**
   * This function gets the favorite movie of the user from the database
   * @param {string} movieID - The ID of the movie you want to get.
   * @returns The movie object that was added to the user's favorites list.
   */
  getFavoriteMovie(movieID: string): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .get(`${apiUrl}users/${username}/movies/${movieID}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Add a movie to favourite Movies

  /**
   * We're using the HttpClient to make a POST request to the API, passing in the movie ID as the body
   * of the request
   * @param {string} movieID - the ID of the movie that the user wants to add to their favorites list
   * @returns The response data is being returned.
   */
  addFavoriteMovie(movieID: string): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .post(
        `${apiUrl}users/${username}/movies/${movieID}`,
        { FavoriteMovie: movieID },
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        }
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Edit user

  /**
   * This function takes in a user object, gets the username and token from local storage, and then
   * sends a PUT request to the server with the updated user object and the token in the header
   * @param {any} updatedUser - any - this is the updated user object that we will send to the server.
   * @returns The updated user object.
   */
  editUser(updatedUser: any): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .put(`${apiUrl}users/${username}`, updatedUser, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Delete user

  /**
   * It deletes the user from the database
   * @returns The response data from the server.
   */
  deleteUser(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .delete(`${apiUrl}users/${username}`, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  //Delete a movie from the favorite movies

  /**
   * It deletes a movie from the user's favorite movies list
   * @param {string} movieID - The ID of the movie to be deleted from the user's favorites list.
   * @returns The response data is being returned.
   */
  deleteFavoriteMovie(movieID: string): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .delete(`${apiUrl}users/${username}/movies/${movieID}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Non-typed response extraction

  /**
   * It takes a response object and returns the body of the response
   * @param {any} res - The response object
   * @returns The response body.
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  /**
   * If the error is an instance of ErrorEvent, then log the error message to the console. Otherwise,
   * log the error status code and error body to the console
   * @param {HttpErrorResponse} error - HttpErrorResponse: This is the error object that is returned by
   * the server.
   * @returns The error message is being returned.
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
