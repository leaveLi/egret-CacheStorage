module cacs {
    /**
    * 声音解析
    * @author likun
    */
    export class SoundParser {
        public static init() {
            this.request();
        }

        private static request() {
            var egret = window['egret'];
            var web = egret.web;
            egret.web.WebAudioSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                CacheStorageManager.match(url, FileType.ARRAYBUFFER, function (arraybuffer) {
                    web.WebAudioDecode.decodeArr.push({
                        "buffer": arraybuffer,
                        "success": onAudioLoaded,
                        "fail": onAudioError,
                        "self": self,
                        "url": self.url
                    });
                    web.WebAudioDecode.decodeAudios();
                })
                function onAudioLoaded() {
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
            };
        }

    }
}
