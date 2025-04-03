import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [isEdit, setIsEdit] = useState(false);

  // const [userData, setUserData] = useState({
  //   name: "Sahil Naik",
  //   image: assets.profile_pic,
  //   email: "sahilnaik@gmail.com",
  //   phone: "+91 888 888 4909",
  //   address: {
  //     line1: "Taleigao",
  //     line2: "Panjim, Goa",
  //   },
  //   gender: "Male",
  //   dob: "2004-09-08",
  // });

  const img = assets.profile_pic;

  //instead getting data from state variable, from api

  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  //to edit and update user profile and save in db

  const updateUserProfileData = async () => {
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
        { headers: { token, "Content-Type": "application/json" } } // Ensure JSON format
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        //console.log("Setting isEdit to false"); // Debugging log
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //use return userData && (....) if error

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
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
            setUserData((prev) => ({ ...prev, phone: value }));
          }}
          value={userData.phone || ""}
          placeholder="Please fill in the details"
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
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, city: e.target.value }))
            }
            value={userData.city || ""}
            placeholder="Please fill in the details"
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
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, state: e.target.value }))
            }
            value={userData.state || ""}
            placeholder="Please fill in the details"
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
          value={userData.dob ? userData.dob : ""}
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
            setUserData((prev) => ({ ...prev, dob: prev.dob || "" })); // Preserve existing dob
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
