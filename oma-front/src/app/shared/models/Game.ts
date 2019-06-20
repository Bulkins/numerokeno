export class Game {
    static GameModes = [
        {
        hits: 10,
        winRatio: [50, 50, 40, 35, 14, 5, 2, 1, 0, 0]
        },
        {
        hits: 9,
        winRatio: [50, 50, 40, 20, 10, 3, 1, 0, 0]
        },
        {
        hits: 8,
        winRatio: [50, 40, 32, 15, 6, 1, 0, 0]
        },
        {
        hits: 7,
        winRatio: [45, 35, 15, 10, 2, 0, 0]
        },
        {
        hits: 6,
        winRatio: [40, 34, 14, 4, 0, 0]
        },
        {
        hits: 5,
        winRatio: [30, 15, 6, 1, 0]
        },
        {
        hits: 4,
        winRatio: [20, 11, 2, 0]
        },
        {
        hits: 3,
        winRatio: [18, 5, 0]
        },
        {
        hits: 2,
        winRatio: [9, 1]
        }
    ]

    constructor() {
        this.gameModes = Game.GameModes.map(x=>new GameMode(x));
    }

    gameModes: GameMode[];
}

export class GameMode {
    constructor(obj?: any) {
        if(obj){
            this.hits = obj.hits || obj.hits === 0 ? obj.hits : null;
            this.winRatio = obj.winRatio ? obj.winRatio.slice() : []; 
        }
    }

    hits: number;
    winRatio: number[];
}
