import React, { useState } from "react";
import { assets } from "../assets/assets";

const carData = {
  "Maruti Suzuki": ["Swift", "Baleno", "Wagon R", "Dzire", "Ertiga"],
  Hyundai: ["i20", "Creta", "Verna", "Santro", "Venue"],
  Honda: ["City", "Amaze", "Civic", "Jazz", "WR-V"],
  Tata: ["Nexon", "Harrier", "Altroz", "Safari", "Tiago"],
  Ford: ["Ecosport", "Figo", "Endeavour", "Aspire", "Freestyle"],
  Volkswagen: ["Polo", "Vento", "Tiguan", "Ameo", "Taigun"],
  Mahindra: ["XUV700", "Thar", "Bolero", "Scorpio", "XUV300"],
  Renault: ["Kwid", "Triber", "Kiger", "Duster"],
  Chevrolet: ["Beat", "Cruze", "Tavera", "Enjoy"],
};

const sparePartsData = {
  Engine: [
    { id: 1, name: "Engine Oil", price: "₹1200", imageUrl: assets.Engineblock },
    { id: 2, name: "Piston Set", price: "₹2500", imageUrl: assets.Bolt },
    { id: 3, name: "Camshaft", price: "₹3500", imageUrl: assets.Crankshaft },
    { id: 4, name: "Timing Belt", price: "₹1800", imageUrl: assets.Bracket },
  ],
  Nuts: [
    { id: 5, name: "Hex Nut Set", price: "₹200", imageUrl: assets.Nut },
    { id: 6, name: "Lock Nut", price: "₹350", imageUrl: assets.Clamp },
    { id: 7, name: "Wing Nut", price: "₹150", imageUrl: assets.Flywheel },
    { id: 8, name: "Flange Nut", price: "₹300", imageUrl: assets.Fastener },
  ],
};

const Spares = () => {
  const [selectedBrand, setSelectedBrand] = useState("Select Brand");
  const [selectedModel, setSelectedModel] = useState("Select Model");
  const [selectedType, setSelectedType] = useState("Engine");
  const [cart, setCart] = useState({});

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel("Select Model"); // Reset model selection when brand changes
  };

  const addToCart = (item) => {
    setCart((prevCart) => ({
      ...prevCart,
      [item.id]: prevCart[item.id] ? { ...prevCart[item.id], quantity: prevCart[item.id].quantity + 1 } : { ...item, quantity: 1 },
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[itemId].quantity > 1) {
        newCart[itemId].quantity -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  return (
    <div>
      <p className="text-gray-600">Browse through our Spare Parts Collection</p>

      {/* Car Brand Selection */}
      <div className="mt-4 w-60">
        <select
          className="w-full px-4 py-2 border rounded-md bg-white text-gray-700"
          value={selectedBrand}
          onChange={handleBrandChange}
        >
          <option>Select Brand</option>
          {Object.keys(carData).map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Car Model Selection (Enabled only after selecting a brand) */}
      <div className="mt-4 w-60">
        <select
          className="w-full px-4 py-2 border rounded-md bg-white text-gray-700"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={selectedBrand === "Select Brand"}
        >
          <option>Select Model</option>
          {selectedBrand !== "Select Brand" &&
            carData[selectedBrand].map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Sidebar Filter */}
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          {Object.keys(sparePartsData).map((type) => (
            <p
              key={type}
              onClick={() => setSelectedType(type)}
              className={`pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                selectedType === type ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {type}
            </p>
          ))}
        </div>

        {/* Spare Parts Display */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {sparePartsData[selectedType].map((item) => (
            <div
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={item.id}
            >
              <img
                className="h-48 w-auto mx-auto object-contain bg-blue-50"
                src={item.imageUrl}
                alt={item.name}
              />
              <div className="p-4">
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.price}</p>
                <div className="mt-2 flex items-center gap-2">
                  {cart[item.id]?.quantity > 0 ? (
                    <>
                      <button onClick={() => removeFromCart(item.id)} className="px-2 py-1 bg-red-600 text-white rounded">-</button>
                      <span>{cart[item.id]?.quantity || 0}</span>
                      <button onClick={() => addToCart(item)} className="px-2 py-1 bg-green-600 text-white rounded">+</button>
                    </>
                  ) : (
                    <button onClick={() => addToCart(item)} className="px-3 py-1 bg-blue-500 text-white rounded">Add to Cart</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Icon */}
      <div className="fixed top-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-full">
        Cart: {Object.values(cart).reduce((acc, item) => acc + item.quantity, 0)}
      </div>
    </div>
  );
};

export default Spares;
