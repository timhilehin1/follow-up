import { Member, MemberNote } from "../../interfaces/Member";
import { FiLoader } from "react-icons/fi";
import { GrNotes } from "react-icons/gr";
import ReusableModal from "../ui/ReusableModal";
interface NotesHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  notesHistory: MemberNote[];
  fetchingNotes: boolean;
}
export default function NoteHistoryModal({
  open,
  onOpenChange,
  member,
  notesHistory,
  fetchingNotes,
}: NotesHistoryModalProps) {
  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Notes History - ${member?.full_name}`}
      description="You can view this member's wellbeing status here."
    >
      <div className="space-y-4 w-auto">
        {fetchingNotes ? (
          <div className="flex justify-center py-4">
            <FiLoader className="w-6 h-6 animate-spin" />
          </div>
        ) : notesHistory.length === 0 ? (
          <div className="text-center py-8">
            No notes found for this member.
          </div>
        ) : (
          <div className="w-auto divide-y divide-[#ECF0F3]">
            {notesHistory.map((note, index) => (
              <div key={index} className="flex items-center gap-4 mb-6 py-3">
                <GrNotes className="shrink-0 self-start" size={18} />
                <div className="flex-1 min-w-0">
                  <p className="break-words whitespace-pre-wrap mb-1 leading-tight">
                    {note.note}
                  </p>
                  <p className="font-semibold text-sm capitalize">
                    Note added by {note.admin_name || "admin"}
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
  );
}
