module cacs {
    /**
    * Json解析
    * @author likun
    */
    export class JsonParser {
        public static init() {
            this.request();
        }

        private static request() {
            var RES = window['RES'];
            var JsonProcessor = {
                onLoadStart: (host: any, resource: any) => {
                    return this.getJsonData(host, resource);
                },
                onRemoveStart: (host: any, request: any) => {
                }
            };

            var FontProcessor = {
                onLoadStart: (host, resource) => {
                    return this.getJsonData(host, resource).then((config) => {
                        var imageName = this.getRelativePath(resource.url, config.file);

                        var r = host.resourceConfig.getResource(RES.nameSelector(imageName));
                        if (!r) {
                            r = { name: imageName, url: imageName, type: 'image', root: resource.root };
                        }
                        return host.load(r).then((texture) => {
                            var font = new egret.BitmapFont(texture, config);
                            font["$resourceInfo"] = r;
                            host.save(r, texture);
                            return font;
                        }, (e) => {
                            host.remove(r);
                            throw e;
                        });
                    })
                },

                onRemoveStart: (host, resource) => {
                    var font = host.get(resource);
                    var r = font["$resourceInfo"];
                    host.unload(r);
                }
            };
            // 注入加载器
            RES.processor.map('json', JsonProcessor);
            RES.processor.map('font', FontProcessor);
        }

        private static getJsonData(host: any, resource: any): Promise<any> {
            return new Promise((res, rej) => {
                var url = resource.root + resource.url;
                CacheStorageManager.match(url, FileType.JSON, function (data) {
                    res(data);
                });
            })
        }

        private static getRelativePath(url, file) {
            if (file.indexOf("://") != -1) {
                return file;
            }
            url = url.split("\\").join("/");
            var params = url.match(/#.*|\?.*/);
            var paramUrl = "";
            if (params) {
                paramUrl = params[0];
            }
            var index = url.lastIndexOf("/");
            if (index != -1) {
                url = url.substring(0, index + 1) + file;
            }
            else {
                url = file;
            }
            return url + paramUrl;
        }

    }
}
