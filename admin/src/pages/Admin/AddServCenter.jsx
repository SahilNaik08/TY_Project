import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddServCenter = () => {
  const [scImg, setScImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");
  const [serviceType, setServiceType] = useState("All Round");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  {
    /*// Cleanup image preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewImg) URL.revokeObjectURL(previewImg);
    };
  }, [previewImg]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScImg(file);
      setPreviewImg(URL.createObjectURL(file)); // Create preview URL
    }
  };

  */
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!scImg) return toast.error("Please select an image!");
    if (!name || !email || !password || !city || !state || !about)
      return toast.error("All fields are required!");

    try {
      const formData = new FormData();

      //to send data to backend

      formData.append("image", scImg);
      formData.append("sc_name", name);
      formData.append("sc_email", email);
      formData.append("password", password);
      formData.append("serviceType", serviceType);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("about", about);

      //console log form data
      formData.forEach((value, key) => {
        console.log(`${key}, ${value}`);
      });

      //api call to save data in db
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-service-center",
        formData,
        // { headers: { aToken } }
        {
          headers: { "Content-Type": "multipart/form-data", aToken },
        }
      );

      if (data.success) {
        toast.success(data.message);

        //reseting form fields
        setScImg(false);
        setName("");
        setEmail("");
        setPassword("");
        setCity("");
        setState("");
        setAbout("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add service center. Try again later.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Service Center</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="sc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={scImg ? URL.createObjectURL(scImg) : assets.upload_area}
              alt=""
            />
          </label>

          <input
            type="file"
            onChange={(e) => setScImg(e.target.files[0])}
            id="sc-img"
            hidden
          />
          <p>
            Upload Service Center <br />
            Image
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Service Center Name</p>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Service Center Email</p>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Service Center Password</p>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Service Type</p>
              <select
                onChange={(e) => setServiceType(e.target.value)}
                value={serviceType}
                className="border rounded px-2 py-2"
              >
                <option value="All Round">All Round</option>
                <option value="Car Wash">Car Wash</option>
                <option value="Car Maintenance">Car Maintenance</option>
                <option value="Repairs">Repairs</option>
                <option value="Spare Parts">Spare Parts</option>
                <option value="Roadside Assistance">Roadside Assistance</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Service Center City</p>
              <input
                type="text"
                onChange={(e) => setCity(e.target.value)}
                value={city}
                className="border rounded px-3 py-2"
                placeholder="City"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Service Center State</p>
              <input
                type="text"
                onChange={(e) => setState(e.target.value)}
                value={state}
                className="border rounded px-3 py-2"
                placeholder="State"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Service Center</p>
          <textarea
            className="w-full px-4 pt-2 border rounded"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            placeholder="Write about the service center details"
            rows={5}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Service Center
        </button>
      </div>
    </form>
  );
};

export default AddServCenter;
