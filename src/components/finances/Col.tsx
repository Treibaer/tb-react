import { Link } from "react-router-dom";

const Col: React.FC<{
  children: React.ReactNode;
  absolute?: boolean;
  link?: string;
}> = ({ children, absolute = true, link }) => {
  let content = children;
  if (typeof children === "number") {
    if (absolute) {
      children = Math.abs(children);
    }
    content = `${(children / 100).toFixed(2)}€`;
  }
  if (link) {
    return (
      <td className="py-2 px-2 border border-slate-800">
        {link ? <Link to={link}>{content}</Link> : content}
      </td>
    );
  }
  return <td className="py-2 px-2 border border-slate-800">{content}</td>;
};

export default Col;
