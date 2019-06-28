declare module cacs {
    /**
     * Cache​Storage缓存管理
     * @author likun
     */
    class CacheStorageManager {
        static cacheName: string;
        static inited: boolean;
        static usage: number;
        static quota: number;
        static canPut: boolean;
        static init(): Promise<void>;
        static getURL(url: string): string;
        static match(src: string, responseType: string, callback: (res: any) => void): Promise<void>;
        static fetch(request: Request, url: string, responseType: string): Promise<any>;
        static isPutCache(url: string, response: Response): boolean;
        static parserData(response: Response, responseType: string): Promise<any>;
        private static storageEstimateWrapper();
    }
}
declare module cacs {
    /**
     * 图片解析
     * @author likun
     */
    class ImageParser {
        private static winURL;
        static init(): void;
        private static request();
    }
}
declare module cacs {
    /**
    * Json解析
    * @author likun
    */
    class JsonParser {
        static init(): void;
        private static request();
        private static getJsonData(host, resource);
        private static getRelativePath(url, file);
    }
}
declare module cacs {
    /**
    * 声音解析
    * @author likun
    */
    class SoundParser {
        static init(): void;
        private static request();
    }
}
