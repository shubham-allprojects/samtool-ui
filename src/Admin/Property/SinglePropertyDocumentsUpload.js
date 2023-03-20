import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import BreadCrumb from "../BreadCrumb";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";

const chunkSize = 1000 * 1024;
// const chunkSize = 100000;
let authHeader = "";
const SinglePropertyDocumentsUpload = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const { id } = useParams();
  const [imageFiles, setImageFiles] = useState([]);
  const [savedImageFiles, setSavedImageFiles] = useState([]);
  const [currentImageFileIndex, setCurrentImageFileIndex] = useState(null);
  const [lastUploadedImageFileIndex, setLastUploadedImageFileIndex] =
    useState(null);
  const [currentChunkIndexOfImage, setCurrentChunkIndexOfImage] =
    useState(null);

  const [uniqueId, setUinqueId] = useState(uuid());

  const handleImageFileChange = (e) => {
    e.preventDefault();
    setSavedImageFiles([...imageFiles, ...e.target.files]);
  };

  const readAndUploadCurrentImageChunk = () => {
    const reader = new FileReader();
    const file = imageFiles[currentImageFileIndex];
    if (!file) {
      return;
    }
    const from = currentChunkIndexOfImage * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadImageChunk(e);
    reader.readAsDataURL(blob);
  };

  const uploadImageChunk = async (readerEvent) => {
    let fileSize = 0;
    const file = imageFiles[currentImageFileIndex];
    const size = Math.round(file.size / 1024) + 1;
    fileSize = size >= 1024 ? (size / 1024).toFixed(1) + " MB" : size + " KB";
    const data = readerEvent.target.result.split(",")[1];
    const detailsToPost = {
      upload_id: uniqueId,
      chunk_number: `${currentChunkIndexOfImage + 1}`,
      total_chunks: `${Math.ceil(file.size / chunkSize)}`,
      total_file_size: `${fileSize}`,
      file_name: `${file.name}`,
      property_id: 2,
      data: `${data}`,
    };

    // console.log(detailsToPost);

    // const headers = { "Content-Type": "application/octet-stream" };
    const chunks = Math.ceil(file.size / chunkSize) - 1;
    const isLastChunk = currentChunkIndexOfImage === chunks;
    console.warn("IS LAST CHUNK: ", isLastChunk);
    if (isLastChunk) {
      // console.log(currentImageFileIndex === savedImageFiles.length - 1);
      setUinqueId(uuid());
      await axios
        .post(`/sam/v1/property/auth/upload-images`, detailsToPost, {
          headers: authHeader,
        })
        .then((res) => {
          if (res.data.msg !== 0) {
            toast.error("Error while uploading files");
          } else {
            if (currentImageFileIndex === savedImageFiles.length - 1) {
              toast.success("Files uploaded successfully");
            }
          }
        });
      setLastUploadedImageFileIndex(currentImageFileIndex);
      setCurrentChunkIndexOfImage(null);
    } else {
      setCurrentChunkIndexOfImage(currentChunkIndexOfImage + 1);
    }
  };

  useEffect(() => {
    if (lastUploadedImageFileIndex === null) {
      return;
    }
    const isLastFile = lastUploadedImageFileIndex === imageFiles.length - 1;
    const nextFileIndex = isLastFile ? null : currentImageFileIndex + 1;
    setCurrentImageFileIndex(nextFileIndex);
  }, [lastUploadedImageFileIndex]);

  useEffect(() => {
    if (imageFiles.length > 0) {
      if (currentImageFileIndex === null) {
        setCurrentImageFileIndex(
          lastUploadedImageFileIndex === null
            ? 0
            : lastUploadedImageFileIndex + 1
        );
      }
    }
  }, [imageFiles.length]);

  useEffect(() => {
    if (currentImageFileIndex !== null) {
      setCurrentChunkIndexOfImage(0);
    }
  }, [currentImageFileIndex]);

  useEffect(() => {
    if (currentChunkIndexOfImage !== null) {
      readAndUploadCurrentImageChunk();
    }
  }, [currentChunkIndexOfImage]);

  const postImages = (e) => {
    e.preventDefault();
    setImageFiles(savedImageFiles);
  };

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 mt-4 mt-md-0">
            <BreadCrumb />
            <section className="upload-documents-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <h4 className="fw-bold text-primary p-0">
                    Property Id: {id}
                  </h4>
                  <hr />
                </div>
                <div className="row border p-4">
                  <h5 className="mb-3">Upload Property Images</h5>
                  <div className="col-4">
                    <input
                      onChange={handleImageFileChange}
                      type="file"
                      multiple
                      className="form-control"
                    />
                  </div>
                  <div className="col-6">
                    <button className="btn btn-primary" onClick={postImages}>
                      Upload
                    </button>
                  </div>
                </div>
                {/* <div className="row border p-4 mt-4">
                  <h5 className="mb-3">Upload Property Documents</h5>
                  <div className="col-4">
                    <input type="file" className="form-control" />
                  </div>
                  <div className="col-6">
                    <button className="btn btn-primary">Upload</button>
                  </div>
                </div> */}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SinglePropertyDocumentsUpload;
