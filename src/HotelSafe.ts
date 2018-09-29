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


import StateMachine, {
    Handlers, keepState, nextState, repeatState, Timeout
} from "gen-statem"
import { arrayEqual } from "./arrayEqual";
import pushFixed from "./pushFixed";

type SafeData = {
    code: Array<number>,
    input: Array<number>,
    codeTimeout: Timeout,
    msgDisplay: Timeout,
    codeSize: number,
    message?: string
}

export default class HotelSafe extends StateMachine<SafeData> {
    handlers: Handlers<SafeData> = [

        // Timeout from LOCKING if inactive
        [['enter#*_#open/locking',
            'enter#*_#closed/unlocking'], ({data}) =>
            keepState().eventTimeout(data.codeTimeout)],

        // if we enter a complex state, stay there and set a timeout
        ['enter#*_#:state/*_', ({data}) =>
            keepState().timeout(data.msgDisplay)],

        // If we timeout in a complex state, go to the base state
        [['genericTimeout#*_#:state/*_',
            'eventTimeout#*_#:state/*_',],
            ({args}) => nextState(args.state)],

        // Clear data when safe enters OPEN
        ['enter#*_#open', () => keepState().data({
            code: {$set: []},
            input: {$set: []},
            message: {$set: 'R = lock'},
        })],

        // User pressed RESET -- go to LOCKING
        ['cast#reset#open', () => nextState('open/locking').data({
            message: {$set: 'Enter Code'},
        })],

        // Track the last {codeSize} digits.
        ['cast#button/:digit#open/locking', ({args, data}) => {
            let code = pushFixed(Number(args.digit), data.code, data.codeSize)
            return keepState()
                .data({
                    code: {$set: code},
                    message: {$set: code.join('')},
                })
                .eventTimeout(data.codeTimeout)
        }],

        // User pressed LOCK. CLose safe if code is long enough
        ['cast#lock#open/locking', ({data}) =>
            data.code.length === data.codeSize ?
            nextState('closed/success').data({
                message: {$set: `**${data.code.join('')}**`},
            }) :
            repeatState()],

        // Clear input when safe is closed
        ['enter#*_#closed', () => keepState().data({
            input: {$set: []},
            message: {$set: 'Locked'}
        })],

        ['cast#button/*_#closed', ({}) =>
            nextState('closed/unlocking').postpone()],


        // User entered digit(s).
        // Keep state if code is not long enough
        // OPEN if input matches code
        // go to MESSAGE if code does not match and set a timeout
        ['cast#button/:digit#closed/unlocking', ({args, data}) => {
            let digit = Number(args.digit)
            let input = data.input.concat(digit)
            return input.length < data.code.length ?
                   keepState().data({
                       input: {$push: [digit]},
                       message: {$set: "*".repeat(input.length)}
                   }) :
                   arrayEqual(data.code, input) ?
                   nextState('open/success').data({
                       message: {$set: "Opened"}
                   }) :
                   nextState('closed/error').data({
                       message: {$set: "ERROR"}
                   })
        }],
    ]

    initialData: SafeData = {
        code: [],
        codeSize: 4,
        codeTimeout: 200,
        input: [],
        msgDisplay: 200,
    }

    initialState = 'open'

    constructor(timeout: Timeout) {
        super()
        this.initialData.codeTimeout = timeout
        this.initialData.msgDisplay = timeout
    }

    reset() {
        this.cast('reset')
    }

    lock() {
        this.cast('lock')
    }

    button(digit: number) {
        this.cast({button: digit})
    }
}
