import { Ticket } from "../../models/ticket";
import { Button } from "../Button";

export const TicketCommentArea: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  return (
    <div>
      <div className="text-2xl">Comments</div>
      <textarea
        className="w-full resize-none p-2 mt-2 bg-[rgb(32,33,46)] text-[rgb(228,229,244)] border border-[rgb(53,56,74)] rounded focus:outline-none focus:border-[rgb(53,56,74)]"
        placeholder="Leave a comment..."
        rows={3}
      ></textarea>

      <div className="my-2">
        <Button title="Add Comment" />
      </div>
    </div>
  );
};

export default TicketCommentArea;
