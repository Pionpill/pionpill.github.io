import { BsHammer } from "react-icons/bs";
import { FaBlog } from "react-icons/fa";
import { MdViewInAr } from "react-icons/md";
import { RiPlantFill } from "react-icons/ri";
import { VscNotebook } from "react-icons/vsc";
import Banner from "./Banner";
import ProjectCategory from "./ProjectCategory";

const Project: React.FC = () => {
  const config = [
    {
      titleI18nKey: "project.internet",
      abstractI18nKey: "project.internetAbstract",
      items: [
        { icon: <BsHammer size={24} />, project: "HammerWorkshop" },
        { icon: <MdViewInAr size={24} />, project: "Collage-BachelorThesis" },
      ],
    },
    {
      titleI18nKey: "project.minecraft",
      abstractI18nKey: "project.minecraftAbstract",
      items: [
        {
          icon: <RiPlantFill size={24} />,
          project: "ecology-netease",
        },
      ],
    },
    {
      titleI18nKey: "project.notebook",
      abstractI18nKey: "project.notebookAbstract",
      items: [
        {
          icon: <FaBlog size={24} />,
          project: "pionpill.github.io",
        },
        {
          icon: <VscNotebook size={24} />,
          project: "Notebook-Code",
        },
      ],
    },
  ];

  return (
    <>
      <Banner />
      {config.map(({ titleI18nKey, abstractI18nKey, items }) => (
        <ProjectCategory
          key={titleI18nKey}
          titleI18nKey={titleI18nKey}
          abstractI18nKey={abstractI18nKey}
          projectItems={items}
        />
      ))}
    </>
  );
};

export default Project;
