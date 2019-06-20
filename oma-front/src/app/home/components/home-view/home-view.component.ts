import { Component, OnInit } from '@angular/core';
import { HighscoreService } from 'src/app/shared/services/highscore.service';
import { UserScore } from 'src/app/shared/models/UserScore';
import { Game } from 'src/app/shared/models/Game';

@Component({
  selector: 'home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit {
  highscores: UserScore[];
  userScore: UserScore = new UserScore();

  lotteryMap: number[][];
  selectedNumbers: number[] = [];
  drawnNumbers: number[] = [];

  player: string;

  money: number = 5;
  winSize: number = 0;
  betSize: number = 0.2;
  drawing: boolean;
  game: Game;

  constructor(
    private scoreService: HighscoreService
  ) {     
  }

  ngOnInit() {
    this.scoreService.getHighScores().subscribe((highscores: UserScore[]) => {
      this.highscores = highscores;
    })

    this.game = new Game();

    // Lottery numbers in 2D array
    this.lotteryMap = [];
    for(let row=0; row <= 3; row++){
      let rowNumbers = []
      for(let number = 1; number <= 10; number++){
        rowNumbers.push(number + (row*10))
      }
      this.lotteryMap.push(rowNumbers);
    }
  }

  toggleSelectedNumber(lotteryNumber: number){
    if(!this.drawing){
      if(this.selectedNumbers.includes(lotteryNumber)){
        this.selectedNumbers.splice(this.selectedNumbers.indexOf(lotteryNumber), 1);
      } else if (this.selectedNumbers.length < 10) {
        this.selectedNumbers.push(lotteryNumber);
      }
    }
  }

  drawNumbers(){
    this.winSize = 0;
    this.drawing = true;
    this.drawnNumbers = [];

    this.money -= this.betSize;

    let drawLoop = setInterval(() => {
      let randomNumber = Math.floor(Math.random() * Math.floor(41));
      if(!this.drawnNumbers.includes(randomNumber)){
        this.drawnNumbers.push(randomNumber)
      }
      if(this.drawnNumbers.length >= 10) {
        clearInterval(drawLoop)
        let rightNumbers = this.drawnNumbers.filter(x=>this.selectedNumbers.includes(x)).length;
        this.winSize = this.betSize*this.getWinRatio(rightNumbers ? rightNumbers : 0);
        this.money += this.winSize;
        if(this.money < 0){
          this.money = 0;
        }
        if(this.money < this.betSize){
          this.betSize = this.money > 0 ? this.money : 0.2;
        }
        this.drawing = false;
      };
    }, 400);
  }

  getWinRatio(rightNumbers: number): number{
    let missedNumbers = this.selectedNumbers.length - rightNumbers;
    let winRatioPerHit = this.getWinRatiosPerHit(this.selectedNumbers.length);
    let winRatio = winRatioPerHit && winRatioPerHit.winRatio.length > missedNumbers ? winRatioPerHit.winRatio[missedNumbers] : 0;
    return winRatio;
  }

  getWinRatiosPerHit(selected: number){
    return this.game.gameModes.find(x=>x.hits === selected)
  }

  raiseBet(){
    if(this.betSize < 5 && this.betSize < this.money){
      this.betSize += 0.2;
    } else {
      this.betSize = 0.2;
    }
    this.betSize = Number(this.betSize.toFixed(2));
  }

  saveResults(){
    this.userScore.score = this.money;
    let userHighScore = this.highscores.find(x=>x.user === this.userScore.user);
    if(userHighScore && userHighScore.score < this.userScore.score){
      this.scoreService.updateUserScore(this.userScore).subscribe(response => {
        userHighScore.score = this.userScore.score;
        this.highscores.sort((a, b) => b.score - a.score);
      });
    } else if (!userHighScore) {
      this.scoreService.createUserScore(this.userScore).subscribe(response => {
        this.highscores.push(this.userScore);
        this.highscores.sort((a, b) => b.score - a.score);
      });
    }
    this.restart();
  }

  clearSelections(){
    this.selectedNumbers = [];
  }

  restart(){
    this.money = 5;
    this.clearSelections();
    this.drawnNumbers = [];
  }
}
