import { IVacation } from "../models/vacation.model";
import { createImgSrcLocalPath } from "./images";
import CONFIG from "../config";

//  we want to Transform Vacation Object before returning it to the client
//
// We are storing only the image name, without the path,
// so before serving the vacation data to the client, we are creating
// local path to the image on our server and then replace the imgUrl value with the new one.
// With the followers, we are just transform it to array of numbers
export const transformVacation = (vacation: IVacation): IVacation => {
  return {
    ...vacation,
    ...(vacation.followers && {
      followers: JSON.parse(vacation.followers as any).map((f: string) => +f),
    }),
    ...(vacation.imgUrl && {
      imgUrl: `${CONFIG.BASE_URL}/images/${vacation.imgUrl}`,
    }),
  };
};
