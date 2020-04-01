import React  from "react";
//import Table from "../component/Table/Table";
import Table from "../component/Table/Table";
import columns from '../component/Table/columns';


interface IParentProps{//props타입 선언
    tableTitle:string
    path:string
    history : {
        push : (path:string) => void
    }
}
interface Columns{//컬럼 타입
        title:string
        field:string
        readonly?:boolean// '?문자' -> readonly가 있을수도 업을수도 있음
}

class Notice extends React.Component<IParentProps> {
    render(){
        return (
            <Table title = "Bus Stop"
                columns = {columns}
                push = {(name) => {this.props.history.push(name)}}/>
        )
    }
}

export default Notice;
