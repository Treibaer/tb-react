// toastUtils.tsx
import { toast } from "react-hot-toast";
import { FaClipboardList, FaUserCircle } from "react-icons/fa";
import { doneIcon, inProgressIcon, openIcon, errorIcon } from "./ticketUtils";

// Toast-Vorlagen
const toastTemplates = {
  error: (_: string, value: string) => {
    return () => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "10px" }}>{errorIcon}</div>
        <div>
          {value}
        </div>
      </div>
    );
  },
  success: (_: string, value: string) => {
    return () => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "10px" }}>{doneIcon}</div>
        <div>
          {value}
        </div>
      </div>
    );
  },
  state: (
    ticketId: string,
    state: "open" | "inProgress" | "done",
    avatarUrl?: string
  ) => {
    let icon = <div style={{ marginRight: "10px" }}>{doneIcon}</div>;
    let message = "";

    switch (state) {
      case "open":
        icon = <div style={{ marginRight: "10px" }}>{openIcon}</div>;
        message = `Ticket ${ticketId} is now open`;
        break;
      case "inProgress":
        icon = (
          <div
            style={{
              marginRight: "10px",
            }}
          >
            {inProgressIcon}
          </div>
        );
        message = `Ticket ${ticketId} is now in progress`;
        break;
      case "done":
        message = `Ticket ${ticketId} completed`;
        icon = <div style={{ marginRight: "10px" }}>{doneIcon}</div>;
        break;
      default:
        break;
    }

    return () => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {icon}
        <div>{message}</div>
      </div>
    );
  },

  assignee: (
    ticketId: string,
    assignee: string | undefined,
    avatarUrl?: string
  ) => {
    let message = "";
    let icon = avatarUrl ? (
      <img
        src={avatarUrl}
        alt={`${assignee}`}
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          marginRight: "10px",
        }}
      />
    ) : (
      <FaUserCircle
        style={{ color: "#FF9800", marginRight: "10px", fontSize: "20px" }}
      />
    );

    if (assignee) {
      message = `Ticket ${ticketId} assigned to ${assignee}`;
    } else {
      message = `Ticket ${ticketId} unassigned`;
    }

    return () => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {icon}
        <div>{message}</div>
      </div>
    );
  },

  type: (ticketId: string, type: string, avatarUrl?: string) => {
    const icon = (
      <FaClipboardList
        style={{ color: "#FF9800", marginRight: "10px", fontSize: "24px" }}
      />
    );
    return () => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {icon}
        <div>
          Ticket <strong>{ticketId}</strong> type changed to {type}
        </div>
      </div>
    );
  },

  board: (ticketId: string, boardName?: string, avatarUrl?: string) => {
    const icon = (
      <FaClipboardList
        style={{ color: "#FF9800", marginRight: "10px", fontSize: "24px" }}
      />
    );
    const message = boardName
      ? `Ticket ${ticketId} moved to ${boardName}`
      : `Ticket ${ticketId} moved to Backlog`;

    return () => (
      <div style={{ display: "flex", alignItems: "center" }}>
        {icon}
        <div>{message}</div>
      </div>
    );
  },
};

type ToastType = keyof typeof toastTemplates;

const showToast = (
  type: ToastType,
  ticketId: string,
  value?: any,
  avatarUrl?: string
) => {
  const template = toastTemplates[type];
  if (template) {
    toast(template(ticketId, value, avatarUrl), {
      style: {
        background: "#262736", // Etwas helleres Dunkelblau
        color: "#FFFFFF", // Weiß für den Text
        border: "1px solid rgb(53,56,74)", // Ein hellerer Rand, um mehr Kontrast zu schaffen
        borderRadius: "8px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
        padding: "10px",
        fontSize: "16px",
      },
      duration: 3000,
      position: "top-right",
    });
  }
};

export { showToast };

// examples
/*
  showToast("state", "HK-12", "done"); // -> "Ticket HK-12 completed" with Checkmark Icon
  showToast("state", "HK-12", "inProgress"); // -> "Ticket HK-12 is now in progress" with Inprogress Icon
  showToast("state", "HK-12", "open"); // -> "Ticket HK-12 is now open" with Open Icon
  showToast("assignee", "HK-12", "Hannes", ".../hannes.png"); // -> "Ticket HK-12 assigned to Hannes" with User Icon
  showToast("assignee", "HK-12", "Juri", ".../juri.png"); // -> "Ticket HK-12 assigned to Juri"
  showToast("assignee", "HK-12", undefined); // -> "Ticket HK-12 unassigned"
  showToast("type", "HK-12", "bug"); // -> "Ticket HK-12 type changed to Bug" with generic icon
  showToast("board", "HK-12", "KW13"); // -> "Ticket HK-12 moved to KW13" with generic icon
  showToast("board", "HK-12", undefined); // -> "Ticket HK-12 moved to Backlog" with generic icon
*/
