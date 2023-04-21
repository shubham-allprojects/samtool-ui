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
  let defaultCategoryText = "Select one from above categories";
  const [documentsInfo, setDocumentsInfo] = useState({
    category_id: 0,
    category_text: defaultCategoryText,
    categoryTextColor: "muted",
    description: "",
  });

  const [allCategoriesFromDB, setAllCategoriesFromDB] = useState([]);
  const [imageAllowedExtensions, setImageAllowedExtensions] = useState([]);
  const [otherCategoryBlankCharErr, setOtherCategoryBlankCharErr] =
    useState(false);
  const fileRef = useRef();
  const decsRef = useRef();
  const otherCategoryInputRef = useRef();
  const otherCategoryWrapperRef = useRef();

  const { category_id, category_text, categoryTextColor, description } =
    documentsInfo;
  let otherCategoryId = null;
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

  const onSaveOtherCategoryClick = (e) => {
    e.preventDefault();
    let otherCategoryValue = otherCategoryInputRef.current.value.trim();
    if (otherCategoryValue !== "") {
      setDocumentsInfo({
        ...documentsInfo,
        category_id: otherCategoryId,
        category_text: otherCategoryValue,
        categoryTextColor: "black common-btn-font",
      });
      setOtherCategoryBlankCharErr(false);
      e.target.reset();
      otherCategoryWrapperRef.current.classList.add("d-none");
    } else {
      setOtherCategoryBlankCharErr(true);
    }
  };

  const onCategoryRadioCheck = (e) => {
    let categoryText = e.target.nextElementSibling.textContent;
    if (categoryText === "Property images") {
      setImageAllowedExtensions(["jpg", "png", "jpeg"]);
    } else {
      setImageAllowedExtensions([]);
    }
    setDocumentsInfo({
      ...documentsInfo,
      category_id: parseInt(e.target.value),
      category_text: categoryText,
      categoryTextColor: "black common-btn-font",
    });
    otherCategoryInputRef.current.value = "";
    otherCategoryWrapperRef.current.classList.add("d-none");
  };

  const onOtherRadioCheck = (e) => {
    if (e.target.checked === true) {
      setDocumentsInfo({
        ...documentsInfo,
        category_id: otherCategoryId,
        category_text: defaultCategoryText,
        categoryTextColor: "muted",
      });
      otherCategoryWrapperRef.current.classList.remove("d-none");
    }
  };

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
    otherCategoryInputRef.current.value = "";
    otherCategoryWrapperRef.current.classList.add("d-none");
    setOtherCategoryBlankCharErr(false);
    if (allCategoryChecks) {
      allCategoryChecks.forEach((check) => {
        if (check.checked) {
          check.checked = false;
        }
      });
    }
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

  const handleImageFileChange = (e) => {
    e.preventDefault();
    let currentFileExtension = e.target.files[0].type.split("/")[1];
    if (imageAllowedExtensions.length > 0) {
      if (imageAllowedExtensions.includes(currentFileExtension)) {
        setSavedImageFiles([...imageFiles, ...e.target.files]);
      } else {
        toast.error("File not allowed with this extension");
        e.target.value = "";
      }
    } else {
      setSavedImageFiles([...imageFiles, ...e.target.files]);
    }
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
      category_id: category_id,
      description: description,
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
                toast.success("File uploaded successfully");
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

                <div className="row mb-4">
                  <div className="col-12 px-0">
                    <div className="container-fluid">
                      <label
                        className="form-label common-btn-font "
                        style={{ color: "var(--primary-color-hover)" }}
                      >
                        Select document category
                      </label>
                      <div className="row">
                        {allCategoriesFromDB.map((category, Index) => {
                          if (category.category_Name === "Other") {
                            otherCategoryId = parseInt(category.category_id);
                          }
                          return (
                            <div
                              className={`col-4 ${
                                category.category_Name === "Other"
                                  ? "d-none"
                                  : ""
                              }`}
                              key={Index}
                            >
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
                          <div
                            className="container-fluid mt-2 d-none"
                            ref={otherCategoryWrapperRef}
                          >
                            <form
                              onSubmit={onSaveOtherCategoryClick}
                              className="row"
                            >
                              <div className="col-7">
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className={`form-control ${
                                      otherCategoryBlankCharErr
                                        ? "border-danger"
                                        : ""
                                    }`}
                                    placeholder="Enter category"
                                    ref={otherCategoryInputRef}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="col-5">
                                <button
                                  type="submit"
                                  className="btn btn-primary"
                                >
                                  Save
                                </button>
                              </div>
                              <small
                                className={`text-danger ${
                                  otherCategoryBlankCharErr ? "" : "d-none"
                                }`}
                              >
                                Blank characters are not allowed
                              </small>
                            </form>
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
                        disabled={
                          category_text !== defaultCategoryText ? false : true
                        }
                      />
                      <small
                        className={`text-muted ${
                          imageAllowedExtensions.length > 0 ? "" : "d-none"
                        }`}
                      >
                        Extensions allowed {imageAllowedExtensions.join(", ")}.
                      </small>
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
                          className="btn btn-primary w-75"
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
                        <button
                          className="btn btn-secondary ms-xl-2"
                          onClick={onResetBtnClick}
                          disabled={imageLoading ? true : false}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SinglePropertyDocumentsUpload;
