export const getRelatedBlogType = (blogLink: string): 'optional' | 'necessary' | 'common' => {
  return blogLink[0] === "-" ? "optional" : blogLink[0] === "+" ? "necessary" : "common";
}

export const getRelatedBlogName = (blogLink: string) => {
  return blogLink.split("/").pop()?.split("_").pop();
}

export const getRelatedBlogPath = (blogLink: string, type: string ) => {
  return type === "common" ? `/blog${blogLink}` : `/blog${blogLink.substring(1)}`
}