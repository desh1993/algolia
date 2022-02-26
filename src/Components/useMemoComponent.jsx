import React, { useState, useMemo, useEffect } from 'react'

function useMemoComponent() {
    const [number, setNumber] = useState(1);
    const [dark, setDark] = useState(false);

    //if dark === false, then the reference of the obj will be the same
    //else if dark becomes true, then the reference of the obj will be UPDATED
    const theme = useMemo(() => {
        return {
            backgroundColor: dark ? '#333' : '#FFF',
            color: dark ? '#FFF' : '#333'
        }
    }, [dark]) //will create a new theme obj when dark changes from true to false  or false to true

    useEffect(() => {
        console.log(`Theme changed 1`)
    }, [theme]); //will be triggered everytime because after every rerender the theme obj memory address is updated

    // const doubleNumber = slowFunction(number)
    const doubleNumber = useMemo(() => slowFunction(number, 3), [number])
    return (
        <>
            <input
                type='number'
                value={number}
                onChange={e => setNumber(parseInt(e.target.value))}
            />
            <button onClick={() => setDark(prev => !prev)} >
                Toggle Theme
            </button>
            <div style={theme}>
                {doubleNumber}
            </div>
        </>
    )
}

function slowFunction(number, multiplier = 2) {
    console.log(`Calling Slow function`);
    for (let i = 0; i < 1000000000; i++) {

    }
    return number * multiplier
}

export default useMemoComponent