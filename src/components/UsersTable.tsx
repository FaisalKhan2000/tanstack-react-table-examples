import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FormEvent, useEffect, useState } from "react";
import "./users-table.css";

// Updated User interface to match the provided data structure
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("firstName", {
    header: () => "First Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("lastName", {
    header: () => "Last Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("age", {
    header: () => "Age",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("phone", {
    header: () => "Phone",
    cell: (info) => info.getValue(),
  }),
];

const UsersTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [inputSearchValue, setInputSearchValue] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: users,
    columns,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  useEffect(() => {
    console.log("sorting", sorting);
    const fetchData = async () => {
      const url = `https://dummyjson.com/users/search?q=${searchValue}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.users) {
        setUsers(data.users);
      }
    };

    fetchData();
  }, [searchValue, sorting]);

  // useEffect(() => {
  //   const fetchSearchData = async () => {
  //     if (searchValue.trim()) {
  //       const url = `https://dummyjson.com/users/search?q=${searchValue}`;
  //       const res = await fetch(url);
  //       const data = await res.json();
  //       if (data && data.users) {
  //         setUsers(data.users);
  //       }
  //     } else {
  //       const url = `https://dummyjson.com/users`;
  //       const res = await fetch(url);
  //       const data = await res.json();
  //       if (data && data.users) {
  //         setUsers(data.users);
  //       }
  //     }
  //   };

  //   fetchSearchData();
  // }, [searchValue]);

  const submitSearchForm = (e: FormEvent) => {
    e.preventDefault();
    setSearchValue(inputSearchValue);
  };

  return (
    <div>
      <div className="search-bar">
        <form onSubmit={submitSearchForm}>
          <input
            type="text"
            placeholder="Search..."
            value={inputSearchValue}
            onChange={(e) => setInputSearchValue(e.target.value)}
          />
        </form>
      </div>
      <table className="users-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="users-table-cell">
                  <div
                    {...{
                      className: header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : "",
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{ asc: "⬆️", desc: "⬇️" }[
                      header.column.getIsSorted() as string
                    ] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="users-table-cell">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
