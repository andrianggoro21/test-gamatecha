import { useTable } from 'react-table';

const DataTable = ({ columns, data, page }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
        <tr>
          <th className="py-3 px-6 text-left w-10">No</th>
          {headerGroups.map(headerGroup => (
            headerGroup.headers.map(column => (
              <th key={column.id} {...column.getHeaderProps()} className="py-3 px-6 text-left">
                {column.render('Header')}
              </th>
            ))
          ))}
        </tr>
      </thead>
      <tbody className="text-gray-700" {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr key={row.id} {...row.getRowProps()} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-4 px-6 text-center">{(page - 1) * 10 + index + 1}</td> 
              {row.cells.map(cell => (
                <td key={cell.id} {...cell.getCellProps()} className="py-4 px-6">
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default DataTable;
