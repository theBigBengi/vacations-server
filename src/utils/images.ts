import { join } from "path";

export const createImgSrcLocalPath = (imgName: string, subDir?: string) => {
  let path = `/public/images`;
  // path = subDir ? path + "/" + subDir : path;

  return join(__dirname, "../../", path, imgName);
};
