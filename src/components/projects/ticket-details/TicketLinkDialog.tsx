import { useEffect, useRef, useState } from "react";
import useIsMobile from "../../../hooks/useIsMobile";
import { Ticket } from "../../../models/ticket";
import TicketService from "../../../services/ticketService";
import { showToast } from "../../../utils/tbToast";
import Dialog from "../../common/Dialog";

const ticketService = TicketService.shared;

const TicketLinkDialog: React.FC<{
  projectSlug: string;
  ticketSlug: string;
  onClose: (update: boolean) => void;
}> = ({ projectSlug, ticketSlug, onClose }) => {
  const isMobile = useIsMobile();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState("");
  const selectRef = useRef<HTMLSelectElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchTickets() {
      const tickets = await ticketService.getAll(projectSlug);
      setTickets(tickets);
    }
    fetchTickets();
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isMobile]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && selectRef.current) {
      linkTicket(selectRef.current.value);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredTickets = tickets.filter((ticket) =>
    ticket.title.toLowerCase().includes(search.toLowerCase())
  );

  async function linkTicket(targetTicketSlug: string) {
    try {
      await ticketService.linkTickets(
        projectSlug,
        ticketSlug,
        targetTicketSlug
      );
      onClose(true);
      showToast("success", "Link Ticket", "Ticket linked successfully");
    } catch (error: any) {
      showToast("error", "Link Ticket", error.message);
    }
  }

  return (
    <Dialog
      title="Link Ticket"
      submitTitle="Link"
      onClose={() => onClose(false)}
      onSubmit={() => linkTicket(selectRef.current!.value)}
    >
      <input
        type="text"
        ref={inputRef}
        autoComplete="new-password"
        placeholder="Search..."
        className="tb-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select ref={selectRef} className="tb-input mb-10">
        {filteredTickets.map((ticket) => (
          <option key={ticket.id} value={ticket.slug}>
            {ticket.slug}: {ticket.title}
          </option>
        ))}
      </select>
    </Dialog>
  );
};

export default TicketLinkDialog;
