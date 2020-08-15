import React from "react"
import '../../style/notfound.css'

const NoDataBox = ({message}) =>
    <div className='nf-root'>
        <div className='nf-icon'></div>
        <div className='nf-main nf-msg'>Data Empty</div>
        <div className='nf-sub nf-msg'>{message}</div>
    </div>
export default NoDataBox