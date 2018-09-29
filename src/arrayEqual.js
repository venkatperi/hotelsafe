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
Object.defineProperty(exports, "__esModule", { value: true });
function arrayEqual(arr1, arr2) {
    var l1 = arr1.length;
    if (l1 !== arr2.length) {
        return false;
    }
    for (var i = 0; i < l1; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}
exports.arrayEqual = arrayEqual;
function objEqual(a, b) {
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    for (var _i = 0, aKeys_1 = aKeys; _i < aKeys_1.length; _i++) {
        var k = aKeys_1[_i];
        if (a[k] !== b[k]) {
            return false;
        }
    }
    return true;
}
exports.objEqual = objEqual;
