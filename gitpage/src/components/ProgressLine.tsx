import { Skeleton, Typography } from "@mui/material";
import FlexBox from "./FlexBox";
import { blue, green, indigo, pink, red } from "@mui/material/colors";
import useThemeChoice from "../hooks/useThemeChoice";

type ProgressLineProps = {
  data: Array<{ name: string; percent: number }>;
};

const ProgressLine: React.FC<ProgressLineProps> = ({ data }) => {
  const colorValue = useThemeChoice(800, 300) as keyof typeof blue;
  const colorArray = [blue, green, red, indigo, pink].map(
    (color) => color[colorValue]
  );

  return !data ? (
    <Skeleton />
  ) : (
    <FlexBox
      sx={{
        flexDirection: "column",
        width: "100%",
        gap: "12px",
      }}
    >
      <FlexBox sx={{ width: "100%", height: "8px", borderRadius: "10px" }}>
        {data.map(({ name, percent }, index) => (
          <div
            key={name}
            style={{
              width: `calc(${percent}% - ${(data.length - 1) * 2}px)`,
              backgroundColor: colorArray[index % 5],
              height: "100%",
              marginLeft: index ? "2px" : "",
            }}
          />
        ))}
      </FlexBox>
      <FlexBox
        sx={{ width: "100%", flexWrap: "wrap", gap: "16px", rowGap: "8px" }}
      >
        {data.map(({ name, percent }, index) => (
          <FlexBox
            sx={{ justifyContent: "center", alignItems: "center", gap: "8px" }}
            key={name}
          >
            <FlexBox
              sx={{
                width: "8px",
                height: "8px",
                borderRadius: "8px",
                backgroundColor: colorArray[index % 5],
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: "500" }}>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              {percent}%
            </Typography>
          </FlexBox>
        ))}
      </FlexBox>
    </FlexBox>
  );
};

export default ProgressLine;
