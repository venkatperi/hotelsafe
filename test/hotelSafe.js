"use strict";
//  Copyright 2018, Venkat Peri.
//
//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the
//  "Software"), to deal in the Software without restriction, including
//  without limitation the rights to use, copy, modify, merge, publish,
//  distribute, sublicense, and/or sell copies of the Software, and to permit
//  persons to whom the Software is furnished to do so, subject to the
//  following conditions:
//
//  The above copyright notice and this permission notice shall be included
//  in all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
//  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
//  NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
//  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
//  USE OR OTHER DEALINGS IN THE SOFTWARE.
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
require("mocha");
var State_1 = require("gen-statem/dist/src/State");
var HotelSafe_1 = require("../src/HotelSafe");
var safe;
var code = [1, 2, 3, 4];
var badCode = [0, 2, 3, 4];
function stateIs(s) {
    var _this = this;
    it("in state \"" + s + "\"", function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = chai_1.expect;
                _b = State_1.stateRoute;
                return [4 /*yield*/, safe.getState()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).is.eq(s)];
        }
    }); }); });
}
function sendCode(code) {
    for (var _i = 0, code_1 = code; _i < code_1.length; _i++) {
        var d = code_1[_i];
        safe.button(d);
    }
}
describe('hotel safe', function () {
    beforeEach(function () {
        safe = new HotelSafe_1.default(200).startSM();
    });
    it('initial code is empty', function () { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, safe.getData()];
                case 1:
                    data = _a.sent();
                    chai_1.expect(data.code.length).to.eq(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('initial state is OPEN', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            stateIs('open');
            return [2 /*return*/];
        });
    }); });
    describe('locking the safe', function () {
        beforeEach(function () { return safe.reset(); });
        stateIs('locking');
        describe('times out on inactivity', function () {
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sendCode([1, 2]);
                            return [4 /*yield*/, delay(500)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            stateIs('open');
        });
        describe('enter new code', function () {
            beforeEach(function () {
                sendCode(badCode); // gets pushed out by next batch of digits
                sendCode(code);
            });
            it('stores new code', function () { return __awaiter(_this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, safe.getData()];
                        case 1:
                            data = _a.sent();
                            chai_1.expect(data.code).to.eql(code);
                            return [2 /*return*/];
                    }
                });
            }); });
            describe('press LOCK', function () {
                beforeEach(function () { return safe.lock(); });
                stateIs('closed');
            });
            describe('locked safe', function () {
                beforeEach(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, safe.lock()];
                }); }); });
                describe('enter correct code', function () {
                    beforeEach(function () { return sendCode(code); });
                    stateIs('open');
                });
                describe('enter wrong code', function () {
                    beforeEach(function () { return sendCode(badCode); });
                    describe('shows error', function () {
                        stateIs('closed/message');
                    });
                    describe('removes message after timeout', function () {
                        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, delay(500)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        stateIs('closed');
                    });
                });
            });
        });
    });
});
