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
import ReusableModal from "../components/ui/ReusableModal";
import { Admin } from "../interfaces/Admin";
import { days, months } from "../utils/constant";
function MemberManagement() {
  const [newNote, setNewNote] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setHistoryModal] = useState<boolean>(false);
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

  // Update the useEffect to fetch members when searchTerm changes too
  useEffect(() => {
    fetchMembers(pageIndex, pageSize);
  }, [pageIndex, pageSize, searchTerm, selectedFilterAdmin]);
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

    let query = supabase.from("members").select("*", { count: "exact" });

    // Apply search term filter if exists
    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`);
    }

    // Apply admin filter if selected
    if (selectedFilterAdmin) {
      query = query.eq("admin_id", selectedFilterAdmin);
    }

    const { data, error, count } = await query.range(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize - 1
    ); // Gets all fields and total count

    if (error) {
      console.error("Error fetching members:", error);
      toast.error("Error fetching members", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
    } else {
      // console.log(data);
      setMembers(data || []);
      setTotalRows(count || 0);
    }

    setLoading(false);
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setNewNote("");
    }
    // console.log(newOpen)
    setOpen(newOpen);
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

            <DropdownMenuContent className="  bg-white text-[#44444B]  dark:bg-[#242529] dark:text-white p-0 min-h-[5rem] space-y-2">
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onSelect={() => openAddNoteModal(member)}
              >
                <MdAddCircleOutline />
                Add note
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onSelect={() => openNotesHistory(member)}
              >
                <GrNotes />
                View notes
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onSelect={() => (window.location.href = `tel:${member.phone}`)}
              >
                <IoCallOutline />
                Call member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const openAddMemberModal = () => {
    setIsAddMemberModalOpen(true);
    // Reset the form fields
    setNewMember({
      ...defaultMemberState,
    });
    setMonth("");
    setDay("");
  };

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
                <option value="">All Admins</option>
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
        {open && (
          <ReusableModal
            open={open}
            onOpenChange={handleOpenChange}
            title="Add Note"
            description="You can add information about the member's wellbeing here. Click
                save when you're done."
          >
            <form onSubmit={addNewNote}>
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-semibold" htmlFor="note">
                  Admin
                </label>

                <div className="flex flex-col">
                  <select
                    id="note-admin"
                    className="border p-2 rounded-sm  cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white    appearance-none"
                    required
                    value={selectedNoteAdmin}
                    onChange={(e) => setSelectedNoteAdmin(e.target.value)}
                  >
                    <option value="">Select Admin</option>
                    {admins.length > 0 &&
                      admins.map((admin: Admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="note">
                  Note
                </label>
                <textarea
                  id="note"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  required
                  placeholder="Kindly type your note here"
                  className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 h-40 px-4 py-2 border rounded-md border-[#ECF0F3]  placeholder-[#BBBBCB] w-full"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={!newNote || !selectedNoteAdmin}
                className="flex disabled:opacity-40 justify-center  px-4 py-2 bg-[#0053A6] text-white items-center gap-2 cursor-pointer rounded-md w-full"
              >
                {addingNote ? (
                  <FiLoader className="w-6 h-6 text-white animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </form>
          </ReusableModal>
        )}

        {/* member notes */}
        {isHistoryModalOpen && (
          <ReusableModal
            open={isHistoryModalOpen}
            onOpenChange={setHistoryModal}
            title={`Notes History - ${selectedMember?.full_name}`}
            description="You can view this member's wellbeing status here."
          >
            <div className="space-y-4 w-auto">
              {fetchingNotes ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="w-6 h-6 animate-spin" />
                </div>
              ) : notesHistory.length === 0 ? (
                <div className="text-center py-8">
                  No notes found for this member.
                </div>
              ) : (
                <div className="w-auto divide-y divide-[#ECF0F3]">
                  {notesHistory.map((note, index) => (
                    <div
                      key={index}
                      className="flex items-center  gap-4 mb-6 py-3"
                    >
                      <GrNotes className="shrink-0 self-start" size={18} />
                      <div className="flex-1 min-w-0">
                        <p className="break-words whitespace-pre-wrap mb-1 leading-tight">
                          {note.note}
                        </p>
                        <p className="font-semibold text-sm">
                          Note added by{" "}
                          {note.admin_name ? note.admin_name : "admin"} {""}
                          <br />
                          {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ReusableModal>
        )}

        {isAddMemberModalOpen && (
          <ReusableModal
            open={isAddMemberModalOpen}
            onOpenChange={setIsAddMemberModalOpen}
            title="Add New Member"
            description="Fill in the member's details below. Required fields are marked with *"
          >
            <form onSubmit={handleAddMember} className="">
              {/* Full Name */}
              <div className="flex flex-col gap-4 mb-4">
                <label className="font-semibold" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  value={newMember.fullName}
                  onChange={(e) =>
                    setNewMember({ ...newMember, fullName: e.target.value })
                  }
                  required
                  placeholder="Enter full name"
                  className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="gender">
                  Gender *
                </label>
                <select
                  id="gender"
                  value={newMember.gender}
                  onChange={(e) =>
                    setNewMember({ ...newMember, gender: e.target.value })
                  }
                  required
                  className="border p-2 rounded-sm ring-0 cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {/* Birthday */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="birthday">
                  Birthday *{" "}
                  <span className="text-sm font-normal text-gray-500">
                    (Will be saved as MM/DD format)
                  </span>
                </label>
                <div className="flex gap-2">
                  <select
                    id="birthday-month"
                    value={month}
                    required
                    onChange={(e) => setMonth(e.target.value)}
                    className="border p-2 rounded-sm flex-1 cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none focus:border-[#0053A6] focus:ring-[#0053A6] outline-0"
                  >
                    <option value="">Select month</option>
                    {months.map((m, i) => (
                      <option key={i} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    required
                    id="birthday-day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="border p-2 rounded-sm flex-1 cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none focus:border-[#0053A6] focus:ring-[#0053A6] outline-0"
                  >
                    <option value="">Select day</option>
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  required
                  placeholder="Enter email address"
                  className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
                />
              </div>

              {/* Home Address */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="address">
                  Home Address *
                </label>
                <textarea
                  required
                  id="address"
                  value={newMember.address}
                  onChange={(e) =>
                    setNewMember({ ...newMember, address: e.target.value })
                  }
                  placeholder="Enter home address"
                  className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 h-20 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
                />
              </div>

              {/* Relationship Status */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="relationshipStatus">
                  Relationship Status *
                </label>
                <select
                  required
                  id="relationshipStatus"
                  value={newMember.relationshipStatus}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      relationshipStatus: e.target.value,
                    })
                  }
                  className="border p-2 rounded-sm ring-0 cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none"
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="dating">Dating</option>
                  <option value="married">Married</option>
                </select>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="phone">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                  required
                  placeholder="Enter phone number"
                  className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
                />
              </div>

              {/* Occupation */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="occupation">
                  Occupation *
                </label>
                <input
                  required
                  id="occupation"
                  value={newMember.occupation}
                  onChange={(e) =>
                    setNewMember({ ...newMember, occupation: e.target.value })
                  }
                  placeholder="Enter occupation"
                  className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
                />
              </div>

              {/* //are you in a service unit */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold">
                  Are you in a service unit? *
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      id="inServiceYes"
                      type="radio"
                      name="inService"
                      value="yes"
                      checked={newMember.serviceUnitStatus === "yes"}
                      onChange={() =>
                        setNewMember({ ...newMember, serviceUnitStatus: "yes" })
                      }
                      className="focus:ring-[#0053A6] h-4 w-4 text-[#0053A6] border-gray-300"
                    />
                    <label
                      htmlFor="inServiceYes"
                      className="text-[#44444B] dark:text-white"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="inServiceNo"
                      type="radio"
                      name="inService"
                      value="no"
                      checked={newMember.serviceUnitStatus === "no"}
                      onChange={() =>
                        setNewMember({ ...newMember, serviceUnitStatus: "no" })
                      }
                      className="focus:ring-[#0053A6] h-4 w-4 text-[#0053A6] border-gray-300"
                    />
                    <label
                      htmlFor="inServiceNo"
                      className="text-[#44444B] dark:text-white"
                    >
                      No
                    </label>
                  </div>
                </div>
              </div>

              {/* //unit name */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold" htmlFor="serviceUnit">
                  If yes, what is the name of your service unit
                </label>
                <input
                  id="serviceUnit"
                  value={newMember.serviceUnitName}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      serviceUnitName: e.target.value,
                    })
                  }
                  placeholder="Ambience"
                  className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
                />
              </div>

              {/* set reminder */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold">
                  Would you like someone to follow up with you and send you a
                  reminder about MAP? *
                </label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <input
                      required
                      id="reminderYes"
                      type="radio"
                      name="reminder"
                      value="yes"
                      checked={newMember.reminder === "yes"}
                      onChange={() =>
                        setNewMember({ ...newMember, reminder: "yes" })
                      }
                      className="focus:ring-[#0053A6] h-4 w-4 text-[#0053A6] border-gray-300"
                    />
                    <label
                      htmlFor="reminderYes"
                      className="text-[#44444B] dark:text-white"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="reminderNo"
                      type="radio"
                      name="reminder"
                      value="no"
                      checked={newMember.reminder === "no"}
                      onChange={() =>
                        setNewMember({ ...newMember, reminder: "no" })
                      }
                      className="focus:ring-[#0053A6] h-4 w-4 text-[#0053A6] border-gray-300"
                    />
                    <label
                      htmlFor="reminderNo"
                      className="text-[#44444B] dark:text-white"
                    >
                      No
                    </label>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="flex flex-col gap-2 mb-6">
                <label className="font-semibold" htmlFor="suggestions">
                  Do you have any suggestions for MAP? (Your opinions are valid
                  and matter to us.)
                </label>
                <textarea
                  id="suggestions"
                  value={newMember.suggestions}
                  onChange={(e) =>
                    setNewMember({ ...newMember, suggestions: e.target.value })
                  }
                  placeholder="Any additional information or suggestions"
                  className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 h-20 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
                />
              </div>

              <button
                type="submit"
                className="flex disabled:opacity-40 justify-center px-4 py-2 bg-[#0053A6] text-white items-center gap-2 cursor-pointer rounded-md w-full"
              >
                {isAddingMember ? (
                  <FiLoader className="w-6 h-6 text-white animate-spin" />
                ) : (
                  "Add Member"
                )}
              </button>
            </form>
          </ReusableModal>
        )}
      </section>
    </Layout>
  );
}

//let writee documentation with the mind that we aare trying  to explain to a group of people
// tansatck doc is not even bad
// close button, i need it to be pointer
export default MemberManagement;
