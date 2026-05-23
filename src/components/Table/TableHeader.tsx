import React from "react";
import "./Table.scss";

const TableHeader = ({ columns, hasActions }: any) => {
  return (
    <div className="table-header">
      {columns.map((col: any, index: any) => (
        <div key={index} className="table-cell" style={{ width: col.width }}>
          {col.title}
        </div>
      ))}
      {hasActions && <div className="table-cell">{" "}</div>}
    </div>
  );
};

export default TableHeader;
