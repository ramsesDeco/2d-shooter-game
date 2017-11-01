class GlobalEvents {
    enemyDestoyEventName: string;
    gameOverEventName: string;
    initEventName: string;
    constructor() {
        this.enemyDestoyEventName = 'enemyDestroyed';
        this.gameOverEventName = 'gameOver';
        this.initEventName = 'init';
    }

    enemyDestroyed(typeEnemy: string) {
        document.dispatchEvent(new CustomEvent(this.enemyDestoyEventName, { 'detail': typeEnemy }));
    }
    gameOver() {
        document.dispatchEvent(new CustomEvent(this.gameOverEventName))
    }
    init() {
        document.dispatchEvent(new CustomEvent(this.initEventName))
    }


}
let GlobalEventService = new GlobalEvents();
export default GlobalEventService;