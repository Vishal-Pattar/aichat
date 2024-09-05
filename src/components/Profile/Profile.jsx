import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useAlert } from "../../context/AlertContext";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();
  const { addAlert } = useAlert();
  const authToken = sessionStorage.getItem("authToken");
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  const [container, setContainer] = useState(1);
  const [formData, setFormData] = useState({
    username: username,
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    pincode: "",
    country: "",
    state: "",
    district: "",
    block: "",
    context: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFetchAddress = async () => {
    const { pincode } = formData;
    if (!pincode) {
      addAlert("Pincode is required.", "error", "signbox");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = response.data[0];

      if (data.Status === "Success" && data.PostOffice?.length > 0) {
        const { Country, State, District, Block } = data.PostOffice[0];
        setFormData((prevData) => ({
          ...prevData,
          country: Country,
          state: State,
          district: District,
          block: Block,
        }));
        addAlert("Data fetched successfully.", "info", "bottom_right");
      } else {
        addAlert(
          "No data found for the given pincode.",
          "error",
          "bottom_right"
        );
      }
    } catch (error) {
      addAlert(
        error.response.data.message || error.message,
        "error",
        "bottom_right"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      username,
      first_name,
      last_name,
      age,
      gender,
      pincode,
      country,
      state,
      district,
      block,
      context,
    } = formData;

    if (
      !username ||
      !first_name ||
      !last_name ||
      !age ||
      !gender ||
      !pincode ||
      !country ||
      !state ||
      !district ||
      !block ||
      !context
    ) {
      addAlert("All fields are required.", "error", "bottom_right");
      return;
    }

    try {
      const response = await axios.put(
        "/api/v1/personal",
        { formData },
        config
      );

      addAlert(response.data.message, "success", "bottom_right");
    } catch (error) {
      addAlert(
        error.response.data.error || error.message,
        "error",
        "bottom_right"
      );
    }
  };

  const handleNextContainer = () => {
    setTimeout(() => {
      setContainer(container + 1);
    }, 500);
  };
  const handlePrevContainer = () => {
    setTimeout(() => {
      setContainer(container - 1);
    }, 500);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/v1/personal/?username=${username}`,
          config
        );

        const data = response.data.data;

        if (data) {
          const {
            first_name,
            last_name,
            age,
            gender,
            pincode,
            address,
            context,
          } = data;
          setFormData({
            username,
            first_name,
            last_name,
            age,
            gender,
            pincode,
            country: address.country,
            state: address.state,
            district: address.district,
            block: address.block,
            context,
          });
        }
      } catch (error) {
        addAlert(
          error.response.data.message || error.message,
          "error",
          "bottom_right"
        );
      }
    };

    // fetchData();
  }, [username, authToken, addAlert]);

  return (
    <div className="profile__window">
      <form onSubmit={handleSubmit}>
        {container == 1 && (
          <div className="profile__container">
            <span className="profile__header">
              <div>
                <span style={{ fontSize: "1.75rem" }}>{container}</span>/3
              </div>
              <div className="profile__title">Build your Profile</div>
              <div className="profile__description">
                Tell the model about yourself
              </div>
            </span>
            <span className="profile__group">
              <div className="profile__input">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div className="profile__input">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </span>
            <span className="profile__group">
              <div className="profile__input">
                <label htmlFor="age">Age</label>
                <input
                  type="text"
                  id="age"
                  name="age"
                  placeholder="Enter your Age"
                  min="1"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
              <div className="profile__input">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </span>
            <span className="profile__button--group flex-end">
              <button
                type="button"
                className="profile__button"
                onClick={handleNextContainer}
              >
                Next
              </button>
            </span>
          </div>
        )}
        {container == 2 && (
          <div className="profile__container">
            <span className="profile__header">
              <div>
                <span style={{ fontSize: "1.75rem" }}>{container}</span>/3
              </div>
              <div className="profile__title">Build your Profile</div>
              <div className="profile__description">
                Where do you live? Tell us about your address
              </div>
            </span>
            <span className="profile__group">
              <div className="profile__input profile__input--pincode">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  placeholder="Enter your pincode"
                  maxLength="6"
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>
              <button
                type="button"
                className="profile__button profile__button--fetch"
                onClick={handleFetchAddress}
              >
                Fetch
              </button>
            </span>
            <span className="profile__group">
              <div className="profile__input">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  placeholder="Enter your country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
              <div className="profile__input">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </span>
            <span className="profile__group">
              <div className="profile__input">
                <label htmlFor="district">District</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  placeholder="Enter your district"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
              <div className="profile__input">
                <label htmlFor="block">Block</label>
                <input
                  type="text"
                  id="block"
                  name="block"
                  placeholder="Enter your block"
                  value={formData.block}
                  onChange={handleChange}
                />
              </div>
            </span>
            <span className="profile__button--group">
              <button
                type="button"
                className="profile__button"
                onClick={handlePrevContainer}
              >
                Back
              </button>
              <button
                type="button"
                className="profile__button"
                onClick={handleNextContainer}
              >
                Next
              </button>
            </span>
          </div>
        )}
        {container == 3 && (
          <div className="profile__container">
            <span className="profile__header">
              <div>
                <span style={{ fontSize: "1.75rem" }}>{container}</span>/3
              </div>
              <div className="profile__title">Build your Profile</div>
              <div className="profile__description">
                A short description about yourself, let the model know about you
              </div>
            </span>
            <div className="profile__input">
              <label htmlFor="context">
                Context{" "}
                <span style={{ fontFamily: "'Geist-Thin', sans-serif" }}>
                  [You can skip this part]
                </span>
              </label>
              <textarea
                id="context"
                name="context"
                placeholder="Enter your context"
                value={formData.context}
                onChange={handleChange}
              />
            </div>
            <span className="profile__button--group">
              <button
                type="button"
                className="profile__button"
                onClick={handlePrevContainer}
              >
                Back
              </button>
              <button type="submit" className="profile__button">
                Save
              </button>
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;