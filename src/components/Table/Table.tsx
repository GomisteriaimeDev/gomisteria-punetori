import React from "react";
import "./Table.scss";
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

const Table = ({ columns, rows, actions = null }: any) => {
  return (
    <div className="table-container">
      <TableHeader columns={columns} hasActions={!!actions} />
      <div className="table-body">
        {rows.length > 0 ? (
          rows.map((row: any, index: any) => (
            <div
              className="table-row-wrapper"
              key={index}
              onClick={row.onClick ? row.onClick : null}
              style={{ cursor: row.onClick ? "pointer" : "default" }}
            >
              <TableRow row={row} actions={actions} />
            </div>
          ))
        ) : (
          <div className="no-results">No results found!</div>
        )}
      </div>
    </div>
  );
};

export default Table;
