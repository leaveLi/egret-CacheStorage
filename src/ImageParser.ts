module cacs {
    /**
     * 图片解析
     * @author likun
     */
    export class ImageParser {
        private static winURL: any;
        public static init() {
            this.winURL = window["URL"] || window["webkitURL"];
            this.request();
        }

        private static request() {
            var self = this;
            egret.ImageLoader.prototype.load = function (url) {
                if (self.winURL
                    && url.indexOf("wxLocalResource:") != 0 // 微信专用不能使用 blob
                    && url.indexOf("data:") != 0
                    && (url.indexOf("http:") != 0 || url.split('/')[2] == location.host)
                    && (url.indexOf("https:") != 0 || url.split('/')[2] == location.host)) {
                    CacheStorageManager.match(url, FileType.BLOB, (response: Blob) => {
                        this.request = undefined;
                        this.loadImage(self.winURL.createObjectURL(response));
                    })
                }
                else {
                    this.loadImage(url);
                }
            };
        }

    }
}
