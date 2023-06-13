import { MdViewInAr } from "react-icons/md";
import { RiPlantFill } from "react-icons/ri";
import Banner from "./Banner";
import ProjectCategory, { ProjectItemProps } from "./ProjectCategory";

const Project: React.FC = () => {
  const internetProjectItems: ProjectItemProps[] = [
    { icon: <MdViewInAr size={24} />, project: "Collage-BachelorThesis" },
  ];
  const minecraftProjectItems: ProjectItemProps[] = [
    { icon: <RiPlantFill size={24} />, project: "HammerWorkshop-CookingCraft" },
  ];

  return (
    <>
      <Banner />
      <ProjectCategory
        titleI18nKey="project.internet"
        abstractI18nKey="project.internetAbstract"
        projectItems={internetProjectItems}
      />
      <ProjectCategory
        titleI18nKey="project.minecraft"
        abstractI18nKey="project.minecraftAbstract"
        projectItems={minecraftProjectItems}
      />
    </>
  );
};

export default Project;
