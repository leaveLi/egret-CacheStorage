module cacs {
    /**
     * Cache​Storage缓存管理
     * @author likun
     */
    export class CacheStorageManager {

        private static cacheName: string = 'v2.0.2'; // 仓库版本
        public static inited: boolean = false;
        private static isAllow: boolean = true;
        public static init() {
            this.inited = true;
        }

        /**
         * 获取缓存url
         * @param url 
         */
        private static getCacheUrl(url: string): string {
            let matchURL = '';
            let urlArr = url.split('/');
            // 根据品牌区分
            let brand = urlArr[3];
            // 模块
            let mode = urlArr[4];
            if (brand && mode) {
                // 重新拼接url 方便删除crc32值变化的旧文件
                url = urlArr[0] + '//' + urlArr[2] + '/' + brand + '/' + mode + '/';
                // 解析crc32
                let _arr = urlArr[urlArr.length - 1].split('_');
                if (_arr.length > 1) {
                    for (let i = 0; i < _arr.length - 1; i++) {
                        url = url + '_' + _arr[i];
                    }
                    let end = _arr[_arr.length - 1].split('.');
                    if (end.length > 1) {
                        // 区分后缀
                        url = url + '.' + end[end.length - 1];
                        // 用_AND_拼接crc32值
                        matchURL = url + '_AND_' + _arr[_arr.length - 1];
                    }
                }
            }
            return matchURL;
        }

        /**
         * 资源匹配 优先从缓存中取
         * @param src 
         * @param responseType 
         * @param callback 
         */
        public static match(src: string, responseType: string, callback: (res: any) => void) {
            let request = new Request(src);
            let cacheUrl = this.getCacheUrl(request.url);
            caches.match(cacheUrl).then(response => {
                if (response) {
                    console.log('读取缓存', cacheUrl);
                }
                return response ? this.parserData(response, responseType) : this.fetch(request, cacheUrl, responseType);
            }).then(data => {
                callback(data);
            }).catch(e => console.error(e));
        }

        /**
         * 远程获取资源
         * @param request 
         * @param cacheUrl 
         * @param responseType 
         */
        private static fetch(request: Request, cacheUrl: string, responseType: string): Promise<any> {
            let response: Response, responseToCache: Response;
            return fetch(request).then(res => {
                response = res;
                responseToCache = response.clone();
                return caches.open(this.cacheName);
            }).then(cache => {
                this.checkAllow(cacheUrl, response) && this.addCache(cache, cacheUrl, responseToCache);
                return this.parserData(response, responseType);
            })
        }

        /**
         * 
         * @param cache 
         * @param cacheUrl 
         * @param responseToCache 
         */
        private static addCache(cache: Cache, cacheUrl: string, responseToCache: Response): void {
            cache.keys().then(keys => {
                keys = keys.filter(function (req) {
                    let arr1 = req.url.split('_AND_'), arr2 = cacheUrl.split('_AND_');
                    return arr1[0] == arr2[0] && arr1[1] != arr2[1];
                });
                // 删除匹配项（移除旧文件）
                keys[0] && cache.delete(keys[0]);
                keys[0] && console.log('删除匹配项', keys[0].url);
                return cache.put(cacheUrl, responseToCache)
            }).then(e => console.log('存储', cacheUrl)).catch(e => {
                console.error(e);
                console.error('errurl:' + cacheUrl);
                this.isAllow = false;
            });
        }


        /**
         * 检测能否缓存
         * @param cacheUrl 
         * @param response 
         */
        private static checkAllow(cacheUrl: string, response: Response): boolean {
            if (!response || response.status !== 200 || response.type !== 'basic' || !cacheUrl || !this.isAllow)
                return false;
            const notAllowedCacheFiles = [
                'default.res.json',
                'cacheFile.json',
                'index.html',
                'manifest.json',
                'version.json'
            ]
            for (let file of notAllowedCacheFiles) {
                if (cacheUrl.indexOf(file) > -1) return false;
            }
            return true;
        }

        /**
         * 解析数据
         * @param response 
         * @param responseType 
         */
        private static parserData(response: Response, responseType: string): Promise<any> {
            if (responseType === FileType.TEXT) return response.text();
            if (responseType === FileType.JSON) return response.json();
            if (responseType === FileType.BLOB) return response.blob();
            if (responseType === FileType.ARRAYBUFFER) return response.arrayBuffer();
            return Promise.resolve(null);
        }
    }

    let caches = window.caches;
    let fetch = window.fetch;
    let Request = window['Request'];
    let Response = window['Response'];
    // 判断能否使用
    if (caches && caches.open && caches.match && caches.delete && caches.keys && fetch && Request && Response) {
        CacheStorageManager.init();
    }
}