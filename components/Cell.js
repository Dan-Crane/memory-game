import * as R from 'rambda'
import React from 'react'

// LOGIC ===============================================================================================================

export let Status = {
    open: 'open',
    closed: 'closed',
    done: 'done',
    failed: 'failed',
}

// export let isOpen = (sel) => sel.status === Status.open
export let isOpen = R.compose(R.equals(Status.open), R.prop('status'))
//export let isClosed = (sel) => sel.status === Status.closed
export let isClosed = R.compose(R.equals(Status.closed), R.prop('status'))
//export let isDone = (sel) => sel.status === Status.done
export let isDone = R.compose(R.equals(Status.done), R.prop('status'))
// export let isFailed = (sel) => sel.status === Status.failed
export let isFailed = R.compose(R.equals(Status.failed), R.prop('status'))
// export let isBlocking = (sel) => isOpen(sel) || isFailed(sel)
export let isBlocking = R.either(isOpen, isFailed)

// VIEW ================================================================================================================

export function View({cell, onClick}) {
    let {status, symbol} = cell
    return <div className={`cell ${classByStatus(status)}`} onClick={onClick}>
        {status === Status.closed ? '' : symbol}
    </div>
}

export function classByStatus(status) {
    return status.toLowerCase()
}