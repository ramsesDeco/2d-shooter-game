import { Background } from './background';
import { Ship } from './ship';
import { Bullet } from './bullet';
import ImageRepository from './image-repository';
/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
export class Game {

    private bgCanvas: HTMLCanvasElement;
    private shipCanvas: HTMLCanvasElement;
    private mainCanvas: HTMLCanvasElement;

    private bgContext: CanvasRenderingContext2D;
    private shipContext: CanvasRenderingContext2D;
    private mainContext: CanvasRenderingContext2D;

    private background: Background;
    private ship: Ship;

    constructor() {
        this.background = new Background
    }
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on older browsers.
	 */
    init() {
        // Get the canvas element
        this.bgCanvas = <HTMLCanvasElement>document.getElementById('background');
        this.shipCanvas = <HTMLCanvasElement>document.getElementById('ship');
        this.mainCanvas = <HTMLCanvasElement>document.getElementById('main');

        // Test to see if canvas is supported
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            this.shipContext = this.shipCanvas.getContext('2d');
            this.mainContext = this.mainCanvas.getContext('2d');

            // Initialize objects to contain their context and canvas
            // information
            this.background = new Background();
            this.background.context = this.bgContext;
            this.background.canvasWidth = this.bgCanvas.width;
            this.background.canvasHeight = this.bgCanvas.height;

            this.ship = new Ship();
            this.ship.context = this.shipContext;
            this.ship.canvasWidth = this.shipCanvas.width;
            this.ship.canvasHeight = this.shipCanvas.height;
            this.ship.setAreaBulletPool(this.mainContext, this.mainCanvas.width, this.mainCanvas.height);

            // Bullet.prototype.context = this.mainContext;
            // Bullet.prototype.canvasWidth = this.mainCanvas.width;
            // Bullet.prototype.canvasHeight = this.mainCanvas.height;

            // Initialize the background object
            this.background.init(0, 0); // Set draw point to 0,0

            let shipStartX = this.shipCanvas.width / 2 - ImageRepository.spaceship.width;
            let shipStartY = this.shipCanvas.height / 4 * 3 + ImageRepository.spaceship.height * 2;
            this.ship.init(shipStartX, shipStartY, ImageRepository.spaceship.width,
                ImageRepository.spaceship.height);

            return true;
        } else {
            return false;
        }
    };

    // Start the animation loop
    start() {
        this.ship.draw();
        this.animate();
    };

    private animate() {
        window.requestAnimFrame(this.animate.bind(this));
        this.background.draw();
        this.ship.move()
        this.ship.bulletPool.animate();
    }
}

declare global {
    interface Window {
        init: any;
        requestAnimFrame: any;
        mozRequestAnimationFrame: FrameRequestCallback;
        oRequestAnimationFrame: FrameRequestCallback;
        msRequestAnimationFrame: FrameRequestCallback;
    }
}

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback: () => any, element: HTMLElement) {
            window.setTimeout(callback, 1000 / 60);
        };
})();