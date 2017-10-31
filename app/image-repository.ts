class ImageRepository {
    public empty: any = null;
    public background: HTMLImageElement;
    public spaceship: HTMLImageElement;
    public bullet: HTMLImageElement;
    private numLoaded: number;
    private numImages: number;


    constructor() {
        this.numLoaded = 0;
        this.numImages = 3;
        this.background = this.createImage("assets/sprites/bg.png");
        this.spaceship = this.createImage("assets/sprites/ship.png");
        this.bullet = this.createImage("assets/sprites/bullet.png");
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