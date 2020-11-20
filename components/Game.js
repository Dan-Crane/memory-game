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

let startGame = (state) => ({
  ...state,
  board: Board.makeRandom(6, 6),
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
      return <Board.ScreenView background={backgroundToStatus(status)}>
        <div>
          <h2>Start game😉</h2>
          <span>click on the screen to start</span>
        </div>
      </Board.ScreenView>
    case Status.won :
      return <Board.ScreenView background={backgroundToStatus(status)}>
        <div>
          <h2>You won😄</h2>
          <span>click on the screen to start</span>
        </div>
      </Board.ScreenView>
    case Status.lost :
      return <Board.ScreenView background={backgroundToStatus(status)}>
        <div>
          <h2>You loos 🙁</h2>
          <span>click on the screen to start</span>
        </div>
      </Board.ScreenView>
  }
}

function StatusLineView({status, secondLeft}) {
  return <>
    <div className='status-line'>
        <span className='text'>
            {status === Status.running ? "🐱‍🏍" : 'Do it🐱‍👤'}
        </span>
      <span className='time-icon'>
            {status === Status.running && `⏳:`}
        </span>
      <span className='seconds'>
            {status === Status.running && `${secondLeft}`}
        </span>
    </div>
    <style jsx>{`
      .status-line{
        display: grid;
        grid-template-columns: minmax(min-content, 100%) minmax(min-content, auto) minmax(min-content, auto);
        justify-items: stretch;
        align-items: center;    
      }
      .text{
        font-size: 22px;
      }
      .time-icon{
        font-size: 22px;
      }
      .seconds{
        text-align: right;
        min-width: 35px;
        font-size: 28px;
      }
      @media all and (max-width: 768px){
        .text{
          font-size: 18px;
        }
        .time-icon{
          font-size: 18px;
        }
        .seconds{
          min-width: 22px;
          font-size: 18px;
        }
      }
    `}</style>
  </>
}

function backgroundToStatus(status) {
  switch (status) {
    case Status.won:
      return '#a4cea7'
    case Status.lost:
      return '#f18681'
    default :
      return '#f3e5ab'
  }
}