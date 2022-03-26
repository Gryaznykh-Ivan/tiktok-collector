class PreviewBuilder {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    async createBasicPreview(preview) {
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

        this.ctx.drawImage(poster, 0, cropTop, poster.width, heightAfterCrop, this.canvas.width / 2 - newWidth / 2, borderSize, newWidth, newHeight);
    }

    async createExtendedPreview(preview) {
        const borderSize = 25;
        const bg = await this.getImage("/assets/images/bg.jpg");

        this.ctx.drawImage(bg, 0, 0);
        this.ctx.fillRect(borderSize, borderSize, this.canvas.width - borderSize * 2, this.canvas.height - borderSize * 2);

        const poster = await this.getImage(preview.url);

        const cropTop = (Number(preview.crop.top) / 100) * poster.height;
        const cropBottom = (Number(preview.crop.bottom) / 100) * poster.height;
        const heightAfterCrop = poster.height - cropBottom - cropTop;

        const newHeight = this.canvas.height - borderSize * 2;
        const newWidth = this.canvas.width - borderSize * 2;

        this.ctx.drawImage(poster, 0, cropTop, poster.width, heightAfterCrop, this.canvas.width / 2 - newWidth / 2, borderSize, newWidth, newHeight);
    }

    async createCollagePreview(preview) {
        const newWidth = this.canvas.width / 3;
        const newHeight = this.canvas.height;

        for (const [i, frame] of preview.entries()) {
            console.log(frame);
            const poster = await this.getImage(frame.url);

            this.ctx.drawImage(poster, newWidth * i, 0, newWidth, newHeight);
        }
    }

    async getPreviewUrl() {
        return this.canvas.toDataURL('image/jpeg', 1.0);
    }

    downloadPreview() {

    }
}