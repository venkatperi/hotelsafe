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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gen_statem_1 = require("gen-statem");
var arrayEqual_1 = require("./arrayEqual");
var pushFixed_1 = require("./pushFixed");
var HotelSafe = /** @class */ (function (_super) {
    __extends(HotelSafe, _super);
    function HotelSafe(timeout) {
        var _this = _super.call(this) || this;
        _this.handlers = [
            // Clear data when safe enters OPEN
            ['enter#*_#open', function () { return gen_statem_1.keepState().data({
                    code: { $set: [] },
                    input: { $set: [] },
                    message: { $set: 'R = lock' },
                }); }],
            // User pressed RESET -- get new code
            ['cast#reset#open', function () { return gen_statem_1.nextState('open/locking').data({
                    message: { $set: 'Enter Code' },
                }); }],
            // Track the last {codeSize} digits.
            // show code on display
            ['cast#button/:digit#open/locking', function (_a) {
                    var args = _a.args, data = _a.data;
                    var code = pushFixed_1.default(Number(args.digit), data.code, data.codeSize);
                    return gen_statem_1.keepState().data({
                        code: { $set: code },
                        message: { $set: code.join('') },
                    }).eventTimeout(data.codeTimeout);
                }],
            // User pressed LOCK. CLose safe if code is long enough
            // else, repeat state (sets timeout on reentry)
            ['cast#lock#open/locking', function (_a) {
                    var data = _a.data;
                    return data.code.length === data.codeSize ?
                        gen_statem_1.nextState('closed/success').data({
                            message: { $set: "**" + data.code.join('') + "**" },
                        }) :
                        gen_statem_1.repeatState();
                }],
            // Clear input when safe is closed
            ['enter#*_#closed', function () { return gen_statem_1.keepState().data({
                    input: { $set: [] },
                    message: { $set: 'Locked' }
                }); }],
            // Postpone button press and go to closed/unlocking
            ['cast#button/*_#closed', function (_a) {
                    return gen_statem_1.nextState('closed/unlocking').postpone();
                }],
            // User entered digit(s).
            // Keep state if code is not long enough
            // OPEN if input matches code
            // go to MESSAGE if code does not match and set a timeout
            ['cast#button/:digit#closed/unlocking', function (_a) {
                    var args = _a.args, data = _a.data;
                    var digit = Number(args.digit);
                    var input = data.input.concat(digit);
                    // code is the correct length. Decision time.
                    if (input.length >= data.code.length) {
                        return arrayEqual_1.arrayEqual(data.code, input) ?
                            gen_statem_1.nextState('open/success')
                                .data({ message: { $set: "Opened" } }) :
                            gen_statem_1.nextState('closed/error')
                                .data({ message: { $set: "ERROR" } });
                    }
                    // Not long enough. Keep collecting digits.
                    // Show masked code
                    return gen_statem_1.keepState().data({
                        input: { $push: [digit] },
                        message: { $set: "*".repeat(input.length) }
                    }).eventTimeout(data.codeTimeout);
                }],
            // These states timeout on inactivity (eventTimeout)
            [['enter#*_#open/locking',
                    'enter#*_#closed/unlocking'], function (_a) {
                    var data = _a.data;
                    return gen_statem_1.keepState().eventTimeout(data.codeTimeout);
                }],
            // else if we enter a complex state, stay there and set a timeout
            ['enter#*_#:state/*_', function (_a) {
                    var data = _a.data;
                    return gen_statem_1.keepState().timeout(data.msgDisplay);
                }],
            // If we timeout in a sub state, go to the base state
            [['genericTimeout#*_#:state/*_',
                    'eventTimeout#*_#:state/*_',],
                function (_a) {
                    var args = _a.args;
                    return gen_statem_1.nextState(args.state);
                }],
        ];
        _this.initialData = {
            code: [],
            codeSize: 4,
            codeTimeout: 200,
            input: [],
            msgDisplay: 200,
        };
        _this.initialState = 'open';
        _this.initialData.codeTimeout = timeout;
        _this.initialData.msgDisplay = timeout;
        return _this;
    }
    /**
     * Safe Interface. casts 'reset'
     */
    HotelSafe.prototype.reset = function () {
        this.cast('reset');
    };
    /**
     * Safe Interface. cast 'lock'
     */
    HotelSafe.prototype.lock = function () {
        this.cast('lock');
    };
    /**
     * Safe Interface. send button digit
     * @param digit
     */
    HotelSafe.prototype.button = function (digit) {
        this.cast({ button: digit });
    };
    return HotelSafe;
}(gen_statem_1.default));
exports.default = HotelSafe;
