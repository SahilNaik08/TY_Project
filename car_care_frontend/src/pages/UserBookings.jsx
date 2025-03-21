import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserBookings = () => {
  const { backendUrl, token, getCentersData } = useContext(AppContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState({});
  const [ratings, setRatings] = useState({});
  const [showReviewBox, setShowReviewBox] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState({}); // Track submitted reviews

  const months = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserBookings = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/user-bookings`, {
        headers: { token },
      });

      if (data.success) {
        setBookings(data.bookings.reverse());
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching bookings");
    }
  };

  useEffect(() => {
    if (token) {
      getUserBookings();
    }
  }, [token]);

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-booking`,
        { bookingId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserBookings();
        getCentersData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error canceling booking");
    }
  };


  //new integrated review handling
  const handleReviewSubmit = async (bookingId, sc_id) => {
    if (!reviews[bookingId] || !ratings[bookingId]) {
      toast.error("Please enter a review and select a rating");
      return;
    }
  
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/submit-review`,
        {
          bookingId,
          sc_id,
          rating: ratings[bookingId],
          review_text: reviews[bookingId],
        },
        { headers: { token } }
      );

      //console.log("Server response:", data); // Log the entire response
  
      if (data.success) {
        toast.success("Review submitted successfully!");
        setShowReviewBox((prev) => ({ ...prev, [bookingId]: false }));
        setReviewSubmitted((prev) => ({ ...prev, [bookingId]: true }));
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting review");
    }
  };
  



  //hard coded review handling
  // // Handle review submission (Mock for now)
  // const handleReviewSubmit = (bookingId) => {
  //   if (!reviews[bookingId] || !ratings[bookingId]) {
  //     toast.error("Please enter a review and select a rating");
  //     return;
  //   }

  //   // Mock submission
  //   toast.success("Review Submitted!");
  //   setShowReviewBox((prev) => ({ ...prev, [bookingId]: false }));
  //   setReviewSubmitted((prev) => ({ ...prev, [bookingId]: true }));
  // };







  // Handle review submission
  // const submitReview = async (bookingId) => {
  //   if (!reviews[bookingId] || !ratings[bookingId]) {
  //     toast.error("Please enter a review and select a rating");
  //     return;
  //   }

  //   try {
  //     const { data } = await axios.post(
  //       `${backendUrl}/api/user/submit-review`,
  //       { bookingId, review: reviews[bookingId], rating: ratings[bookingId] },
  //       { headers: { token } }
  //     );

  //     if (data.success) {
  //       toast.success("Review submitted successfully!");
  //       setShowReviewBox((prev) => ({ ...prev, [bookingId]: false }));
  //     } else {
  //       toast.error("Failed to submit review");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Error submitting review");
  //   }
  // };

  // // Function to check if the cancel button should be visible
  // const canCancel = (bookingTime) => {
  //   const bookingTimestamp = new Date(bookingTime).getTime();
  //   const currentTimestamp = new Date().getTime();
  //   return currentTimestamp - bookingTimestamp <= 10 * 60 * 1000; // 10 minutes
  // };

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Bookings</p>

      <div>
        {bookings.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={`http://localhost:3000${item.serviceCenterData.imageUrl}`}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.serviceCenterData.service_center_name}
              </p>
              <p>{item.serviceType}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.serviceCenterData.service_center_city}</p>
              <p className="text-xs">{item.serviceCenterData.service_center_state}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time :</span> 
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              {item.isCompleted === 1 ? (
                <>
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>

                  {!reviewSubmitted[item.bookingId] ? (
                    !showReviewBox[item.bookingId] ? (
                      <button
                        onClick={() =>
                          setShowReviewBox((prev) => ({ ...prev, [item.bookingId]: true }))
                        }
                        className="text-sm text-blue-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300"
                      >
                        Give Review
                      </button>
                    ) : (
                      <div className="mt-2">
                        <textarea
                          className="w-full p-2 border rounded"
                          placeholder="Write your review..."
                          value={reviews[item.bookingId] || ""}
                          onChange={(e) =>
                            setReviews((prev) => ({ ...prev, [item.bookingId]: e.target.value }))
                          }
                        ></textarea>

                        <div className="flex mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`cursor-pointer text-2xl ${
                                ratings[item.bookingId] >= star ? "text-yellow-500" : "text-gray-300"
                              }`}
                              onClick={() =>
                                setRatings((prev) => ({ ...prev, [item.bookingId]: star }))
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handleReviewSubmit(item.bookingId, item.serviceCenterData.sc_id)}
                          className={`mt-2 w-full py-2 rounded ${
                            reviews[item.bookingId] && ratings[item.bookingId]
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                          }`}
                          disabled={!reviews[item.bookingId] || !ratings[item.bookingId]}
                        >
                          Submit Review
                        </button>
                      </div>
                    )
                  ) : (
                    <button
                      className="text-sm text-gray-500 text-center sm:min-w-48 py-2 border rounded bg-gray-100 cursor-default"
                      disabled
                    >
                      Reviewed
                    </button>
                  )}
                </>
              ) : (
                <>
                  {item.cancelled === 0 && (
                    <button
                      onClick={() => navigate(`/bookings/${item.serviceCenterData.sc_id}`)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Re-Schedule
                    </button>
                  )}

{/* {item.cancelled === 0 && canCancel(item.bookingTime) && (
                    <button
                      onClick={() => cancelBooking(item.bookingId)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel Booking
                    </button> */}

                  {item.cancelled === 0 && (
                    <button
                      onClick={() => cancelBooking(item.bookingId)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel booking
                    </button>
                  )}

                  {item.cancelled === 1 && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                      Booking Cancelled
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;
