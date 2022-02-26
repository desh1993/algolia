import React, { useState, useMemo, useCallback, useEffect } from 'react'
import Child from './Custom/Child'

function Test() {
    const [localNumber, setlocalNumber] = useState(0)
    const [childNumber, setChildNumber] = useState(0);
    const [numbers, setnumbers] = useState([1, 2, 3, 4, 5, 6]);

    const incrementLocal = (num = 1) => {
        return setlocalNumber(prev => prev += num)
    }

    // const changeChildNumber = (number) => {
    //     console.log('Changing Number Local Parent' + number)
    //     return setChildNumber(number)
    // }
    //this will cause rerender in Child because changeChildNUmber is recreated again & causing different referntial equality

    const changeChildNumber = useCallback(
        (number) => {
            return setChildNumber(number)
        },
        [],
    )

    const getLargestNumber = arr => {
        console.log(`I am working`)
        return Math.max(...arr)
    }

    const largestNumber = useMemo(() => getLargestNumber(numbers), [numbers])

    const changeArray = () => {
        console.log('changing array')
        // setnumbers(prev => [...prev, Math.floor(Math.random() * 100)])
        setnumbers([80, 90, 100])
    }

    return (
        <div className="Test">
            <Child
                number={childNumber}
                changeNumber={changeChildNumber}
            />
            <button onClick={e => incrementLocal(1)}>
                Increment Local
            </button>
            <h1>Local: {localNumber}</h1>
            <div>
                <h1>Largest Number:{largestNumber}</h1>
            </div>
            <div>
                <button onClick={changeArray}>Change Array</button>
            </div>
        </div>
    )
}

export default Test