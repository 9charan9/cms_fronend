import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { updateVendorRating } from "../slice/VendorSlice";
const VendorRating = (props) => {
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const vendorId = props?.vendorId;
  const vendorName = props?.vendorName;
  const vendorRating = props?.rating;
  
  useEffect(() => {
    if (vendorRating !== undefined) {
      setRating(vendorRating);
    }
  }, [vendorRating]);

  const handleRatingClick = (newRating) => {
    const request = {
      vendor_id: vendorId,
      vendor_name: vendorName,
      rating: newRating.toString(),
    };
    setRating(newRating);
    dispatch(updateVendorRating(request));
  };
  return (
    <>
      <div className="rating">
        {[1, 2, 3, 4, 5].map((value, index) => (
          <FaStar
            key={index}
            size={24}
            onClick={() => handleRatingClick(value)}
            color={value <= rating ? "#ffc107" : "#e4e5e9"}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    </>
  );
};

export default VendorRating;
