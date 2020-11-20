import * as R from 'rambda'
import * as L from '../lib'
import React from 'react'
import * as Cell from './Cell'

// LOGIC ===============================================================================================================
export let getStatusAt = R.curry((i, board) => {
  return R.view(R.lensPath(`${i}.status`), board)
})

export let setStatusAt = R.curry((i, status, board) => {
  // console.log(R.set(R.lensPath(`${i}.status`), status, board))
  return R.set(R.lensPath(`${i}.status`), status, board)
})

export let setStatusesBy = R.curry((predFn, status, board) => {
  return R.map(cell => predFn(cell) ? {...cell, status} : cell, board)
})

export let getStatusesBy = R.curry((predFn, board) => {
  return R.chain(cell => predFn(cell) ? [cell.status] : [], board)
})

export let getSymbolsBy = R.curry((predFn, board) => {
  // console.log(R.chain(cell => predFn(cell) ? [cell] : [], board))
  let PasSymb = R.filter(predFn, board)
  // console.log(R.pluck("symbol", PasSymb))
  return R.chain(cell => predFn(cell) ? [cell.symbol] : [], board)
})

export let canOpenAt = R.curry((i, board) => {
  return i < board.length
    && Cell.isClosed(board[i])
    && getStatusesBy(Cell.isBlocking, board).length < 2
})

export let areOpensEqual = (board) => {
  let openSymbols = getSymbolsBy(Cell.isOpen, board)
  return openSymbols.length >= 2 && L.allEquals(openSymbols)
}

export let areOpensDifferent = (board) => {
  let openSymbols = getSymbolsBy(Cell.isOpen, board)
  return openSymbols.length >= 2 && !L.allEquals(openSymbols)
}

// символы
// test.codePointAt(0)
// 127880
// String.fromCodePoint(127880)
let codePoint = "🍿".codePointAt(0)

export let makeRandom = (a, b) => {
  if (a * b / 2 > 36) throw new Error('too big. You are sure🤨')
  if ((a * b) % 2) throw new Error('must be even😐')
  return R.pipe(
    () => R.range(0, a * b / 2), // создать массив чисел от 0 до N
    R.map(i => String.fromCodePoint(codePoint + i)),
    R.chain(x => [x, x]),
    L.shuffle,
    R.map(symbol => ({symbol, status: Cell.Status.closed}))
  )()
}

// VIEW ================================================================================================================
export function BoardView({board, onClickAt}) {
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

export function ScreenView({background, children}) {
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