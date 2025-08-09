import { FiLoader } from "react-icons/fi";
import { Admin } from "../../interfaces/Admin";
import { Member } from "../../interfaces/Member";
import ReusableModal from "../ui/ReusableModal";

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  admins: Admin[];
  newNote: string;
  setNewNote: (note: string) => void;
  selectedNoteAdmin: string;
  setSelectedNoteAdmin: (adminId: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  addingNote: boolean;
}
export default function AddNoteModal({
  open,
  onOpenChange,
  admins,
  newNote,
  setNewNote,
  selectedNoteAdmin,
  setSelectedNoteAdmin,
  onSubmit,
  addingNote,
}: AddNoteModalProps) {
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Note"
      description="You can add information about the member's wellbeing here. Click save when you're done."
    >
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-2 mb-6">
          <label className="font-semibold" htmlFor="note-admin">
            Admin
          </label>
          <select
            id="note-admin"
            className="border p-2 rounded-sm cursor-pointer bg-white dark:bg-[#242529] text-[#44444B] dark:text-white appearance-none"
            required
            value={selectedNoteAdmin}
            onChange={(e) => setSelectedNoteAdmin(e.target.value)}
          >
            <option value="">Select Admin</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
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
            className="focus:border-[#0053A6] focus:ring-[#0053A6] outline-0 h-40 px-4 py-2 border rounded-md border-[#ECF0F3] placeholder-[#BBBBCB] w-full"
          />
        </div>

        <button
          type="submit"
          disabled={!newNote || !selectedNoteAdmin || addingNote}
          className="flex disabled:opacity-40 justify-center px-4 py-2 bg-[#0053A6] text-white items-center gap-2 cursor-pointer rounded-md w-full"
        >
          {addingNote ? (
            <FiLoader className="w-6 h-6 text-white animate-spin" />
          ) : (
            "Save"
          )}
        </button>
      </form>
    </ReusableModal>
  );
}
