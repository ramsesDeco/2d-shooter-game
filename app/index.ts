import { Game } from './game';
/**
 * Initialize the Game and starts it.
 */

var game = new Game();

function init() {
    if (game.init())
        game.start();
}

window.onload = init;