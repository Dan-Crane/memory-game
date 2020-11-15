import * as R from 'rambda'
import React, {useEffect, useState} from 'react'
import * as Cell from './Cell'
import * as Board from './Board'

// LOGIC ===============================================================================================================
let Status = {
    stopped: 'stopped',
    running: 'running',
    won: 'won',
    lost: 'lost'
}

let initialBoard = [
    {status: Cell.Status.closed, symbol: '😀'},
    // {status: Cell.Status.closed, symbol: '🍺'},
    // {status: Cell.Status.closed, symbol: '🍿'},
    {status: Cell.Status.closed, symbol: '😀'},
    // {status: Cell.Status.closed, symbol: '🍖'},
    // {status: Cell.Status.closed, symbol: '🍿'},
    // {status: Cell.Status.closed, symbol: '🍖'},
    // {status: Cell.Status.closed, symbol: '🍺'},
]

let startGame = (state) => ({
    ...state,
    board: initialBoard,
    status: Status.running,
    secondLeft: 60
})

let canOpenCell = R.curry((i, state) => {
    return Board.canOpenAt(i, state.board)
})

let openCell = R.curry((i, state) => ({
    ...state,
    board: Board.setStatusAt(i, Cell.Status.open, state.board)
}))

let succeedStep = (state) => ({
    ...state,
    board: Board.setStatusesBy(Cell.isOpen, Cell.Status.done, state.board)
})

let failStep1 = (state) => ({
    ...state,
    board: Board.setStatusesBy(Cell.isOpen, Cell.Status.failed, state.board),
})

let failStep2 = (state) => ({
    ...state,
    board: Board.setStatusesBy(Cell.isFailed, Cell.Status.closed, state.board),
})

function hasWinningCond(state) {
    return R.filter(Cell.isDone, state.board).length === state.board.length
}

function hasLosingCond(state) {
    return !state.secondLeft
}

let setStatus = R.curry((status, state) => ({...state, status}))

let nextSecond = (state) => ({
    ...state,
    secondLeft: Math.max(state.secondLeft - 1, 0)
})

//VIEW =================================================================================================================
export function View() {
    let [state, setState] = useState({
        ...startGame(),
        status: Status.stopped,
    })

    let {board, status, secondLeft} = state

    function handleStartingClick(i) {
        if (status !== Status.running) {
            setState(startGame)
        }
    }

    function handleRunningClick(i) {
        if (status === Status.running && canOpenCell(i, state)) {
            setState(openCell(i))
        }
    }

    // open || close cell
    useEffect(_ => {
        if (Board.areOpensEqual(board)) {
            setState(succeedStep)
        } else if (Board.areOpensDifferent(board)) {
            setState(failStep1)
            setTimeout(_ => {
                setState(failStep2)
            }, 500)
        }
    }, [board])

    // won || lost status
    useEffect(_ => {
        if (status === Status.running) {
            if (hasWinningCond(state)) {
                return setState(setStatus(Status.won))
            } else if (hasLosingCond(state)) {
                return setState(setStatus(Status.lost))
            }
        }
    }, [state])

    // timeout
    useEffect(_ => {
        let timer = null
        if (status === Status.running) {
            timer = setInterval(() => {
                setState(nextSecond)
            }, 1000)
        }

        return () => clearInterval(timer)
    }, [state])

    return <div onClick={handleStartingClick}>
        <StatusLineView status={status} secondLeft={secondLeft}/>
        <ScreenBoxView status={status} board={board} onClickAt={handleRunningClick}/>
    </div>
}

function ScreenBoxView({status, board, onClickAt}) {
    switch (status) {
        case Status.running :
            return <Board.BoardView board={board} onClickAt={onClickAt}/>
        case Status.stopped :
            return <Board.ScreenView className={Status.stopped}>
                <div>
                    <h2>Start game😉</h2>
                    <span>click on the screen to start</span>
                </div>
            </Board.ScreenView>
        case Status.won :
            return <Board.ScreenView className={Status.won}>
                <div>
                    <h2>You won😄</h2>
                    <span>click on the screen to start</span>
                </div>
            </Board.ScreenView>
        case Status.lost :
            return <Board.ScreenView className={Status.lost}>
                <div>
                    <h2>You loos 🙁</h2>
                    <span>click on the screen to start</span>
                </div>
            </Board.ScreenView>
    }
}

function StatusLineView({status, secondLeft}) {
    return <div className='status-line'>
        <span>
            {status === Status.running ? "🐱‍🏍" : 'Do it🐱‍👤'}
        </span>
        <span>
            {status === Status.running && `⏳:`}
        </span>
        <span className='seconds'>
            {status === Status.running && `${secondLeft}`}
        </span>
    </div>
}