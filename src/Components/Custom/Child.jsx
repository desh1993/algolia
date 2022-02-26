import React, { memo } from 'react'

function Child({
    number,
    changeNumber
}) {
    console.log('HERE')
    const changeNumberLocal = () => {
        return changeNumber(Math.random())
    }

    return (<div>
        <h1>Child: {number}</h1>
        <button onClick={changeNumberLocal}>
            Change Child Number
        </button>
    </div>)
}

export default memo(Child) 