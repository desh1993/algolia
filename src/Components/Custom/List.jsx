import React, { useEffect, useState } from 'react'

function List({ getItems }) {
    const [items, setItems] = useState([]);
    useEffect(() => {
        setItems(getItems(5))
        console.log('Updating Items')
    }, [getItems]); //whenever a rerender happens , the getItems function gets created again & this will trigger the useEffect hook which depends on the getItems function
    // Also because of referential equality 

    return (
        <>
            {
                items.map(item => {
                    return (<div key={item}>
                        {item}
                    </div>)
                })
            }
        </>
    )
}

export default List