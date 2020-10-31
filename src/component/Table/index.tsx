import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import MaterialTable from 'material-table'

export default function ActionOverriding({title, columns, rows}) {
    return (
      <MaterialTable
        title={title}
        columns={columns}
        data={rows}
      />
    )
  }