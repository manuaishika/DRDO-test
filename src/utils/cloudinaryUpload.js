import axios from "axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload";
const CLOUDINARY_PRESET = "YOUR_PRESET";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);

  const response = await axios.post(CLOUDINARY_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.secure_url;
};

export default uploadToCloudinary;
