import { ColumnModel } from 'tubular-common';
import {
    AggregateFunctions,
    ColumnDataType,
    ColumnSortDirection
} from "tubular-common";
/*
const columns = [
    new ColumnModel("OrderD", {
        dataType: ColumnDataType.Numeric,
        filterable: true,
        isKey: true,
        label: "Id",
        sortDirection: ColumnSortDirection.Ascending,
        sortOrder: 1,
        sortable: true
    }),
    new ColumnModel("CustomerName", {
        aggregate: AggregateFunctions.Count,
        filterable: true,
        searchable: true,
        sortable: true
    }),
    new ColumnModel("ShippedDate", {
        dataType: ColumnDataType.DateTime,
        filterable: true,
        sortable: true
    }),
    new ColumnModel("ShipperCity"),
    new ColumnModel("Amount", {
        dataType: ColumnDataType.Numeric,
        sortable: true
    }),
    new ColumnModel("IsShipped", {
        dataType: ColumnDataType.Boolean,
        filterable: true,
        sortable: true
    })
];
*/

const columns = [
    new ColumnModel("id", {
        dataType: ColumnDataType.Numeric,
        filterable: true,
        isKey: true,
        label: "Id",
        sortDirection: ColumnSortDirection.Ascending,
        sortOrder: 1,
        sortable: true
    }),
    new ColumnModel("title", {
        aggregate: AggregateFunctions.Count,
        label: "제목",
        searchable: true,
        filterable: true,
        sortable: true
    }),
    new ColumnModel("sender", {
        label: "작성자",
        filterable: true,
        sortable: true
    }),
    new ColumnModel("receiver", { label: "전송대상", }),
    new ColumnModel("read_num", { label: "확인인원", }),
    new ColumnModel("comment_num", { label: "댓글", }),
    new ColumnModel("file", { label: "첨부", }),
    new ColumnModel("time", {
        dataType: ColumnDataType.DateTime,
        label: "작성시간",
        filterable: true,
        sortable: true
    }),
]
export default columns;