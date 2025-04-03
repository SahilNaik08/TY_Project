import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddRoadsideAssistance = () => {
  const [raImg, setRaImg] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState(""); // New Contact Field
  const [city, setCity] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state for password visibility

  const { backendUrl, aToken } = useContext(AdminContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Email Validation Function
  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // Password Validation Function
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Contact Number Validation Function
  const isValidContact = (contact) => {
    // Ensure contact is exactly 10 digits and doesn't have all identical digits
    return /^[0-9]{10}$/.test(contact) && !/^(\d)\1{9}$/.test(contact);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!raImg) return toast.error("Please select an image!");
    if (!name || !email || !password || !contact || !city)
      return toast.error("All fields are required!");

    if (!isValidEmail(email)) {
      return toast.error("Please enter a valid email address!");
    }

    if (!validatePassword(password))
      return toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );

    if (!isValidContact(contact)) {
      return toast.error(
        "Please enter a valid 10-digit contact number (not all same digits)."
      );
    }

    try {
      const formData = new FormData();
      formData.append("image", raImg);
      formData.append("ra_name", name);
      formData.append("ra_email", email);
      formData.append("password", password);
      formData.append("contact", contact);
      formData.append("city", city);
      formData.append("state", "Goa"); // Fixed state

      console.log("Form Data:");
      formData.forEach((value, key) => console.log(`${key}: ${value}`));

      // API call to save data in DB
      const { data } = await axios.post(
        backendUrl + "/api/admin/add-roadside-assistance",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data", aToken },
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Resetting form fields
        setRaImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setContact("");
        setCity("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add roadside assistance. Try again later.");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Roadside Assistance</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="ra-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={raImg ? URL.createObjectURL(raImg) : assets.upload_area}
              alt=""
            />
          </label>

          <input
            type="file"
            onChange={(e) => setRaImg(e.target.files[0])}
            id="ra-img"
            hidden
          />
          <p>
            Upload Roadside Assistance <br />
            Image
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Name</p>
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
              <p>Email</p>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                placeholder="Email"
                required
              />
            </div>

            {/* Password Field with Visibility Toggle */}
            <div className="flex-1 flex flex-col gap-1 relative">
              <p>Password</p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>City</p>
              <select
                onChange={(e) => setCity(e.target.value)}
                value={city}
                className="border rounded px-2 py-2"
                required
              >
                <option value="">Select City</option>
                <option value="Panjim">Panjim</option>
                <option value="Mapusa">Mapusa</option>
                <option value="Porvorim">Porvorim</option>
                <option value="Margao">Margao</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>State</p>
              <input
                type="text"
                value="Goa"
                className="border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Contact Number</p>
              <input
                type="text"
                onChange={(e) => setContact(e.target.value)}
                value={contact}
                className="border rounded px-3 py-2"
                placeholder="Enter 10-digit contact number"
                maxLength="10"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Roadside Assistance
        </button>
      </div>
    </form>
  );
};

export default AddRoadsideAssistance;
