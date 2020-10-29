import React from 'react';
import MaterialTable, { Column } from 'material-table';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

interface Row {
  name: string;
  surname: string;
  birthYear: number;
  birthCity: number;
}

interface TableState {
  columns: Array<Column<Row>>;
  data: Row[];
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root : {
          borderRadius: "10px",
          boxShadow: "0"
        },
    }),
)

export default function MaterialTableDemo({columns, data}) {
  const classes = useStyles()

  return (
    <div >
      <MaterialTable
        title="Editable Example"
        columns={columns}
        data={data}
        components = {{
          Toolbar : props => null,
          Container : props =>  <div style={{}}>{props.children}</div>,
        }}
        options = {{
          selection : true,
          headerStyle : {
            background:'#eee',
            borderBottom:'2px solid black'
          }
        }}/>
    </div>
  );
}
