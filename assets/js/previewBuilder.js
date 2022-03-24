class PreviewBuilder {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.ctx = this.canvas.getContext('2d');
    }

    async getImage(url) {
        return new Promise((resolve, _) => {
            const image = document.createElement("img");
            image.crossOrigin = "anonymous";
            image.src = url;

            image.onload = () => {
                resolve(image);
            }
        });
    }

    async createPreview(preview) {
        console.log(preview);

        const borderSize = 25;
        const bg = await this.getImage("/assets/images/bg.jpg");

        this.ctx.drawImage(bg, 0, 0);
        this.ctx.fillRect(borderSize, borderSize, this.canvas.width - borderSize * 2, this.canvas.height - borderSize * 2);

        const poster = await this.getImage(preview.url);

        const cropTop = (Number(preview.crop.top) / 100) * poster.height;
        const cropBottom = (Number(preview.crop.bottom) / 100) * poster.height;
        const heightAfterCrop = poster.height - cropBottom - cropTop;

        const newHeight = this.canvas.height - borderSize * 2;
        const newWidth = (newHeight / heightAfterCrop) * poster.width;

        console.log(0, preview.crop.top, poster.width, poster.height - preview.crop.bottom);
        this.ctx.drawImage(poster, 0, cropTop, poster.width, heightAfterCrop, this.canvas.width / 2 - newWidth / 2, borderSize, newWidth, newHeight);
        //this.ctx.drawImage(poster, this.canvas.width / 2 - newWidth / 2, borderSize, newWidth, newHeight);
    }

    async getPreviewUrl() {
        return this.canvas.toDataURL('image/jpeg', 1.0);
    }

    downloadPreview() {

    }
}