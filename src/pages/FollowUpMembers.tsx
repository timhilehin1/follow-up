import Layout from "../components/layout/Layout";
import { IoPersonAddOutline } from "react-icons/io5";
import ReusableTable from "../components/ui/ReusableTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  defaultMemberState,
  Member,
  MemberNote,
  NewMember,
} from "../interfaces/Member";
import { useEffect, useState } from "react";
import { FiLoader } from "react-icons/fi";
import { supabase } from "../lib/supabase";
import { CiCircleCheck, CiMenuKebab } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { IoCallOutline } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import { toast, Toaster } from "sonner";
import { MdAddCircleOutline, MdErrorOutline } from "react-icons/md";
import { Admin } from "../interfaces/Admin";

import { GrPowerCycle } from "react-icons/gr";
import { GoTrash } from "react-icons/go";
import AddNoteModal from "../components/modals/AddNoteModal";
import NoteHistoryModal from "../components/modals/NoteHistoryModal";
import AddMemberModal from "../components/modals/AddMemberModal";
import ReassignMemberModal from "../components/modals/ReassignMemberModal";
import DeleteMemberModal from "../components/modals/DeleteMemberModal";
function FollowUpMembers() {
  const [newNote, setNewNote] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setHistoryModal] = useState<boolean>(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedReassignAdmin, setSelectedReassignAdmin] = useState("");
  const [reassignPassword, setReassignPassword] = useState("");
  const [isReassigning, setIsReassigning] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedFilterAdmin, setSelectedFilterAdmin] = useState("");
  const [selectedNoteAdmin, setSelectedNoteAdmin] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  // Add states for notes
  const [notesHistory, setNotesHistory] = useState<MemberNote[]>([]);
  const [addingNote, setAddingNote] = useState(false);
  const [fetchingNotes, setFetchingNotes] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] =
    useState<boolean>(false);
  const [isAddingMember, setIsAddingMember] = useState<boolean>(false);
  const [newMember, setNewMember] = useState<NewMember>({
    ...defaultMemberState,
  });

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    fetchMembers(pageIndex, pageSize);
  }, [pageIndex, pageSize, searchTerm, selectedFilterAdmin]);
  useEffect(() => {
    setPageIndex(0); // Reset to first page when filters change
  }, [searchTerm, selectedFilterAdmin]);
  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    return () => clearTimeout(debounce);
  }, [inputValue]);
  useEffect(() => {
    fetchAdmins();
  }, []);

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault();

    // Validate required fields
    if (
      !newMember.fullName ||
      !newMember.gender ||
      !newMember.phone ||
      !newMember.email ||
      !newMember.address ||
      !newMember.relationshipStatus ||
      !newMember.occupation ||
      !newMember.serviceUnitStatus ||
      !newMember.reminder ||
      !month ||
      !day
    ) {
      toast.error("Please fill all required fields", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
      return;
    }

    setIsAddingMember(true);

    try {
      const { data: emailExists } = await supabase
        .from("members")
        .select("id")
        .eq("email", newMember.email)
        .limit(1);

      if (emailExists && emailExists.length > 0) {
        toast.error("A member with this email already exists", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        setIsAddingMember(false);
        return;
      }

      // Check if phone already exists in the database
      const { data: phoneExists } = await supabase
        .from("members")
        .select("id")
        .eq("phone", newMember.phone)
        .limit(1);

      if (phoneExists && phoneExists.length > 0) {
        toast.error("A member with this phone number already exists", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        setIsAddingMember(false);
        return;
      }

      // Format birthday as MM/DD
      const formattedBirthday = `${month.padStart(2, "0")}/${day.padStart(
        2,
        "0"
      )}`;

      // Map newMember object to match database schema field names
      const { error } = await supabase.from("members").insert({
        full_name: newMember.fullName,
        gender: newMember.gender,
        email: newMember.email,
        phone: newMember.phone,
        address: newMember.address,
        relationship_status: newMember.relationshipStatus,
        occupation: newMember.occupation,
        service_unit_status: newMember.serviceUnitStatus,
        service_unit_name: newMember.serviceUnitName || null, // Only if service_unit_status is "yes"
        birthday: formattedBirthday,
        reminder: newMember.reminder,
        suggestions: newMember.suggestions || null,
      });

      if (error) {
        console.error("Error adding member:", error);
        toast.error(error.message || "Error adding member", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        return;
      }

      // Refresh members list
      fetchMembers(pageIndex, pageSize);

      // Reset form and close modal
      setNewMember({
        ...defaultMemberState,
      });
      setMonth("");
      setDay("");
      setIsAddMemberModalOpen(false);

      toast.success("Member added successfully!", {
        icon: <CiCircleCheck size={20} color="#01BF5B" />,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
    } finally {
      setIsAddingMember(false);
    }
  }

  async function fetchAdmins() {
    try {
      const { data } = await supabase.from("admins").select("*");
      // console.log(data);
      setAdmins(data || []);
    } catch (error) {
      console.warn("Error fetching admins", error);
      toast.error("Error fetching admins", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
    } finally {
    }
  }
  async function fetchMembers(pageIndex: number, pageSize: number) {
    setLoading(true);

    try {
      // First build the query with the filters
      let query = supabase.from("members").select("*", { count: "exact" });

      // Apply search term filter if exists
      if (searchTerm) {
        query = query.ilike("full_name", `%${searchTerm}%`);
      }

      // Apply admin filter if selected
      if (selectedFilterAdmin) {
        query = query.eq("admin_id", selectedFilterAdmin);
      }

      // Get data with count
      const { data, error, count } = await query.range(
        pageIndex * pageSize,
        (pageIndex + 1) * pageSize - 1
      );

      if (error) {
        // Check if this is an offset error
        if (error.code === "PGRST103" && pageIndex > 0) {
          // If we're trying to access a page that doesn't exist, go back to page 0
          setPageIndex(0);
          return; // This will trigger another fetch with page 0
        }
        throw error;
      }

      // Set members and total rows
      setMembers(data || []);
      setTotalRows(count || 0);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Error fetching members", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
      setMembers([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  }

  async function handleReassignMember(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedMember || !selectedReassignAdmin || !reassignPassword) return;

    // Check password against environment variable
    const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;
    if (reassignPassword !== ADMIN_KEY) {
      toast.error("Incorrect password. Reassignment cancelled.", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
      return;
    }

    setIsReassigning(true);

    try {
      const { error } = await supabase
        .from("members")
        .update({ admin_id: selectedReassignAdmin })
        .eq("id", selectedMember.id);

      if (error) {
        toast.error(error.message || "Error reassigning member", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        return;
      }

      // Refresh members list
      fetchMembers(pageIndex, pageSize);

      // Reset form and close modal
      setSelectedReassignAdmin("");
      setReassignPassword("");
      setIsReassignModalOpen(false);

      const newAdmin = admins.find(
        (admin) => admin.id === selectedReassignAdmin
      );

      toast.success(`Member successfully reassigned to ${newAdmin?.name}!`, {
        icon: <CiCircleCheck size={20} color="#01BF5B" />,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
    } finally {
      setIsReassigning(false);
    }
  }

  async function handleDeleteMember(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedMember || !deletePassword) return;

    // Check password against environment variable
    const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

    if (deletePassword !== ADMIN_KEY) {
      toast.error("Incorrect password. Deletion cancelled.", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
      return;
    }

    setIsDeleting(true);

    try {
      // First delete all associated notes
      const { error: notesError } = await supabase
        .from("member_notes")
        .delete()
        .eq("member_id", selectedMember.id);

      if (notesError) {
        toast.error("Error deleting member notes", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        return;
      }

      // Then delete the member
      const { error: memberError } = await supabase
        .from("members")
        .delete()
        .eq("id", selectedMember.id);

      if (memberError) {
        toast.error(memberError.message || "Error deleting member", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        return;
      }

      // Refresh members list
      fetchMembers(pageIndex, pageSize);

      // Reset form and close modal
      setDeletePassword("");
      setIsDeleteModalOpen(false);

      toast.success(
        `Member ${selectedMember.full_name} deleted successfully!`,
        {
          icon: <CiCircleCheck size={20} color="#01BF5B" />,
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  const openAddNoteModal = (member: Member) => {
    setSelectedMember(member);
    setOpen(true);
  };

  async function openNotesHistory(member: Member) {
    setHistoryModal(true);
    setSelectedMember(member);
    // Load notes history
    setFetchingNotes(true);
    try {
      const { data, error } = await supabase
        .from("member_notes")
        .select("*")
        .eq("member_id", member.id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching notes:", error);
      } else {
        setNotesHistory(data || []);
      }
    } catch (error) {
      console.error("An expected error occured", error);
    } finally {
      setFetchingNotes(false);
    }
  }

  async function addNewNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim() || !selectedMember) return;
    setAddingNote(true);
    try {
      // Add to history
      // get admin name
      const selectedAdmin = admins.find(
        (admin) => admin.id === selectedNoteAdmin
      );
      const { error: noteError } = await supabase.from("member_notes").insert({
        member_id: selectedMember.id,
        note: newNote,
        admin_name: selectedAdmin?.name,
        admin_id: selectedNoteAdmin,
      });

      if (noteError) {
        toast.error(noteError.message, {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        console.error("Error adding note:", noteError);
        return;
      }

      // Update latest note
      const { error: memberError } = await supabase
        .from("members")
        .update({ notes: newNote })
        .eq("id", selectedMember.id);

      if (memberError) {
        toast.error(memberError.message, {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        console.error("Error updating member:", memberError);
        return;
      }

      // Refresh data
      fetchMembers(pageIndex, pageSize);

      // Refresh notes
      const { data } = await supabase
        .from("member_notes")
        .select("*")
        .eq("member_id", selectedMember.id)
        .order("created_at", { ascending: false });

      setNotesHistory(data || []);
      setNewNote("");
      setOpen(false);
      toast.success("Note added successfully!", {
        icon: <CiCircleCheck size={20} color="#01BF5B" />,
      });
    } catch (error) {
      toast.error("Unexpected error", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
      console.error("Unexpected error:", error);
    } finally {
      setAddingNote(false);
    }
  }

  const openAddMemberModal = () => {
    setIsAddMemberModalOpen(true);
    // Reset the form fields
    setNewMember({
      ...defaultMemberState,
    });
    setMonth("");
    setDay("");
  };

  const openReassignModal = (member: Member) => {
    setSelectedMember(member);
    setIsReassignModalOpen(true);
  };

  const openDeleteModal = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

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
      accessorKey: "note",
      header: () => <span className="hidden md:table-cell">Last note</span>,
      cell: ({ row }) => {
        const note = row.original.notes;
        return (
          <div
            title={`${note}`}
            className="truncate max-w-[12.5rem] whitespace-nowrap hidden md:table-cell"
          >
            {note}
          </div>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <CiMenuKebab className="cursor-pointer" size={24} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className=" text-base bg-white text-[#44444B]  dark:bg-[#242529] dark:text-white p-2 min-h-[5rem] space-y-2">
              <DropdownMenuItem
                className=" text-base cursor-pointer  flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onSelect={() => openAddNoteModal(member)}
              >
                <MdAddCircleOutline size={16} />
                Add note
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-base cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onSelect={() => openNotesHistory(member)}
              >
                <GrNotes />
                View notes
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-base cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onSelect={() => (window.location.href = `tel:${member.phone}`)}
              >
                <IoCallOutline />
                Call member
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => openReassignModal(member)}
                className="text-base cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <GrPowerCycle />
                Reassign member
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => openDeleteModal(member)}
                className="text-base cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <GoTrash />
                Delete member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <Layout>
      <Toaster position="top-right" />
      <section className="p-2">
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center justify-between mb-16">
          <div className="">
            <p className="text-2xl mb-2 font-semibold">Members</p>
            <p>Follow up on your MAP members here👋</p>
          </div>
          <button
            onClick={openAddMemberModal}
            className="flex px-4 py-2 bg-[#0053A6] text-white items-center gap-4 cursor-pointer rounded-md"
          >
            <IoPersonAddOutline size={20} />
            Add new member
            {/* Bulk add members */}
          </button>
        </div>
        <section className="table_section">
          <header className="flex flex-col gap-4 md:flex-row items-start md:items-center justify-between mb-6">
            <input
              placeholder="search  members..."
              className="border p-2 rounded-sm w-full lg:w-1/2 ring-0 outline-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
            />

            <div className="flex flex-col">
              <label
                htmlFor="admin-filter"
                className="text-sm mb-1 font-semibold"
              >
                Filter members by admin
              </label>

              <select
                id="admin-filter"
                className="border p-2 rounded-sm  cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none"
                value={selectedFilterAdmin}
                onChange={(e) => setSelectedFilterAdmin(e.target.value)}
              >
                <option value="">All Members</option>
                {admins.map((admin: Admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <FiLoader className="w-6 h-6  animate-spin" />
            </div>
          ) : (
            <div className="table_section">
              <ReusableTable
                data={members}
                columns={columns}
                searchTerm={searchTerm}
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalRows={totalRows}
                onPaginationChange={handlePaginationChange}
              />
            </div>
          )}
        </section>
        <AddNoteModal
          open={open}
          onOpenChange={setOpen}
          member={selectedMember}
          admins={admins}
          newNote={newNote}
          setNewNote={setNewNote}
          selectedNoteAdmin={selectedNoteAdmin}
          setSelectedNoteAdmin={setSelectedNoteAdmin}
          onSubmit={addNewNote}
          addingNote={addingNote}
        />
        {/* // For Notes History Modal: */}
        <NoteHistoryModal
          open={isHistoryModalOpen}
          onOpenChange={setHistoryModal}
          member={selectedMember}
          notesHistory={notesHistory}
          fetchingNotes={fetchingNotes}
        />
        {/* // For Add Member Modal: */}
        <AddMemberModal
          open={isAddMemberModalOpen}
          onOpenChange={setIsAddMemberModalOpen}
          newMember={newMember}
          setNewMember={setNewMember}
          day={day}
          setDay={setDay}
          month={month}
          setMonth={setMonth}
          onSubmit={handleAddMember}
          isAddingMember={isAddingMember}
        />

        <ReassignMemberModal
          open={isReassignModalOpen}
          onOpenChange={setIsReassignModalOpen}
          member={selectedMember}
          admins={admins}
          selectedAdmin={selectedReassignAdmin}
          setSelectedAdmin={setSelectedReassignAdmin}
          password={reassignPassword}
          setPassword={setReassignPassword}
          onSubmit={handleReassignMember}
          isReassigning={isReassigning}
        />

        <DeleteMemberModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          member={selectedMember}
          password={deletePassword}
          setPassword={setDeletePassword}
          onSubmit={handleDeleteMember}
          isDeleting={isDeleting}
        />
      </section>
    </Layout>
  );
}

export default FollowUpMembers;
