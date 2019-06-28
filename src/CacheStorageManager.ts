module cacs {
    /**
     * Cache​Storage缓存管理
     * @author likun
     */
    export class CacheStorageManager {

        static cacheName: string = 'v2.0.2'; // 仓库版本
        static inited: boolean = false;
        static usage: number; // 已经使用的存储空间
        static quota: number; // 域名分配的存储空间
        static canPut: boolean = true; // 能否存储
        static async init() {
            this.inited = true;
            // const { usage, quota } = await this.storageEstimateWrapper();
            // this.usage = usage;
            // this.quota = quota;
        }

        /**
         * 处理url 方便读取 更新
         * @param url 
         */
        static getURL(url: string): string {
            let cUrl = '';
            let urlArr = url.split('/');
            // 根据品牌区分
            let brand = urlArr[3];
            // 模块
            let mode = urlArr[4];
            if (brand && mode) {
                // 重新拼接url 方便删除md5值变化的旧文件
                url = urlArr[0] + '//' + urlArr[2] + '/' + brand + '/' + mode + '/';
                let _arr = urlArr[urlArr.length - 1].split('_');
                if (_arr.length > 1) {
                    for (let i = 0; i < _arr.length - 1; i++) {
                        url = url + '_' + _arr[i];
                    }
                    let end = _arr[_arr.length - 1].split('.');
                    if (end.length > 1) {
                        // 区分后缀
                        url = url + '.' + end[end.length - 1];
                        // 用_AND_拼接md5值
                        cUrl = url + '_AND_' + _arr[_arr.length - 1];
                    }
                }
            }
            return cUrl;
        }

        /**
         * 资源匹配 优先从缓存中取
         * @param src 
         * @param responseType 
         * @param callback 
         */
        static async match(src: string, responseType: string, callback: (res: any) => void) {
            let request = new Request(src);
            let url = this.getURL(request.url);
            let response = await caches.match(url);
            if (response) {
                console.log('读取缓存', url);
                let data = await this.parserData(response, responseType);
                callback(data);
            }
            else {
                let data = await this.fetch(request, url, responseType);
                callback(data);
            }
        }

        /**
         * 远程获取资源
         * @param request 
         * @param url 
         * @param responseType 
         */
        static async fetch(request: Request, url: string, responseType: string): Promise<any> {
            let response = await fetch(request);
            let responseToCache = response.clone();
            let cache = await caches.open(this.cacheName);
            if (url && this.isPutCache(url, response) && this.canPut) {
                let keys = await cache.keys();
                keys = keys.filter(function (req) {
                    let arr1 = req.url.split('_AND_'), arr2 = url.split('_AND_');
                    return arr1[0] == arr2[0] && arr1[1] != arr2[1];
                });
                // 删除匹配项（移除旧文件）
                keys[0] && cache.delete(keys[0]);
                keys[0] && console.log('删除匹配项', keys[0].url);
                cache.put(url, responseToCache).then((e) => console.log('存储', url)).catch((e) => { this.canPut = false; console.log('存储失败', e) });
            }
            return this.parserData(response, responseType);
        }

        /**
         * 是否缓存该资源
         * @param url 
         * @param response 
         */
        static isPutCache(url: string, response: Response): boolean {
            if (!response || response.status !== 200 || response.type !== 'basic')
                return false;
            if (url.indexOf('default.res.json') > -1)
                return false;
            if (url.indexOf('cacheFile.json') > -1)
                return false;
            if (url.indexOf('index.html') > -1)
                return false;
            if (url.indexOf('manifest.json') > -1)
                return false;
            if (url.indexOf('version.json') > -1)
                return false;
            return true;
        }

        /**
         * 解析数据
         * @param response 
         * @param responseType 
         */
        static async parserData(response: Response, responseType: string): Promise<any> {
            let promise = null;
            switch (responseType) {
                case FileType.ARRAYBUFFER:
                    promise = response.arrayBuffer();
                    break;
                case FileType.BLOB:
                    promise = response.blob();
                    break;
                case FileType.TEXT:
                    promise = response.text();
                    break;
                case FileType.JSON:
                    promise = response.json();
                    break;
            }
            return promise;
        }

        /**
         * 获取存储空间
         */
        private static storageEstimateWrapper(): Promise<any> {

            if ('storage' in navigator && 'estimate' in navigator['storage']) {
                return navigator['storage'].estimate();
            }

            if ('webkitTemporaryStorage' in navigator &&
                'queryUsageAndQuota' in navigator['webkitTemporaryStorage']) {
                return new Promise(function (resolve, reject) {
                    navigator['webkitTemporaryStorage'].queryUsageAndQuota(
                        function (usage, quota) { resolve({ usage: usage, quota: quota }) },
                        reject
                    );
                });
            }

            return Promise.resolve({ usage: 0, quota: 0 });
        }
    }

    let caches = window.caches;
    let fetch = window.fetch;
    let Request = window['Request'];
    let Response = window['Response'];
    if (caches && caches.open && caches.match && caches.delete && caches.keys && fetch && Request && Response) {
        CacheStorageManager.init();
    }
}