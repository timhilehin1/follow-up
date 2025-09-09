import { toast, Toaster } from "sonner";
import Layout from "../components/layout/Layout";
import { IoPersonAddOutline } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import { useEffect, useState } from "react";
import ReusableTable from "../components/ui/ReusableTable";
import { ColumnDef } from "@tanstack/react-table";
import { supabase } from "../lib/supabase";
import { Admin } from "../interfaces/Admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { CiMenuKebab } from "react-icons/ci";
import { GoTrash } from "react-icons/go";
import { FaUserPen } from "react-icons/fa6";
import AddAdminModal from "../components/modals/AddAdminModal";
import EditAdminModal from "../components/modals/EditAdminModal";
import DeleteAdminModal from "../components/modals/DeleteAdminModal";

function AdminManagement() {
  const [inputValue, setInputValue] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, _] = useState(0);
  const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [isDeleteAdminModalOpen, setIsDeleteAdminModalOpen] = useState(false);
  // Selected admin for operations
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const [newAdmin, setNewAdmin] = useState<any>({ name: "", email: "" });
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [deletePassword, setDeletePassword] = useState("");

  // Loading states
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [isDeletingAdmin, setIsDeletingAdmin] = useState(false);

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);
  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    return () => clearTimeout(debounce);
  }, [inputValue]);
  const openAddAdminModal = () => {
    setIsAddAdminModalOpen(true);
    setNewAdmin({ name: "", email: "" });
  };
  const openEditAdminModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setEditAdmin(admin);
    setIsEditAdminModalOpen(true);
  };
  const openDeleteAdminModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteAdminModalOpen(true);
  };

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();

    if (!newAdmin.name || !newAdmin.email) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsAddingAdmin(true);

    try {
      // Check if email already exists
      const { data: emailExists } = await supabase
        .from("admins")
        .select("id")
        .eq("email", newAdmin.email)
        .limit(1);

      if (emailExists && emailExists.length > 0) {
        toast.error("An admin with this email already exists");
        setIsAddingAdmin(false);
        return;
      }

      const { error } = await supabase.from("admins").insert({
        name: newAdmin.name,
        email: newAdmin.email,
      });

      if (error) {
        toast.error(error.message || "Error adding admin");
        return;
      }

      fetchAdmins();
      setNewAdmin({ name: "", email: "" });
      setIsAddAdminModalOpen(false);
      toast.success("Admin added successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error");
    } finally {
      setIsAddingAdmin(false);
    }
  }

  async function handleEditAdmin(e: React.FormEvent) {
    e.preventDefault();

    if (!editAdmin || !editAdmin.name || !editAdmin.email) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsEditingAdmin(true);
    try {
      const { error } = await supabase
        .from("admins")
        .update({
          name: editAdmin.name,
          email: editAdmin.email,
        })
        .eq("id", editAdmin.id)
        .select(); // 👈 add this

      if (error) {
        console;
        toast.error(error.message || "Error updating admin");
        return;
      }

      fetchAdmins();
      setIsEditAdminModalOpen(false);
      toast.success("Admin updated successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error");
    } finally {
      setIsEditingAdmin(false);
    }
  }

  async function handleDeleteAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAdmin || !deletePassword) return;

    if (selectedAdmin.membersCount && selectedAdmin.membersCount > 0) {
      toast.error(
        "You cannot delete an admin that has members assigned to them, please re-assign the members before you delete  the admin"
      );
      return;
    }

    const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;
    if (deletePassword !== ADMIN_KEY) {
      toast.error("Incorrect password. Deletion cancelled.");
      return;
    }

    setIsDeletingAdmin(true);

    try {
      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("id", selectedAdmin.id);

      if (error) {
        toast.error(error.message || "Error deleting admin");
        return;
      }

      fetchAdmins();
      setDeletePassword("");
      setIsDeleteAdminModalOpen(false);
      toast.success(`Admin ${selectedAdmin.name} deleted successfully!`);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error");
    } finally {
      setIsDeletingAdmin(false);
    }
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: () => <span className="table-cell">Name</span>,
      cell: ({ row }) => {
        const name = row.original.name;
        return <div className="block capitalize">{name}</div>;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "membersCount",
      header: () => <span className="table-cell">Number of members</span>,
      cell: ({ row }) => {
        const admin = row.original;

        return <div className="block w-full">{admin.membersCount || 0}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const admin = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <CiMenuKebab className="cursor-pointer" size={24} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="text-base bg-white text-[#44444B]  dark:bg-[#242529] dark:text-white p-2 min-h-[5rem] space-y-2">
              <DropdownMenuItem
                className=" text-base cursor-pointer  flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onSelect={() => openEditAdminModal(admin)}
              >
                <FaUserPen size={16} />
                Edit Admin
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => openDeleteAdminModal(admin)}
                className="text-base cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <GoTrash />
                Delete Admin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  async function fetchAdmins() {
    try {
      const { data } = await supabase.from("admins").select(`
        id,
        name,
        email,
        members!left(count)
      `);

      const adminsWithCount = data?.map((admin) => ({
        ...admin,
        membersCount: admin.members?.[0]?.count || 0,
      }));

      setAdmins(adminsWithCount || []);
    } catch (error) {
      console.warn("Error fetching admins", error);
      toast.error("Error fetching admins");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <Toaster position="top-right" />
      <section className="p-2">
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center justify-between mb-16">
          <div className="">
            <p className="text-2xl mb-2 font-semibold">Admins</p>
          </div>
          <button
            onClick={openAddAdminModal}
            className="flex px-4 py-2 bg-[#0053A6] text-white items-center gap-4 cursor-pointer rounded-md"
          >
            <IoPersonAddOutline size={20} />
            Add new admin
            {/* Bulk add admin */}
          </button>
        </div>
        <section className="table_section">
          <header className="flex flex-col gap-4 md:flex-row items-start md:items-center justify-between mb-6">
            <input
              placeholder="search  admin..."
              className="border p-2 rounded-sm w-full lg:w-1/2 ring-0 outline-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
            />
          </header>
          {loading ? (
            <div className="flex justify-center py-20">
              <FiLoader className="w-6 h-6  animate-spin" />
            </div>
          ) : (
            <ReusableTable
              data={admins}
              columns={columns}
              searchTerm={searchTerm}
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalRows={totalRows}
              onPaginationChange={handlePaginationChange}
            />
          )}
        </section>

        {/* Add Admin Modal */}
        <AddAdminModal
          open={isAddAdminModalOpen}
          onOpenChange={setIsAddAdminModalOpen}
          newAdmin={newAdmin}
          setNewAdmin={setNewAdmin}
          onSubmit={handleAddAdmin}
          isAddingAdmin={isAddingAdmin}
        />

        {/* Edit Admin Modal */}
        <EditAdminModal
          open={isEditAdminModalOpen}
          onOpenChange={setIsEditAdminModalOpen}
          admin={selectedAdmin}
          editAdmin={editAdmin}
          setEditAdmin={setEditAdmin}
          onSubmit={handleEditAdmin}
          isEditingAdmin={isEditingAdmin}
        />

        {/* Delete Admin Modal */}
        <DeleteAdminModal
          open={isDeleteAdminModalOpen}
          onOpenChange={setIsDeleteAdminModalOpen}
          admin={selectedAdmin}
          password={deletePassword}
          setPassword={setDeletePassword}
          onSubmit={handleDeleteAdmin}
          isDeletingAdmin={isDeletingAdmin}
        />
      </section>
    </Layout>
  );
}

export default AdminManagement;
