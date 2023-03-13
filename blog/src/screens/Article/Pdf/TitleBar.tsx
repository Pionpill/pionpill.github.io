import { faBook, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import A from "../../../components/A";
import Flex from "../../../components/Flex";
import P from "../../../components/P";
import { ArticleInfo } from "../../../shared/articles";
import { transformGithubLinkToDownload } from "../../../utils/urlUtils";

type Props = {
  article: ArticleInfo;
};

const TitleBar: React.FC<Props> = ({ article }) => {
  const downLoadUrl = transformGithubLinkToDownload(article.reposUrl);

  return (
    <Flex fullWidth bg style={{ minHeight: "60px", maxHeight: "60px" }}>
      <Flex limitWidth justify="space-between" tabletResponsive gap="xxs">
        <Flex justify="flex-start">
          <P isTitle>
            <FontAwesomeIcon icon={faBook} /> &nbsp;
            {article.title} &nbsp; |
          </P>
          <A href={article.reposUrl} color="link" weight="xl">
            在 Github 上查看
          </A>
        </Flex>
        <Flex justify="flex-end">
          <P shallow="md" size="sm">
            预览功能有限，显示效果可能出错，如有需要请下载。
          </P>
          <A href={downLoadUrl} weight="xl">
            <FontAwesomeIcon icon={faDownload} />
          </A>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TitleBar;
