/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions. 
 */
export class Drawable {
    public speed: number;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public canvasHeight: number;
    public canvasWidth: number;
    public context: CanvasRenderingContext2D;
    public collidableWith: string;
    public isColliding: boolean;
    public type: string;
    public alive: boolean;

    constructor() {
        this.speed = 0;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.collidableWith = '';
        this.isColliding = false;
        this.alive = false;
        this.type = '';
    }

    init(x: number, y: number, width?: number, height?: number) {
        // Defualt variables
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isColliding = false;
        this.alive = false;
    }


    // Define abstract function to be implemented in child objects
    draw() { }
    move() { }

    isCollidableWith(object: any) {
        return (this.collidableWith === object.type);
    };
}