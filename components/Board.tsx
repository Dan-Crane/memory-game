import {FC} from 'react'
import * as R from 'rambda'
import * as L from '../lib'
import * as Cell from './Cell'

// LOGIC ===============================================================================================================
export type Board = Cell.Cell[]

export let getStatusAt = (i : number) => (board : Board) : Cell.Status =>
  R.view(R.lensPath(`${i}.status`), board)

export let getStatusAts = (i : number) => (board : Board) : Cell.Status =>
  R.view(R.lensPath(`${i}.status`), board)

export let setStatusAt = (i : number) =>  (status : Cell.Status) =>  (board : Board) : Board =>
  R.set(R.lensPath(`${i}.status`), status, board)


export let setStatusesBy = (predFn: Cell.PredFn) =>  (status : Cell.Status) =>  (board : Board)  : Board=>
  R.map((cell : Cell.Cell) => predFn(cell) ? {...cell, status} : cell, board)


export let getStatusesBy = (predFn : Cell.PredFn) =>  (board : Board) : Cell.Status[] =>
  R.chain(cell => predFn(cell) ? [cell.status] : [], board)

export let getSymbolsBy = (predFn : Cell.PredFn) =>  (board : Board) : string[] =>
  R.chain(cell => predFn(cell) ? [cell.symbol] : [], board)

export let canOpenAt = (i : number) => (board : Board) : boolean => {
  return i < board.length
    && Cell.isClosed(board[i])
    && getStatusesBy (Cell.isBlocking) (board).length < 2
}

export let areOpensEqual = (board : Board) : boolean => {
  let openSymbols = getSymbolsBy(Cell.isOpen) (board)
  return openSymbols.length >= 2 && L.allEquals(openSymbols)
}

export let areOpensDifferent = (board : Board) : boolean => {
  let openSymbols = getSymbolsBy (Cell.isOpen) (board)
  return openSymbols.length >= 2 && !L.allEquals(openSymbols)
}

// символы
// test.codePointAt(0)
// 127880
// String.fromCodePoint(127880)
let codePoint   = "🍿".codePointAt(0)
// let codePointTest = (emoji : string) : number | undefined => emoji.codePointAt(0)
// let charCodeA  = "A".charCodeAt(0)

export let makeRandom = (a : number, b : number) : Board => {
  if (a * b / 2 > 36) throw new Error('too big. You are sure🤨')
  if ((a * b) % 2) throw new Error('must be even😐')
  return R.pipe(
    () => R.range(0, a * b / 2), // создать массив чисел от 0 до N
    //костыль
    R.map((i : number) => String.fromCodePoint(i + (codePoint !== undefined ? codePoint : 127871))),
    R.chain(x => [x, x]),
    L.shuffle,
    R.map((symbol : string) => ({symbol, status: Cell.Status.closed}))
  )() as Board
}

// VIEW ================================================================================================================
type BoardViewProps = {
  board : Board,
  onClickAt : (i : number) => void
}

export let BoardView : FC<BoardViewProps> = ({board, onClickAt}) => {
  return <>
    <div className='board'>
      {board.map((cell, i) =>
        <Cell.View key={i} cell={cell} onClick={_ => onClickAt(i)}/>)}
    </div>
    <style jsx>{`
      .board {
        display: inline-grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(4, 1fr);
        grid-gap: 4px;
      }
    `}</style>
  </>
}

type ScreenViewProps = {
  background : string,
}

export let ScreenView : FC<ScreenViewProps> = ({background, children}) => {
  return <>
    <div className='screen'>
      {children}
    </div>
    <style jsx>{`
      .screen {
        width: 300px;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border-radius: 10px;
        cursor: default;
        /*Тень временная*/
        box-shadow: 1px 1px 4px 0 #dacd99;
        background: ${background};
      }
      :global( h2){
        font-size: 28px;
      }
    `}</style>
  </>
}