
import GlobalEventService from './global-events';
class ImageRepository {
    public empty: any = null;
    public background: HTMLImageElement;
    public spaceship: HTMLImageElement;
    public bullet: HTMLImageElement;

    public enemy_bullet: HTMLImageElement;
    public enemy_1: HTMLImageElement;
    public enemy_2: HTMLImageElement;
    public enemy_3: HTMLImageElement;
    public enemy_4: HTMLImageElement;

    private numLoaded: number;
    private numImages: number;


    constructor() {
        this.numLoaded = 0;
        this.numImages = 8;
        this.background = this.createImage("assets/sprites/bg.png");
        this.spaceship = this.createImage("assets/sprites/ship.png");
        this.bullet = this.createImage("assets/sprites/bullet.png");

        this.enemy_bullet = this.createImage("assets/sprites/enemies/enemy_bullet.png");

        this.enemy_1 = this.createImage("assets/sprites/enemies/enemy_1.png");
        this.enemy_2 = this.createImage("assets/sprites/enemies/enemy_2.png");
        this.enemy_3 = this.createImage("assets/sprites/enemies/enemy_3.png");
        this.enemy_4 = this.createImage("assets/sprites/enemies/enemy_4.png");
    }

    private createImage(pathUrl: string): HTMLImageElement {
        let newImage: HTMLImageElement = new Image();
        newImage.src = pathUrl;
        newImage.onload = () => {
            this.imageLoaded;
        }
        return newImage;
    }

    private imageLoaded() {
        this.numLoaded++;
        if (this.numLoaded === this.numImages) {
            GlobalEventService.init();
        }
    }
}

export default new ImageRepository();