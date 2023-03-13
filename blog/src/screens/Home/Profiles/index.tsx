import Life from "./Life";
import Profile from "./Profile";
import Skill from "./Skill";
import State from "./State";

const Profiles: React.FC = () => {
  return (
    <>
      <Profile />
      <State />
      <Skill />
      <Life />
    </>
  );
};

export default Profiles;
