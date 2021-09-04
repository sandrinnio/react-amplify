import { Storage } from "aws-amplify";

export const useUploadImage = () => {
  const uploadToS3 = async (fileName: File | undefined) => {
    if (!fileName) return;
    const [file, extension] = fileName.name.split(".");
    const mimeType = fileName.type;
    const key = `images/lists/${file}_${Date.now()}.${extension}`;
    Storage.put(key, fileName, {
      contentType: mimeType,
      metadata: { app: "react amplify" },
    });
    return key;
  };
  return uploadToS3;
};
