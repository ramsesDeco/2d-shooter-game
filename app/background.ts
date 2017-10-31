import ImageRepository from './image-repository';
import { Drawable } from './drawable';
/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas and creates the illusion of moving by panning the image.
 */
export class Background extends Drawable {


    constructor() {
        super();
        super.speed = 1; // Redefine speed of the background for panning
    }

    // Implement abstract function
    draw() {
        // Pan background
        this.y += this.speed;
        this.context.drawImage(ImageRepository.background, this.x, this.y);

        // Draw another image at the top edge of the first image
        this.context.drawImage(ImageRepository.background, this.x, this.y - this.canvasHeight);

        // If the image scrolled off the screen, reset
        if (this.y >= this.canvasHeight) {
            this.y = 0;
        }
    };
}