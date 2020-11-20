// import * as R from 'rambda'
import * as React from "react"

// LOGIC ===============================================================================================================
export enum Status {
  open = 'open',
  closed = 'closed',
  done = 'done',
  failed = 'failed',
}

export type Cell = {
  symbol: string
  status: Status
}

export type PredFn = (cell : Cell) => boolean

export let isOpen = (cell : Cell) : boolean =>
  cell.status === Status.open
// export let isOpen = R.compose(R.equals(Status.open), R.prop('status' ))
export let isClosed = (cell : Cell) : boolean =>
  cell.status === Status.closed
// export let isClosed = R.compose(R.equals(Status.closed), R.prop('status'))
export let isDone = (cell : Cell) : boolean =>
  cell.status === Status.done
// export let isDone = R.compose(R.equals(Status.done), R.prop('status'))
export let isFailed = (cell : Cell) : boolean =>
  cell.status === Status.failed
// export let isFailed = R.compose(R.equals(Status.failed), R.prop('status'))
export let isBlocking = (cell : Cell) : boolean =>
  isOpen(cell) || isFailed(cell)
// export let isBlocking = R.either(isOpen, isFailed)

// VIEW ================================================================================================================
type ViewProps = {
  cell: Cell,
  onClick: (event : React.MouseEvent) => void
}

export let View : React.FC<ViewProps> = ({cell, onClick}) =>  {
  let {status, symbol} = cell
  return <div className='cell' onClick={onClick}>
    {status === Status.closed ? '' : symbol}
    <style jsx>{`
      .cell {
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100px;
        min-width: 100px;
        font-size: 56px;
        transition: all 100ms ease-in-out;
        border-radius: 4px;
        box-shadow: ${borderShadowToStatus(status)};
        background: ${backgroundToStatus(status)};
        cursor: ${status === Status.closed ? 'pointer' : 'default'};
        transform: ${status === Status.open ? 'translate(1px, 1px)' : 'none'};
      }
      @media (max-width: 768px) {
        .cell{
          min-height: 70px;
          min-width: 70px;
          font-size: 38px;
          cursor: default;
        }
      } 
    `}</style>
  </div>
}

function backgroundToStatus(status : Status) : string {
  switch (status) {
    case Status.closed:
      return '#87ceeb'
    case Status.open:
      return '#f3e5ab'
    case Status.done:
      return '#a4cea7'
    case Status.failed:
      return '#f18681'
  }
}

function borderShadowToStatus(status : Status) : string {
  switch (status) {
    case Status.closed:
      return '2px 2px 0 rgba(0, 0, 0, 0.5)'
    case Status.open:
      return '1px 1px 1px rgba(0, 0, 0, 0.5)'
    case Status.done:
      return '2px 2px 2px rgba(143, 180, 145, 0.8)'
    case Status.failed:
      return '2px 2px 2px rgba(212, 118, 114, 0.8)'
  }
}