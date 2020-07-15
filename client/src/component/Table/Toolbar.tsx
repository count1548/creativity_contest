import React, {useState, useEffect}  from "react"
import Button from '@material-ui/core/Button';

const Header = ({component}) =>
    <div style={{paddingLeft:'50px', fontSize:'20px', marginBottom:'30px'}}>
        {component}
    </div>
//float parent height 유지 
//button 스타일 변경
//click event 설정
const SelectBox = ({children}) =>
    <div style={{
        width:'calc(100% - 100px)',
        padding:'30px',
        background: '#eee',
        borderRadius:'20px',
        margin:'10px auto'
    }}> 
        {children}
    </div>

const OptionBox = ({name, options}) => {
    return (
        <div style={{
            padding:'10px',
        }}>
            <div>{name}</div>
            {options.map(option => (
                <Button variant="contained">{option}</Button>
            ))}
        </div>
    )
}

const Toolbar = (props) => {
    const {title} = props
    return (
        <div style={{
            minHeight: '300px',
            padding: '10px'
        }}>
            <Header component={title}/>
            <SelectBox> 
                <OptionBox 
                    name='캠퍼스' 
                    options={['아산캠퍼스', '천안캠퍼스']}/>
                <OptionBox 
                    name='등하교' 
                    options={['등교', '하교']}/>
            </SelectBox>
            <SelectBox> </SelectBox>
        </div>
    )
}
export default Toolbar