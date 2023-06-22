import React from "react";
import Layout from "../1.CommonLayout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const ListOfProperties = () => {
  const { data } = useParams();
  const dataFromParams = JSON.parse(decodeURIComponent(data));
  const goTo = useNavigate();
  const [selectedPropertyResults, setSelectedPropertyResults] = useState([]);
  const viewCurrentProperty = async (type, city, range) => {
    let minValueOfproperty = parseInt(range.split("-")[0]);
    let maxValueOfproperty = parseInt(range.split("-")[1]);
    let dataToPost = {
      property_type: type,
      city_name: city,
      minvalue: minValueOfproperty,
      maxvalue: maxValueOfproperty,
    };
    try {
      await axios
        .post(`/sam/v1/property/view-properties`, dataToPost)
        .then((res) => {
          setSelectedPropertyResults(res.data);
          console.log(res.data);
        });
    } catch (error) {}
  };
  useEffect(() => {
    if (dataFromParams) {
      viewCurrentProperty(
        dataFromParams.type,
        dataFromParams.city,
        dataFromParams.range
      );
    }
  }, []);

  return (
    <Layout>
      <section className="list-of-properties section-padding min-100vh">
        {dataFromParams ? (
          <div>
            <div>{dataFromParams.type}</div>
            <div>{dataFromParams.city}</div>
            <div>{dataFromParams.range}</div>
          </div>
        ) : (
          <></>
        )}
      </section>
    </Layout>
  );
};

export default ListOfProperties;
