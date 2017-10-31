class ImageRepository {
    public empty: any = null;
    public background: HTMLImageElement;
    public spaceship: HTMLImageElement;
    public bullet: HTMLImageElement;

    public ship_enemy: HTMLImageElement;
    public ship_enemyBullet: HTMLImageElement;
    
    private numLoaded: number;
    private numImages: number;


    constructor() {
        this.numLoaded = 0;
        this.numImages = 5;
        this.background = this.createImage("assets/sprites/bg.png");
        this.spaceship = this.createImage("assets/sprites/ship.png");
        this.bullet = this.createImage("assets/sprites/bullet.png");
        this.ship_enemy = this.createImage("assets/sprites/enemies/ship-enemy.png");
        this.ship_enemyBullet = this.createImage("assets/sprites/enemies/ship-enemy-bullet.png");
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
            window.init();
        }
    }
}

export default new ImageRepository();