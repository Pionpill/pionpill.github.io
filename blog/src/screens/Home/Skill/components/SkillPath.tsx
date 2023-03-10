type Props = { d: string; dash?: boolean };

const SkillPath: React.FC<Props> = ({ d, dash }) => {
  return (
    <path
      d={d}
      fill="none"
      stroke="#1f6286"
      stroke-width={dash ? "1" : "2"}
      stroke-miterlimit="10"
      stroke-dasharray={dash ? "3 2" : ""}
      pointer-events="stroke"
    />
  );
};

export default SkillPath;
