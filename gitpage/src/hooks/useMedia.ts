import { useMediaQuery } from "@mui/material";

export const useSmallMaxMedia = () => {
  return useMediaQuery("(max-width:600px)");
};

export const useMiddleMaxMedia = () => {
  return useMediaQuery("(max-width:900px)");
};

export const useLargeMaxMedia = () => {
  return useMediaQuery("(max-width:1200px)");
};

export const useXLargeMaxMedia = () => {
  return useMediaQuery("(max-width:1536px)");
};

export const useSmallMinMedia = () => {
  return useMediaQuery("(min-width:600px)");
};

export const useMiddleMinMedia = () => {
  return useMediaQuery("(min-width:900px)");
};

export const useLargeMinMedia = () => {
  return useMediaQuery("(min-width:1200px)");
};

export const useXLargeMinMedia = () => {
  return useMediaQuery("(min-width:1536px)");
};

export const useSmallMedia = () => {
  return useSmallMaxMedia();
};

export const useMiddleMedia = () => {
  const middleMaxMedia = useMiddleMaxMedia();
  const smallMinMedia = useSmallMinMedia();
  return middleMaxMedia && smallMinMedia;
};

export const useLargeMedia = () => {
  const largeMaxMedia = useLargeMaxMedia();
  const middleMinMedia = useMiddleMinMedia();
  return largeMaxMedia && middleMinMedia;
};

export const useXLargeMedia = () => {
  return useXLargeMinMedia();
};
