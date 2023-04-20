import React, { useEffect, useState, useRef } from "react";
import Layout from "../../components/1.CommonLayout/Layout";
import AdminSideBar from "../AdminSideBar";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";

let authHeader = "";
let temp = 0;
let chunkSize = 0;

const SinglePropertyDocumentsUpload = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    authHeader = { Authorization: data.logintoken };
  }
  const [currentPropertyNumber, setCurrentPropertyNumber] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [savedImageFiles, setSavedImageFiles] = useState([]);
  const [currentImageFileIndex, setCurrentImageFileIndex] = useState(null);
  const [lastUploadedImageFileIndex, setLastUploadedImageFileIndex] =
    useState(null);
  const [currentChunkIndexOfImage, setCurrentChunkIndexOfImage] =
    useState(null);
  const [uniqueId, setUniqueId] = useState(uuid());
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageFileChange = (e) => {
    e.preventDefault();
    setSavedImageFiles([...imageFiles, ...e.target.files]);
  };

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };

  const readAndUploadCurrentImageChunk = () => {
    const reader = new FileReader();
    const file = imageFiles[currentImageFileIndex];
    if (!file) {
      return;
    }
    chunkSize = Math.round((file.size * 39) / 100);
    const from = currentChunkIndexOfImage * chunkSize;
    const to = from + chunkSize;
    const blob = file.slice(from, to);
    reader.onload = (e) => uploadImageChunk(e);
    reader.readAsDataURL(blob);
  };

  const uploadImageChunk = async (readerEvent) => {
    const file = imageFiles[currentImageFileIndex];
    const size = file.size;
    let tempChunkSize = chunkSize;
    temp += tempChunkSize;
    if (temp > size) {
      tempChunkSize = size - (temp - chunkSize);
    }
    const data = readerEvent.target.result.split(",")[1];
    const detailsToPost = {
      upload_id: uniqueId,
      property_number: currentPropertyNumber,
      chunk_number: currentChunkIndexOfImage + 1,
      total_chunks: Math.ceil(size / chunkSize),
      chunk_size: tempChunkSize,
      total_file_size: size,
      file_name: file.name,
      category_id: 13,
      description: "add description",
      data: data,
    };
    console.log(detailsToPost);
    const chunks = Math.ceil(file.size / chunkSize) - 1;
    const isLastChunk = currentChunkIndexOfImage === chunks;
    console.warn("IS LAST CHUNK: ", isLastChunk);
    try {
      await axios
        .post(`/sam/v1/property/auth/property-documents`, detailsToPost, {
          headers: authHeader,
        })
        .then((res) => {
          if (isLastChunk) {
            if (res.data.msg !== 0) {
              setImageLoading(false);
              toast.error("Error while uploading files");
              reloadPage();
            } else {
              if (currentImageFileIndex === savedImageFiles.length - 1) {
                setImageLoading(false);
                toast.success("Files uploaded successfully");
                reloadPage();
              }
            }
          }
        });
    } catch (error) {
      if (isLastChunk) {
        setImageLoading(false);
        toast.error("Internal server error");
        reloadPage();
      }
    }
    if (isLastChunk) {
      setUniqueId(uuid());
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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, [currentChunkIndexOfImage]);

  const postImages = (e) => {
    e.preventDefault();
    setImageLoading(true);
    setImageFiles(savedImageFiles);
  };

  let defaultCategoryText = "Select one from above categories";

  const [documentsInfo, setDocumentsInfo] = useState({
    category_id: 0,
    category_text: defaultCategoryText,
    categoryTextColor: "muted",
    description: "",
  });

  const onResetBtnClick = () => {
    let allCategoryChecks = document.querySelectorAll(".category-checks");
    setDocumentsInfo({
      category_id: 0,
      category_text: defaultCategoryText,
      categoryTextColor: "muted",
      description: "",
    });
    setSavedImageFiles([]);
    fileRef.current.value = "";
    decsRef.current.value = "";

    if (allCategoryChecks) {
      allCategoryChecks.forEach((check) => {
        if (check.checked) {
          check.checked = false;
        }
      });
    }
  };

  const [allCategoriesFromDB, setAllCategoriesFromDB] = useState([]);
  const fileRef = useRef();
  const decsRef = useRef();

  const { category_id, category_text, categoryTextColor, description } =
    documentsInfo;

  const onCategoryRadioCheck = (e) => {
    let categoryText = e.target.nextElementSibling.textContent;
    setDocumentsInfo({
      ...documentsInfo,
      category_id: e.target.value,
      category_text: categoryText,
      categoryTextColor: "black common-btn-font",
    });
  };

  const onOtherRadioCheck = (e) => {
    setDocumentsInfo({
      ...documentsInfo,
      category_id: 0,
      category_text: defaultCategoryText,
      categoryTextColor: "muted",
    });
  };

  const saveDocumentsDetails = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setDocumentsInfo({
        ...documentsInfo,
        [name]: value,
      });
    }
  };

  const getCategoriesFromDB = async () => {
    try {
      await axios
        .get(`/sam/v1/property/auth/document-categories`, {
          headers: authHeader,
        })
        .then((res) => {
          setAllCategoriesFromDB(res.data);
        });
    } catch (error) {}
  };

  useEffect(() => {
    let propertyNumber = localStorage.getItem("property_number");
    if (propertyNumber) {
      setCurrentPropertyNumber(propertyNumber);
      getCategoriesFromDB();
    }
  }, []);

  return (
    <Layout>
      <div className="container-fluid section-padding">
        <div className="row min-100vh position-relative">
          <AdminSideBar />
          <div className="col-xl-10 col-lg-9 col-md-8 wrapper mt-md-0">
            <section className="upload-documents-wrapper">
              <div className="container-fluid">
                <div className="row">
                  <h3 className="fw-bold p-0">Upload Documents</h3>
                  <h6 className="fw-bold text-muted p-0">
                    Property Number
                    <span className="badge bg-primary ms-2">
                      {currentPropertyNumber}
                    </span>
                  </h6>
                  <hr />
                </div>
                {/* <div className="row border p-4">
                  <h5 className="mb-3">Upload Property Documents</h5>
                  <div className="col-xl-4 col-md-7 col-12">
                    <input
                      onChange={handleImageFileChange}
                      type="file"
                      multiple
                      className="form-control"
                    />
                  </div>
                  <div className="col-xl-3 col-md-5 col-12 mt-4 mt-md-0">
                    <button
                      disabled={
                        savedImageFiles.length === 0 || imageLoading
                          ? true
                          : false
                      }
                      className="btn btn-primary w-100"
                      onClick={postImages}
                    >
                      {imageLoading ? (
                        <>
                          <div
                            className="spinner-border spinner-border-sm text-light me-2"
                            role="status"
                          ></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        "Upload"
                      )}
                    </button>
                  </div>
                </div> */}

                <div className="row mb-4">
                  <div className="col-12">
                    <div className="container-fluid">
                      <label
                        className="form-label common-btn-font "
                        style={{ color: "var(--primary-color-hover)" }}
                      >
                        Select document category
                      </label>
                      <div className="row">
                        {allCategoriesFromDB.map((category, Index) => {
                          return (
                            <div className="col-4" key={Index}>
                              <div className="form-check form-check-inline">
                                <input
                                  onChange={onCategoryRadioCheck}
                                  className="form-check-input category-checks"
                                  type="radio"
                                  name="category_id"
                                  id="category_id"
                                  value={category.category_id}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="category_id"
                                >
                                  {category.category_Name}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                        <div className="col-4">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input category-checks"
                              type="radio"
                              name="category_id"
                              id="category_id"
                              value={0}
                              onChange={onOtherRadioCheck}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="category_id"
                            >
                              Other
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-xl-3">
                    <div className="form-group">
                      <label
                        htmlFor="category_text"
                        className="form-label common-btn-font "
                        style={{ color: "var(--primary-color-hover)" }}
                      >
                        Category
                      </label>
                      <div className={`text-${categoryTextColor}`}>
                        {category_text}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3">
                    <div className="form-group">
                      <label
                        htmlFor="file-upload"
                        className="form-label common-btn-font "
                        style={{ color: "var(--primary-color-hover)" }}
                      >
                        File
                      </label>
                      <input
                        onChange={handleImageFileChange}
                        ref={fileRef}
                        type="file"
                        name="file-upload"
                        id="file-upload"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-xl-3">
                    <div className="form-group">
                      <label
                        htmlFor="description"
                        className="form-label common-btn-font "
                        style={{ color: "var(--primary-color-hover)" }}
                      >
                        Description
                      </label>
                      <input
                        ref={decsRef}
                        type="text"
                        name="description"
                        id="description"
                        className="form-control"
                        placeholder="Enter category description"
                        onChange={saveDocumentsDetails}
                      ></input>
                    </div>
                  </div>
                  <div className="col-xl-3">
                    <div className="form-group">
                      <label
                        htmlFor="action-buttons"
                        className="form-label common-btn-font "
                        style={{ color: "var(--primary-color-hover)" }}
                      >
                        Action
                      </label>
                      <div id="action-buttons">
                        <button
                          disabled={
                            savedImageFiles.length === 0 ||
                            imageLoading ||
                            !description ||
                            category_text === defaultCategoryText
                              ? true
                              : false
                          }
                          className="btn btn-primary"
                          style={{ width: "46%" }}
                        >
                          Upload
                        </button>
                        <button
                          className="btn btn-secondary ms-2"
                          style={{ width: "46%" }}
                          onClick={onResetBtnClick}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="row border p-4 mt-4">
                  <h5 className="mb-3">Upload Property Documents</h5>
                  <div className="col-xl-4 col-md-7 col-12">
                    <input
                      onChange={handlePdfFileChange}
                      type="file"
                      className="form-control"
                      multiple
                    />
                  </div>
                  <div className="col-xl-3 col-md-5 col-12 mt-4 mt-md-0">
                    <button
                      disabled={
                        savedPdfFiles.length === 0 || pdfLoading ? true : false
                      }
                      className="btn btn-primary w-100"
                      onClick={postPdf}
                    >
                      {pdfLoading ? (
                        <>
                          <div
                            className="spinner-border spinner-border-sm text-light me-2"
                            role="status"
                          ></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        "Upload"
                      )}
                    </button>
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
