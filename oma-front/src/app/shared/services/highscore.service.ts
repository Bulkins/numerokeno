import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { UserScore } from '../models/UserScore';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HighscoreService {
  highScoresApiUrl = 'api/scores';

  constructor(
    private http: HttpClient
  ) { }

  getHighScores() {
    return this.http.get<UserScore[]>(`${this.highScoresApiUrl}/`).pipe(
      map(resp => resp.map(r => {
          return new UserScore(r);
        })
      ))
  }

  createUserScore(score: UserScore){
    return this.http.post<UserScore>(`${this.highScoresApiUrl}/`, score).pipe(
      map(resp => new UserScore(resp))
    );
  }

  updateUserScore(score: UserScore) {
    return this.http.put<UserScore>(`${this.highScoresApiUrl}/`, score)
  }

  deleteUserScore(userId: string){
    return this.http.delete<string>(`${this.highScoresApiUrl}/${userId}`);
  }
}
