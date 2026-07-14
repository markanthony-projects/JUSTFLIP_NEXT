import { useState } from "react";
import { JUSTFLIP } from "../lib/axios/api";
import { toast } from "../utils/toast";

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);

  const uploadFiles = async ({
    files,
    directory = "Project",
    fileType = "image",
  }) => {
    if (!files || files.length === 0) {
      toast.warn("⚠️ Please select at least one file.");
      return [];
    }

    const formData = new FormData();

    Array.from(files).forEach((file) => {
      if (fileType === "image" && !file.type.match("image.*")) {
        toast.warn(`Skipping ${file.name} - only images allowed`);
        return;
      }
      formData.append("file", file);
    });

    formData.append("directory", directory);

    try {
      setLoading(true);

      const { data } = await JUSTFLIP.post("/cdn/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploaded = data?.uploaded || [];

      if (uploaded.length > 0) {
        toast.success(`${uploaded.length} file(s) uploaded successfully`);
      }

      return uploaded.map((item) => ({
        url: item.url,
        type: fileType,
        title: directory,
        alt: "",
      }));
    } catch (err) {
      console.error("❌ Upload Error:", err);
      toast.error("Upload failed");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { uploadFiles, loading };
};