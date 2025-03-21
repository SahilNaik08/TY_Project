import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { ServCenterContext } from "../context/ServCenterContext";

const ServiceCenterReviews = ({ sc_id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(AppContext);

  const {scToken} = useContext(ServCenterContext)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/service-center/reviews/${sc_id}`);
        console.log("data : ", data.reviews);
          
        if (data.success) {
          setReviews(data.reviews);
          
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching service center reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [sc_id]);

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

      <div className="w-full max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-100">
        {loading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="mb-4 p-3 bg-white rounded-md shadow">
              <p className="font-medium">{review.name}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ServiceCenterReviews;
