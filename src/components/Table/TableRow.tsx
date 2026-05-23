import React from "react";
import "./Table.scss";

const TableRow = ({ row, actions = null }: any) => {
  return (
    <div className="table-row">
      {row.cells.map((cell: any, index: any) => (
        <div key={index} className="table-cell" style={{ width: cell.width }}>
          {cell.content}
        </div>
      ))}
      {actions && (
        <div className="table-cell actions">
          <button onClick={() => actions.onEdit(row[0].content)}>Edit</button>
          <button onClick={() => actions.onDelete(row[0].content)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TableRow;
