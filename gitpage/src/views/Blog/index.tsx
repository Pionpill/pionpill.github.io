import FlexBox from "../../components/FlexBox";
import Aside from "./Aside";

const Blog: React.FC = () => {
  return (
    <FlexBox bgcolor="background.paper" color="text.primary">
      <Aside />
    </FlexBox>
  );
};

export default Blog;
