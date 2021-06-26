"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplyBlock = void 0;
var crypto_1 = __importDefault(require("crypto"));
var SimplyBlock = /** @class */ (function () {
    /**
     * Create a block
     * @param {number} index 0-based index of the block
     * @param {number} timestamp timestamp of the block
     * @param {*} data data to be added to the block
     * @param {string = ''} previous_hash hash of the previous block
     */
    function SimplyBlock(index, timestamp, data, previous_hash) {
        if (previous_hash === void 0) { previous_hash = ''; }
        this._index = index;
        this._timestamp = timestamp;
        this._data = data;
        this._nonce = 0;
        this._previous_hash = previous_hash;
        this._difficulty = 4;
    }
    Object.defineProperty(SimplyBlock.prototype, "nonce", {
        /**
         * @type {number}
         */
        get: function () {
            return this._nonce;
        },
        set: function (value) {
            if (typeof value !== 'number' || value < 0)
                throw 'Invalid nonce value';
            this._nonce = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimplyBlock.prototype, "previousHash", {
        /**
         * @type {?string}
         */
        get: function () {
            return this._previous_hash;
        },
        set: function (value) {
            this._previous_hash = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimplyBlock.prototype, "difficulty", {
        /**
         * @type {number}
         */
        get: function () {
            return this._difficulty;
        },
        set: function (value) {
            if (typeof value !== 'number' || value < 0)
                throw 'Invalid difficulty value';
            this._difficulty = value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Hash the block
     * @returns {string}
     */
    SimplyBlock.prototype.hash = function () {
        var message = '' + this._index;
        message += this._timestamp;
        message += JSON.stringify(this._data);
        message += this._previous_hash;
        message += this._nonce;
        return crypto_1.default.createHash('sha256').update(message).digest('hex');
    };
    /**
     * Mine a block asyncronusly
     * @returns {Promise}
     */
    SimplyBlock.prototype.mineAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var that;
            return __generator(this, function (_a) {
                that = this;
                return [2 /*return*/, new Promise(function (resolve) {
                        while (that.hash().substring(0, that.difficulty) !== Array(that.difficulty).fill('0').join('')) {
                            that._nonce++;
                        }
                        resolve(that._nonce);
                    })];
            });
        });
    };
    /**
     * Mine the block synchronously
     * @param {function} callback optional callback when successfully mined
     * @returns {number} the nonce of the block
     */
    SimplyBlock.prototype.mineSync = function (fn) {
        while (this.hash().substring(0, this._difficulty) !== Array(this._difficulty).fill('0').join('')) {
            this._nonce++;
        }
        if (fn)
            fn(this._nonce);
        return this._nonce;
    };
    return SimplyBlock;
}());
exports.SimplyBlock = SimplyBlock;
