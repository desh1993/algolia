import React, { useState, useCallback } from 'react'
import List from './Custom/List'

function TestComponent({ children, randomVal }) {
    return (<div className="randomDiv">
        <h4>{randomVal}</h4>
        <div className='childrenDiv'>
            {children}
        </div>
    </div>)
}

function useCallBackComponent() {
    const [number, setNumber] = useState(1);
    const [dark, setDark] = useState(false);

    // const getItems = () => {
    //     return [number, number + 1, number + 2]
    // }
    const getItems = useCallback(
        (incrementor = 0) => {
            return [number + incrementor, number + 1 + incrementor, number + 2 + incrementor]
        },
        [number],
    )

    const theme = {
        backgroundColor: dark ? '#333' : '#FFF',
        color: dark ? '#FFF' : '#333'
    }

    return (
        <div style={theme}>
            <input
                type='number'
                value={number}
                onChange={e => setNumber(parseInt(e.target.value))}
            />
            <button onClick={() => setDark(prev => !prev)} >
                Toggle Theme
            </button>
            <List
                getItems={getItems}
            />
            <TestComponent randomVal='7777'>
                <article>
                    <div>
                        <h4>Test Component Children</h4>
                    </div>
                    <div>
                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis aspernatur maxime soluta suscipit obcaecati cupiditate eius consequuntur, fugit sint voluptas. Esse accusamus ipsa ullam provident aliquid assumenda voluptates tenetur molestias.</p>
                    </div>
                </article>
            </TestComponent>
        </div>
    )
}

export default useCallBackComponent