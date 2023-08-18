/**
 *
 * @param uploadedFiles
 * @param schema
 * @returns
 */

import { UploadedFile } from "express-fileupload";
import { join } from "path";

export const extractFilesFromReq = async (
  uploadedFiles: { [formField: string]: UploadedFile | UploadedFile[] },
  schema: any
): Promise<Record<string, any>> => {
  if (!uploadedFiles || !schema) return {};

  const uploadImgFields: Record<string, any> = {};
  // get schema validation keys
  const schemaKeys = Object.keys(schema.describe().keys);

  // we are using the for loop and not the map function
  // because we want
  for (const fieldName of schemaKeys) {
    const file = uploadedFiles[fieldName] as UploadedFile | undefined;

    // moving the file localy
    if (file) {
      await file.mv(join(__dirname, "../../", `/public/images`, file.name));
      uploadImgFields[fieldName] = file.name;
    }
  }

  return uploadImgFields;
};
