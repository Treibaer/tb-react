const Col: React.FC<{ children: React.ReactNode; absolute?: boolean }> = ({
  children,
  absolute = true,
}) => {
  let value = children;
  if (typeof children === "number") {
    if (absolute) {
      children = Math.abs(children);
    }
    value = `${(children / 100).toFixed(2)}€`;
  }
  return <td className="py-2 px-2 border border-slate-800">{value}</td>;
};

export default Col;
