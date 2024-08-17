export const ContextMenu: React.FC<{
  data: { id: number; title: string }[]
  config: any;
}> = ({data, config}) => {
  return (
    <div
      style={{
        display: config.show ? "block" : "none",
        position: "absolute",
        top: config.top,
        left: config.left,
        backgroundColor: "white",
        color: "black",
        opacity: 0.7,
        zIndex: 1000,
        border: "1px solid black",
      }}
    >
      {data.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
};
