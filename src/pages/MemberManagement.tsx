import React from "react";
import Layout from "../components/layout/Layout";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { CiMenuKebab } from "react-icons/ci";
import { GrNotes } from "react-icons/gr";
import { IoCallOutline } from "react-icons/io5";
import { MdAddCircleOutline } from "react-icons/md";
import { Member } from "../interfaces/Member";

function MemberManagement() {
  // follow up pill
  const handleViewMoreModal = (handleViewMoreModal: Member) => {};
  const columns: ColumnDef<Member>[] = [
    {
      accessorKey: "full_name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "created_at",
      header: () => <span className="hidden md:table-cell">Date Joined</span>,
      cell: ({ row }) => {
        const date = new Date(row.original.created_at!);
        return (
          <div className="hidden md:block">{date.toLocaleDateString()}</div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <button onClick={() => handleViewMoreModal(member)}>view</button>
        );
      },
    },
  ];
  return (
    <Layout>
      {" "}
      <div className="flex justify-center items-center  h-[calc(100vh-56px)]">
        Coming soon...
      </div>
    </Layout>
  );
}

export default MemberManagement;
