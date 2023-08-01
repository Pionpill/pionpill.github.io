export const getTocAnchor = (tags: Array<any>) => {
  let result = "";
  for (const tag of tags) {
    if (typeof tag === "string") {
      result = result.concat(tag.replace(/[\s`]+/g, ""));
    } else {
      result = result.concat(
        tag["props"]["children"][0].replace(/[\s`]+/g, "")
      );
    }
  }
  return result;
};
