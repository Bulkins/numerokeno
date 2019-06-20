import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeViewComponent } from './components/home-view/home-view.component';
import { CoreModule } from '../core/core.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameBoardComponent } from './components/game-board/game-board.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ],
  declarations: [HomeViewComponent, GameBoardComponent]
})
export class HomeModule { }
