import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const img = assets.profile_pic;

  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  // Garbage values to reject
  const garbageNames = ["abcdef", "abc", "test", "xyz", "name", "user"];
  const garbagePhones = ["0000000000", "1111111111", "1234567890"];
  const garbageEmails = ["qwerty@gmail.com", "aaa@gmail.com", "qwerty@gamil.com", "example@example.com"];

  const validateInputs = () => {
    const phoneRegex = /^\d{10}$/;
    const textOnlyRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Name validation
    const name = userData.full_name?.trim().toLowerCase();
    if (!name || name.length < 3 || garbageNames.includes(name)) {
      toast.error("Please enter a valid full name.");
      return false;
    }

    // Phone validation
    if (!phoneRegex.test(userData.phone) || garbagePhones.includes(userData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }

    // Email validation
    const email = userData.user_email?.trim().toLowerCase();
    if (!email || !emailRegex.test(email) || garbageEmails.includes(email) || email.includes("gamil.com")) {
      toast.error("Invalid or suspicious email address.");
      return false;
    }

    // City and State
    if (!textOnlyRegex.test(userData.city)) {
      toast.error("City name cannot contain numbers or special characters.");
      return false;
    }
    if (!textOnlyRegex.test(userData.state)) {
      toast.error("State name cannot contain numbers or special characters.");
      return false;
    }

    // DOB validation
    if (!userData.dob) {
      toast.error("Please select a valid Date of Birth.");
      return false;
    }
    const dob = new Date(userData.dob);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

    if (dob > eighteenYearsAgo) {
      toast.error("You must be at least 18 years old.");
      return false;
    }
    if (dob.getFullYear() === today.getFullYear()) {
      toast.error("Invalid DOB: cannot be from this year.");
      return false;
    }
    if (dob.toDateString() === today.toDateString() || dob.toDateString() === yesterday.toDateString()) {
      toast.error("Invalid DOB: cannot be today or yesterday.");
      return false;
    }

    return true;
  };

  const updateUserProfileData = async () => {
    if (!validateInputs()) return;

    try {
      const requestData = {
        userId: userData.user_id,
        full_name: userData.full_name,
        phone: userData.phone,
        city: userData.city,
        state: userData.state,
        gender: userData.gender,
        dob: userData.dob,
      };

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        requestData,
        { headers: { token, "Content-Type": "application/json" } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img className="w-36 rounded" src={img} alt="Profile" />

      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, full_name: e.target.value }))
          }
          value={userData.full_name || ""}
          placeholder="Please fill in the details"
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData.full_name || "Please fill in the details"}
        </p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.user_email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="tel"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength="10"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setUserData((prev) => ({ ...prev, phone: value }));
              }}
              value={userData.phone || ""}
              placeholder="10-digit mobile"
            />
          ) : (
            <p className="text-blue-500">
              {userData.phone || "Please fill in the details"}
            </p>
          )}

          <p className="font-medium">City:</p>
          {isEdit ? (
            <input
              className="bg-gray-50"
              type="text"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s]*$/.test(value)) {
                  setUserData((prev) => ({ ...prev, city: value }));
                }
              }}
              value={userData.city || ""}
              placeholder="City name"
            />
          ) : (
            <p className="text-gray-500">
              {userData.city || "Please fill in the details"}
            </p>
          )}

          <p className="font-medium">State:</p>
          {isEdit ? (
            <input
              className="bg-gray-50"
              type="text"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[A-Za-z\s]*$/.test(value)) {
                  setUserData((prev) => ({ ...prev, state: value }));
                }
              }}
              value={userData.state || ""}
              placeholder="State name"
            />
          ) : (
            <p className="text-gray-500">
              {userData.state || "Please fill in the details"}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender || ""}
            >
              <option value="">Please select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">
              {userData.gender || "Please fill in the details"}
            </p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-100"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob || ""}
            />
          ) : (
            <p className="text-gray-400">
              {userData.dob && !isNaN(new Date(userData.dob))
                ? new Date(userData.dob).toLocaleDateString("en-GB")
                : "Please fill in the details"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Save information
          </button>
        ) : (
          <button
            onClick={() => {
              setUserData((prev) => ({ ...prev, dob: prev.dob || "" }));
              setIsEdit(true);
            }}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
