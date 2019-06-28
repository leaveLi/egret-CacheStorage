var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var cacs;
(function (cacs) {
    /**
     * Cache​Storage缓存管理
     * @author likun
     */
    var CacheStorageManager = (function () {
        function CacheStorageManager() {
        }
        CacheStorageManager.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.inited = true;
                    return [2 /*return*/];
                });
            });
        };
        CacheStorageManager.getURL = function (url) {
            var cUrl = '';
            var urlArr = url.split('/');
            // 根据品牌区分
            var brand = urlArr[3];
            // 模块
            var mode = urlArr[4];
            if (brand && mode) {
                // 重新拼接url 方便删除md5值变化的旧文件
                url = urlArr[0] + '//' + urlArr[2] + '/' + brand + '/' + mode + '/';
                var _arr = urlArr[urlArr.length - 1].split('_');
                if (_arr.length > 1) {
                    for (var i = 0; i < _arr.length - 1; i++) {
                        url = url + '_' + _arr[i];
                    }
                    var end = _arr[_arr.length - 1].split('.');
                    if (end.length > 1) {
                        // 区分后缀
                        url = url + '.' + end[end.length - 1];
                        // 用_AND_拼接md5值
                        cUrl = url + '_AND_' + _arr[_arr.length - 1];
                    }
                }
            }
            return cUrl;
        };
        CacheStorageManager.match = function (src, responseType, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var request, url, response, data, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request = new Request(src);
                            url = this.getURL(request.url);
                            return [4 /*yield*/, caches.match(url)];
                        case 1:
                            response = _a.sent();
                            if (!response) return [3 /*break*/, 3];
                            console.log('读取缓存', url);
                            return [4 /*yield*/, this.parserData(response, responseType)];
                        case 2:
                            data = _a.sent();
                            callback(data);
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, this.fetch(request, url, responseType)];
                        case 4:
                            data = _a.sent();
                            callback(data);
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        CacheStorageManager.fetch = function (request, url, responseType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var response, responseToCache, cache, keys;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch(request)];
                        case 1:
                            response = _a.sent();
                            responseToCache = response.clone();
                            return [4 /*yield*/, caches.open(this.cacheName)];
                        case 2:
                            cache = _a.sent();
                            if (!(url && this.isPutCache(url, response) && this.canPut)) return [3 /*break*/, 4];
                            return [4 /*yield*/, cache.keys()];
                        case 3:
                            keys = _a.sent();
                            keys = keys.filter(function (req) {
                                var arr1 = req.url.split('_AND_'), arr2 = url.split('_AND_');
                                return arr1[0] == arr2[0] && arr1[1] != arr2[1];
                            });
                            // 删除匹配项（移除旧文件）
                            keys[0] && cache.delete(keys[0]);
                            keys[0] && console.log('删除匹配项', keys[0].url);
                            cache.put(url, responseToCache).then(function (e) { return console.log('存储', url); }).catch(function (e) { _this.canPut = false; console.log('存储失败', e); });
                            _a.label = 4;
                        case 4: return [2 /*return*/, this.parserData(response, responseType)];
                    }
                });
            });
        };
        CacheStorageManager.isPutCache = function (url, response) {
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
        };
        CacheStorageManager.parserData = function (response, responseType) {
            return __awaiter(this, void 0, void 0, function () {
                var promise;
                return __generator(this, function (_a) {
                    promise = null;
                    switch (responseType) {
                        case 'sound':
                            promise = response.arrayBuffer();
                            break;
                        case 'image':
                            promise = response.blob();
                            break;
                        case 'js':
                            promise = response.text();
                            break;
                        case 'json':
                            promise = response.json();
                            break;
                    }
                    return [2 /*return*/, promise];
                });
            });
        };
        CacheStorageManager.storageEstimateWrapper = function () {
            if ('storage' in navigator && 'estimate' in navigator['storage']) {
                return navigator['storage'].estimate();
            }
            if ('webkitTemporaryStorage' in navigator &&
                'queryUsageAndQuota' in navigator['webkitTemporaryStorage']) {
                return new Promise(function (resolve, reject) {
                    navigator['webkitTemporaryStorage'].queryUsageAndQuota(function (usage, quota) { resolve({ usage: usage, quota: quota }); }, reject);
                });
            }
            return Promise.resolve({ usage: 0, quota: 0 });
        };
        CacheStorageManager.cacheName = 'v2.0.2'; // 请勿修改
        CacheStorageManager.inited = false;
        CacheStorageManager.canPut = true; // 能否存储
        return CacheStorageManager;
    }());
    cacs.CacheStorageManager = CacheStorageManager;
    __reflect(CacheStorageManager.prototype, "cacs.CacheStorageManager");
    var caches = window.caches;
    var fetch = window.fetch;
    var Request = window['Request'];
    var Response = window['Response'];
    // let sw = navigator.serviceWorker;
    // 支持serviceWorker的情况 就不需要单独使用CacheStorage
    // CacheStorage用于IOS支持的版本(ios目前都不支持serviceWorker）
    // if (caches && caches.open && caches.match && caches.delete && caches.keys && fetch && Request && Response && !sw) {
    //     CacheStorageManager.init();
    // }
    if (caches && caches.open && caches.match && caches.delete && caches.keys && fetch && Request && Response) {
        CacheStorageManager.init();
    }
})(cacs || (cacs = {}));
var cacs;
(function (cacs) {
    /**
     * 图片解析
     * @author likun
     */
    var ImageParser = (function () {
        function ImageParser() {
        }
        ImageParser.init = function () {
            this.winURL = window["URL"] || window["webkitURL"];
            this.request();
        };
        ImageParser.request = function () {
            var self = this;
            egret.ImageLoader.prototype.load = function (url) {
                var _this = this;
                if (self.winURL
                    && url.indexOf("wxLocalResource:") != 0 // 微信专用不能使用 blob
                    && url.indexOf("data:") != 0
                    && (url.indexOf("http:") != 0 || url.split('/')[2] == location.host)
                    && (url.indexOf("https:") != 0 || url.split('/')[2] == location.host)) {
                    cacs.CacheStorageManager.match(url, 'image', function (response) {
                        _this.request = undefined;
                        _this.loadImage(self.winURL.createObjectURL(response));
                    });
                }
                else {
                    this.loadImage(url);
                }
            };
        };
        return ImageParser;
    }());
    cacs.ImageParser = ImageParser;
    __reflect(ImageParser.prototype, "cacs.ImageParser");
})(cacs || (cacs = {}));
var cacs;
(function (cacs) {
    /**
    * Json解析
    * @author likun
    */
    var JsonParser = (function () {
        function JsonParser() {
        }
        JsonParser.init = function () {
            this.request();
        };
        JsonParser.request = function () {
            var _this = this;
            var RES = window['RES'];
            var JsonProcessor = {
                onLoadStart: function (host, resource) {
                    return _this.getJsonData(host, resource);
                },
                onRemoveStart: function (host, request) {
                }
            };
            var FontProcessor = {
                onLoadStart: function (host, resource) {
                    return _this.getJsonData(host, resource).then(function (config) {
                        var imageName = _this.getRelativePath(resource.url, config.file);
                        var r = host.resourceConfig.getResource(RES.nameSelector(imageName));
                        if (!r) {
                            r = { name: imageName, url: imageName, type: 'image', root: resource.root };
                        }
                        return host.load(r).then(function (texture) {
                            var font = new egret.BitmapFont(texture, config);
                            font["$resourceInfo"] = r;
                            host.save(r, texture);
                            return font;
                        }, function (e) {
                            host.remove(r);
                            throw e;
                        });
                    });
                },
                onRemoveStart: function (host, resource) {
                    var font = host.get(resource);
                    var r = font["$resourceInfo"];
                    host.unload(r);
                }
            };
            // 注入加载器
            RES.processor.map('json', JsonProcessor);
            RES.processor.map('font', FontProcessor);
        };
        JsonParser.getJsonData = function (host, resource) {
            return new Promise(function (res, rej) {
                var url = resource.root + resource.url;
                cacs.CacheStorageManager.match(url, 'json', function (data) {
                    res(data);
                });
            });
        };
        JsonParser.getRelativePath = function (url, file) {
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
        };
        return JsonParser;
    }());
    cacs.JsonParser = JsonParser;
    __reflect(JsonParser.prototype, "cacs.JsonParser");
})(cacs || (cacs = {}));
var cacs;
(function (cacs) {
    /**
    * 声音解析
    * @author likun
    */
    var SoundParser = (function () {
        function SoundParser() {
        }
        SoundParser.init = function () {
            this.request();
        };
        SoundParser.request = function () {
            var egret = window['egret'];
            var web = egret.web;
            egret.web.WebAudioSound.prototype.load = function (url) {
                var self = this;
                this.url = url;
                if (true && !url) {
                    egret.$error(3002);
                }
                cacs.CacheStorageManager.match(url, 'sound', function (arraybuffer) {
                    web.WebAudioDecode.decodeArr.push({
                        "buffer": arraybuffer,
                        "success": onAudioLoaded,
                        "fail": onAudioError,
                        "self": self,
                        "url": self.url
                    });
                    web.WebAudioDecode.decodeAudios();
                });
                function onAudioLoaded() {
                    self.loaded = true;
                    self.dispatchEventWith(egret.Event.COMPLETE);
                }
                function onAudioError() {
                    self.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
                }
            };
        };
        return SoundParser;
    }());
    cacs.SoundParser = SoundParser;
    __reflect(SoundParser.prototype, "cacs.SoundParser");
})(cacs || (cacs = {}));
