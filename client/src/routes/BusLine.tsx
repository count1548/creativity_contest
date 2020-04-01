import React, { useEffect,useState } from "react";
import Table from "../component/Table/Table";
interface IParentProps{//props타입 선언
	tableTitle:string
	path:string
}
interface IParentState{//state타입 선언
    columnsTitle:Columns[];
}
interface Columns{//컬럼 타입
        title:string
        field:string
        readonly?:boolean//'?문자' -> readonly가 있을수도 업을수도 있음
}

class Line extends React.Component<IParentProps,IParentState> {
    constructor(props:IParentProps){
        super(props)
        this.state={
            columnsTitle:[
                { title: "INDEX", field: "IDX_BUS_LINE", readonly: true },
				{ title: "노선ID", field: "BUS_LINE_ID" },
				{ title: "정류장ID", field: "BUS_STOP_ID" },
				{ title: "경유순서", field: "LINE_SEQUENCE" }
            ]
        }
    }
    render(){
        return (
                 <div/>
        )
    }
    
}

export default Line;
