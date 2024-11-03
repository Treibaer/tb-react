import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { Project } from "../../../models/project";
import { Ticket } from "../../../models/ticket";
import { TicketComment } from "../../../models/ticket-comment";
import TicketService from "../../../services/TicketService";
import { FormatType, formatUnixTimestamp } from "../../../utils/dataUtils";
import Button from "../../Button";
import Confirmation from "../../common/Confirmation";
import TicketAssigneeField from "./TicketAssigneeField";

export const TicketCommentArea: React.FC<{
  project: Project;
  ticket: Ticket;
  comments: TicketComment[];
}> = ({ project, ticket, comments: initialComments }) => {
  const [comments, setComments] = useState<TicketComment[]>(initialComments);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [removeCommentId, setRemoveCommentId] = useState<number | null>(null);

  async function addComment() {
    if (!contentRef.current?.value) return;
    await TicketService.shared.addComment(
      project.slug,
      ticket.slug,
      contentRef.current?.value ?? ""
    );
    contentRef.current!.value = "";
    await loadComments();
  }

  async function loadComments() {
    const loadedComments = await TicketService.shared.getComments(
      project.slug,
      ticket.slug
    );
    setComments(loadedComments);
  }

  async function removeComment() {
    if (!removeCommentId) return;
    await TicketService.shared.removeComment(
      project.slug,
      ticket.slug,
      removeCommentId
    );
    setRemoveCommentId(null);
    await loadComments();
  }

  return (
    <div className="border-t border-t-border mt-1">
      <AnimatePresence>
        {removeCommentId && (
          <Confirmation
            onCancel={() => setRemoveCommentId(null)}
            onConfirm={removeComment}
          />
        )}
      </AnimatePresence>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="
          bg-row p-2 mt-2 border border-border rounded flex gap-2
          justify-between
        "
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <TicketAssigneeField user={comment.creator} />
              <div className="text-gray-400">
                {formatUnixTimestamp(comment.createdAt, FormatType.DAY_TIME)}
              </div>
            </div>
            <div>{comment.content}</div>
          </div>
          <FaXmark
            className="h-5 w-5 text-gray-400 cursor-pointer"
            onClick={() => setRemoveCommentId(comment.id)}
          />
        </div>
      ))}
      <div className="text-2xl">Comments</div>
      <textarea
        className="w-full resize-none p-2 mt-2 bg-row text-gray-100 border border-border rounded focus:outline-none focus:border-border"
        placeholder="Leave a comment..."
        rows={3}
        ref={contentRef}
      ></textarea>

      <div className="my-2">
        <Button title="Add Comment" onClick={addComment} />
      </div>
    </div>
  );
};

export default TicketCommentArea;
