const ProgressCircle: React.FC<{
  done: number;
  total: number;
}> = ({ done, total }) => {
  const radius = 6;
  const stroke = 1;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - circumference * (done / total);

  return (
    <div className="flex items-center gap-1">
      <div className="relative w-6 h-6">
        <svg className="w-full h-full scale-[1]" viewBox="0 0 16 16">
          <circle
            cx="8"
            cy="8"
            r={normalizedRadius}
            fill="transparent"
            strokeWidth={stroke}
            className="text-gray-200 stroke-current"
            style={{
              strokeLinecap: "round",
            }}
          />
          <circle
            cx="8"
            cy="8"
            r={normalizedRadius}
            fill="transparent"
            strokeWidth={stroke}
            className="text-olive stroke-current transition-[stroke-dashoffset] duration-300"
            style={{
              strokeLinecap: "round",
              strokeDasharray: `${circumference} ${circumference}`,
              strokeDashoffset: strokeDashoffset,
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </svg>
      </div>
      <div className="text-xs">
        {done}/{total}
      </div>
    </div>
  );
};

export default ProgressCircle;
