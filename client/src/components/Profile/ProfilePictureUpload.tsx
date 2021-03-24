//React
import React, { useState } from "react";

//Redux
import { useDispatch } from "react-redux";

//Antd
import ImgCrop from "antd-img-crop";
import { Upload, Button } from "antd";

//Libraries
import axios from "axios";

//Actions
import { getUserOnLoadThunk } from "../../redux/slices/authSlice";
import { RcFile } from "antd/lib/upload";

//Component
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ProfilePictureUpload = ({ imageUrn }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>();
  const [fileList, setFileList] = useState([]);
  const [fileToUpload, setFileToUpload] = useState<File>(new File([], "name"));
  const dispatch = useDispatch();
  //uploading status
  const [uploading, setUploading] = useState(false);
  //swap between upload & normal mode
  const [uploadMode, setUploadMode] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    console.log(fileToUpload);
    formData.append("picture", fileToUpload);

    setUploading(true);
    try {
      await axios.put(
        "http://localhost:5000/api/users/updateUserProfilePicture",
        formData
      );
      dispatch(getUserOnLoadThunk());
      setFileList([]);
      setUploading(false);
      setUploadMode(false);
    } catch (error) {
      setUploading(false);
      setUploadMode(false);
    }
    return;
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  const handlePreview = async (file) => {
    console.log(file.originFileObj);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    console.log(previewImage);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleRemove = () => {
    setPreviewVisible(false);
    setUploadMode(false);
    setFileList([]);
  };
  return (
    <>
      <ImgCrop modalTitle="Crop your profile picture">
        <Upload
          listType="text"
          fileList={fileList}
          maxCount={1}
          onRemove={handleRemove}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={(file: RcFile) => {
            setUploadMode(true);
            const reader = new FileReader();
            reader.onload = (_) => {
              // convert image file to base64 string
              if (reader.result) {
                setPreviewImage(reader.result?.toString());
                setFileToUpload(file);
              }
            };
            // Prevent upload
            setPreviewVisible(true);
            reader.readAsDataURL(file);
            return false;
          }}
        >
          {!previewVisible && (
            <div className="relative flex items-center justify-center w-48 h-48 overflow-hidden border-blue-200 rounded-full border-1 hover:shadow-sm ">
              <div className="absolute top-0 z-30 w-64 h-full bg-blue-200 opacity-0 hover:opacity-20"></div>
              <img
                alt="profile_picture"
                src={`http://localhost:5000/uploads/profilepictures/${imageUrn}`}
                className="content-center object-cover w-56 h-56 bg-cover "
              />
            </div>
          )}
        </Upload>
      </ImgCrop>
      {previewVisible && (
        <div className="relative flex items-center justify-center w-48 h-48 overflow-hidden border-blue-200 rounded-full border-1 hover:shadow-sm ">
          <img
            alt="profile_picture"
            src={previewImage}
            className="content-center object-cover w-56 h-56 bg-cover "
          />
          <p>{previewTitle}</p>
        </div>
      )}
      {uploadMode && (
        <div className="flex justify-center">
          <Button
            type="primary"
            onClick={handleUpload}
            loading={uploading}
            className="mt-6 ml-4"
          >
            {uploading ? "uploading" : "save"}
          </Button>
          <Button
            type="primary"
            onClick={handleRemove}
            loading={uploading}
            className="mt-6 ml-4"
            danger
          >
            cancel
          </Button>
        </div>
      )}
    </>
  );
};
export default ProfilePictureUpload;
