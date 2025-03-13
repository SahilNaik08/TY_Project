import React from "react";

const reviews = [
  { id: 1, name: "Sahil Naik", rating: 5, comment: "Excellent service! Highly recommended." },
  { id: 2, name: "Manguirish Lad", rating: 4, comment: "Good service, but waiting time was a bit long." },
  { id: 3, name: "Neville D", rating: 5, comment: "Very professional and quick service." },
];

const Reviews = () => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-2">Customer Reviews</h2>

      {/* Review Box with Scroll */}
      <div className="w-full h-40 overflow-y-auto rounded-lg shadow-lg border p-4 bg-gray-100">
        {reviews.map((review) => (
          <div key={review.id} className="mb-4 last:mb-0 p-3 bg-white rounded-md shadow">
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
        ))}
      </div>
    </div>
  );
};

export default Reviews;
