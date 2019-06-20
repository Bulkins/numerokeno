import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  @Input() lotteryMap: number[][];
  @Input() selectedNumbers: number[] = [];
  @Input() drawnNumbers: number[] = [];

  @Output() selectNumber = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
