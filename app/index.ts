import { Game } from './game';
/**
 * Initialize the Game and starts it.
 */

/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
var game = new Game();

function init() {
    if (game.init())
        game.start();
}

window.onload = init;