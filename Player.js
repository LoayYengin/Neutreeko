/*
* Represents a player in the game. Can be the hero (white) or a agent (black).
* Can be human or computer (can only be human at this point).
*/
class Player {
    constructor(human, hero,) {
        this.human = human;
        this.isHero = hero;
    }

    getHuman() {
        return this.human;
    }

    getHero() {
        return this.isHero;
    }

}
