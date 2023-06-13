const Path: React.FC = () => {
  return <path />;
};

export default Path;

type TechPathProps = { d: string; dash?: boolean };

export const TechPath: React.FC<TechPathProps> = ({ d, dash }) => {
  return (
    <path
      d={d}
      fill="none"
      stroke="#1f6286"
      strokeWidth={dash ? "1" : "2"}
      strokeMiterlimit="10"
      strokeDasharray={dash ? "3 2" : ""}
      pointerEvents="stroke"
    />
  );
};
