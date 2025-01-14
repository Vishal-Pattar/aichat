import React, { useState, useEffect } from "react";
import CouponTable from "./CouponTable";
import axios from "../../../api/axios.js";
import withAuthorization from "../../../utils/withAuthorization";
import { Permissions } from "../../../utils/roles";
import { useAlert } from "../../../context/AlertContext";

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [couponStats, setCouponStats] = useState([]);
  const [numberOfCoupons, setNumberOfCoupons] = useState("");
  const [creditsPerCoupon, setCreditsPerCoupon] = useState("");
  const { addAlert } = useAlert();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get("/coupons");
      const data = response.data.data;
      const sortedCoupons = data.sort((a, b) => {
        if (a.status !== b.status) {
          return a.status - b.status;
        }
        return new Date(a.created_at) - new Date(b.created_at);
      });
      setCouponStats(response.data.count);
      setCoupons(sortedCoupons);
    } catch (error) {
      addAlert(
        error.response ? error.response.data.message : error.message,
        "error",
        "bottom_right"
      );
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await axios.post("/coupons", {
        numberOfCoupons: parseInt(numberOfCoupons),
        creditsPerCoupon: parseInt(creditsPerCoupon),
      });
      const newCoupons = response.data.data;
      console.log("newCoupons:", response);

      const sortedCoupons = [...coupons, ...newCoupons].sort((a, b) => {
        if (a.status !== b.status) {
          return a.status - b.status;
        }
        return new Date(a.created_at) - new Date(b.created_at);
      });

      setCoupons(sortedCoupons);
      setCouponStats(response.data.count);
      setNumberOfCoupons("");
      setCreditsPerCoupon("");
    } catch (error) {
      addAlert(
        error.response ? error.response.data.message : error.message,
        "error",
        "bottom_right"
      );
    }
  };

  const handleRefresh = () => {
    fetchCoupons();
  };

  return (
    <>
      <div className="admin__container">
        <span className="admin__title">Coupon Stats</span>
        <div className="admin__stats">
          <div className="admin__stat">
            Used:&nbsp;<span className="redColor">{couponStats.used}</span>
          </div>
          <div className="admin__stat">
            Available:&nbsp;
            <span className="greenColor">{couponStats.available}</span>
          </div>
          <div className="admin__button" onClick={handleRefresh}>
            Refresh
          </div>
        </div>
        <div className="admin__cover admin__cover--mobile">
          <input
            type="text"
            className="admin__input admin__input--small"
            placeholder="Number"
            maxLength={2}
            value={numberOfCoupons}
            onChange={(e) => setNumberOfCoupons(e.target.value)}
          />
          <input
            type="text"
            className="admin__input admin__input--small"
            placeholder="Credits"
            maxLength={3}
            value={creditsPerCoupon}
            onChange={(e) => setCreditsPerCoupon(e.target.value)}
          />
          <button className="admin__button" onClick={handleGenerate}>
            Generate
          </button>
        </div>
      </div>
      <div className="admin__box admin__box--coupon">
        {coupons.map((coupon) => (
          <CouponTable key={coupon.code} coupon={coupon} />
        ))}
      </div>
    </>
  );
};

export default withAuthorization(Permissions.Admin_Access)(Coupon);
