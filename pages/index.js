import * as R from 'rambda'
import React, {useEffect, useState} from 'react'
import * as Cell from '../components/Cell'
import * as Board from '../components/Board'

export default function Layout() {
    return (
        <GameView/>
    )
}

// LOGIC ===============================================================================================================
let Status = {
    stopped: 'stopped',
    running: 'running',
    won: 'won',
    lost: 'lost'
}

let initialBoard = [
    {status: Cell.Status.closed, symbol: '🐱‍🚀'},
    {status: Cell.Status.closed, symbol: '🎁'},
    {status: Cell.Status.closed, symbol: '😜'},
    {status: Cell.Status.closed, symbol: '🐱‍👤'},
    {status: Cell.Status.closed, symbol: '🐱‍👤'},
    {status: Cell.Status.closed, symbol: '😜'},
    {status: Cell.Status.closed, symbol: '🎁'},
    {status: Cell.Status.closed, symbol: '🐱‍🚀'},

    {status: Cell.Status.closed, symbol: '🐱‍👤'},
    {status: Cell.Status.closed, symbol: '😜'},
    {status: Cell.Status.closed, symbol: '🎁'},
    {status: Cell.Status.closed, symbol: '🐱‍🚀'},


    {status: Cell.Status.closed, symbol: '🐱‍👤'},
    {status: Cell.Status.closed, symbol: '😜'},
    {status: Cell.Status.closed, symbol: '🐱‍🚀'},
    {status: Cell.Status.closed, symbol: '🎁'},
]

let startGame = (state) => ({
    ...state,
    board: initialBoard,
    status: Status.running
})

let openCell = R.curry((i, state) => {
    return{
        ...state,
        board: Board.setStatusAt(i, Cell.Status.open, state.board)
    }
})

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

//VIEW =================================================================================================================
function GameView() {
    let [state, setState] = useState({
        board: initialBoard,
        status: Status.stopped
    })

    let {board, status} = state

    function handleStartingClick(i) {
        if (status !== Status.running) {
            setState(startGame)
        }
    }

    function handleRunningClick(i) {
        if (status === Status.running) {
            setState(openCell(i))
        }
    }

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

    return <div onClick={handleStartingClick}>
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
                    <h2>Начать игру 😉</h2>
                    <span>кликните на экран, чтобы начать</span>
                </div>
            </Board.ScreenView>
        case Status.won :
            return <Board.ScreenView className={Status.won}>
                <div>
                    <h2>Вы выиграли 😄</h2>
                    <span>кликните на экран, чтобы начать</span>
                </div>
            </Board.ScreenView>
        case Status.lost :
            return <Board.ScreenView className={Status.lost}>
                <div>
                    <h2>Вы проиграли 🙁</h2>
                    <span>кликните на экран, чтобы начать</span>
                </div>
            </Board.ScreenView>
    }
}