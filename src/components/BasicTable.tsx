import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useEffect, useState } from "react";

import moment from "moment";

interface UserInterface {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  dob: string;
}

const columnHelper = createColumnHelper<UserInterface>();

const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue(),
    footer: () => "ID",
  }),
  // columnHelper.accessor("first_name", {
  //   header: () => "First Name",
  //   cell: (info) => info.getValue(),
  //   footer: () => "First Name",
  // }),
  // columnHelper.accessor("last_name", {
  //   header: () => "Last Name",
  //   cell: (info) => info.getValue(),
  //   footer: () => "Last Name",
  // }),
  columnHelper.accessor((row) => `${row.first_name} ${row.last_name}`, {
    id: "full_name",
    header: () => "Full Name",
    cell: (info) => info.getValue(),
    footer: () => "Full Name",
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => info.getValue(),
    footer: () => "Email",
  }),
  columnHelper.accessor("gender", {
    header: () => "Gender",
    cell: (info) => info.getValue(),
    footer: () => "Gender",
  }),
  columnHelper.accessor("dob", {
    header: () => "Date of birth",
    cell: (info) => moment(info.getValue()).format("DD MMM YYYY"),
    footer: () => "Date of birth",
  }),
];

const BasicTable = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtering, setFiltering] = useState("");

  const handleGlobalFilterChange = (value: string) => {
    setFiltering(value);
  };

  const table = useReactTable({
    data: users,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: handleGlobalFilterChange,
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("Sorting state: ", sorting);
      const url = `http://localhost:3004/users`;
      const res = await fetch(url);
      const data = await res.json();
      if (data) {
        setUsers(data);
      }
    };

    fetchData();
  }, [sorting]);

  return (
    <div>
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
      />
      <table className="w3-table-all w3-hoverable">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted()
                    ? header.column.getIsSorted() === "asc"
                      ? "⬆️"
                      : "⬇️"
                    : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {/* <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((footer) => (
                <td key={footer.id}>
                  {flexRender(
                    footer.column.columnDef.footer,
                    footer.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </table>
      <div className="w3-bar">
        <button
          onClick={() => table.setPageIndex(0)}
          className="w3-button w3-black"
        >
          First Page
        </button>
        <button
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className="w3-button w3-teal"
        >
          Previous Page
        </button>
        <button
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className="w3-button w3-black"
        >
          Next page
        </button>
        <button
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          className="w3-button w3-teal"
        >
          Last Page
        </button>
      </div>
    </div>
  );
};

export default BasicTable;
