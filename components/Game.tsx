import * as R from 'rambda'
import React, {FC, useEffect, useState} from 'react'
import * as Cell from './Cell'
import * as Board from './Board'

// LOGIC ===============================================================================================================
export enum Status  {
  stopped ='stopped',
  running ='running',
  won ='won',
  lost ='lost'
}

export type State = {
  board : Board.Board
  status: Status
  secondLeft : number
}

let startGame = () => ({
  board: Board.makeRandom(4, 4),
  status: Status.running,
  secondLeft: 60
})

let canOpenCell = (i : number) => (state : State) : boolean => {
  return Board.canOpenAt (i) (state.board)
}

let openCell = (i : number) => (state : State) : State => ({
  ...state,
  board: Board.setStatusAt (i) (Cell.Status.open) (state.board)
})

let succeedStep = (state : State) : State => ({
  ...state,
  board: Board.setStatusesBy (Cell.isOpen) (Cell.Status.done) (state.board)
})

let failStep1 = (state : State) : State => ({
  ...state,
  board: Board.setStatusesBy (Cell.isOpen) (Cell.Status.failed) (state.board),
})

let failStep2 = (state : State) : State => ({
  ...state,
  board: Board.setStatusesBy (Cell.isFailed) (Cell.Status.closed) (state.board),
})

function hasWinningCond(state : State) : boolean {
  return R.filter(Cell.isDone, state.board).length === state.board.length
}

function hasLosingCond(state : State) : boolean{
  return !state.secondLeft
}

let setStatus = (status : Status) => (state : State) : State => ({...state, status})

let nextSecond = (state : State) : State => ({
  ...state,
  secondLeft: Math.max(state.secondLeft - 1, 0)
})

//VIEW =================================================================================================================
export let View : FC = () => {
  let [state, setState] = useState<State>({
    ...startGame(),
    status: Status.stopped,
  })

  let {board, status, secondLeft} = state

  let handleStartingClick = () => {
    if (status !== Status.running) {
      setState(startGame)
    }
  }

  let handleRunningClick = (i : number) => {
    if (status === Status.running && canOpenCell(i) (state)) {
      setState(openCell(i))
    }
  }

  // open || close cell
  useEffect(() => {
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
  useEffect(() => {
    if (status === Status.running) {
      if (hasWinningCond(state)) {
        return setState(setStatus(Status.won))
      } else if (hasLosingCond(state)) {
        return setState(setStatus(Status.lost))
      }
    }
  }, [state])

  // timeout
  useEffect(() => {
    let timer : ReturnType<typeof setInterval> | undefined = undefined
    if (status === Status.running && !timer) {
      timer = setInterval(() => {
        setState(nextSecond)
      }, 1000)
    }

    return () => {
      timer ? clearInterval(timer) : null
    }
  }, [status])

  return <div onClick={_ => handleStartingClick()}>
    <StatusLineView status={status} secondLeft={secondLeft}/>
    <ScreenBoxView status={status} board={board} onClickAt={handleRunningClick}/>
  </div>
}

type ScreenBoxViewProps = {
  status : Status
  board : Board.Board
  onClickAt : (i : number) => void
}
let ScreenBoxView:FC<ScreenBoxViewProps> = ({status, board, onClickAt}) => {
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

type StatusLineViewProps = {
  status : Status,
  secondLeft : number
}
let StatusLineView : FC<StatusLineViewProps>= ({status, secondLeft}) => {
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

let backgroundToStatus = (status : Status) : string => {
  switch (status) {
    case Status.won:
      return '#a4cea7'
    case Status.lost:
      return '#f18681'
    default :
      return '#f3e5ab'
  }
}