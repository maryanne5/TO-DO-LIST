import React from 'react'

export const Loading = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <img src='/assets/loading.gif' width='43' height='43' alt='loading icon' />
        </div>
    )
}
