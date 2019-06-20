export class UserScore {

    constructor(obj?: any) {
      if (obj) {
        this.user = obj.user ? obj.user : null;
        this.score = obj.score || obj.score === 0 ? obj.score : null;
      }
    }
  
    user: string;
    score: number;
  }
  