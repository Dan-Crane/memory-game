import React from 'react'

// LOGIC ===============================================================================================================

export let Status = {
    open: 'open',
    closed: 'closed',
    done: 'done',
    failed: 'failed',
}

export let isOpen = (sel) => sel.status === Status.open
export let isClosed = (sel) => sel.status === Status.closed
export let isDone = (sel) => sel.status === Status.done
export let isFailed = (sel) => sel.status === Status.failed

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