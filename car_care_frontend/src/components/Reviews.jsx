import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

// const reviews = [
//   {
//     id: 1,
//     name: "Sahil Naik",
//     rating: 5,
//     comment: "Excellent service! Highly recommended.",
//   },
//   {
//     id: 2,
//     name: "Manguirish Lad",
//     rating: 4,
//     comment: "Good service, but waiting time was a bit long.",
//   },
//   {
//     id: 3,
//     name: "Neville D",
//     rating: 5,
//     comment: "Very professional and quick service.",
//   },
// ];

const Reviews = ({ sc_id }) => {

  //console.log("Received sc_id in Reviews:", sc_id);

  //new, with backend integration
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { backendUrl, token } = useContext(AppContext);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/user/reviews/${sc_id}`, { headers: { token } }
        );
        console.log("data : ", data);
        
        if (data.success) {
          setReviews(data.reviews);
        } else {
          setReviews([]); // Set empty if no success
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]); // Handle error by setting empty reviews
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [sc_id]);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>

      <div className="w-full h-40 overflow-y-auto rounded-lg shadow-lg border p-4 bg-gray-100">
        {loading ? (
          <p className="text-center text-gray-500">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="mb-4 last:mb-0 p-3 bg-white rounded-md shadow"
            >
              <p className="font-medium">{review.name}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < review.rating ? "text-yellow-500" : "text-gray-300"
                    }
                  >
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

export default Reviews;
