import React from "react";
import moment from "moment";
import { Button, Badge } from "reactstrap";

// export const moneyItemAdapter = (number = 0) => {
//   return number ? `${number.toLocaleString()} đ` : "0đ";
// };

export const moneyItemAdapter = (
  price,
  locales = "vn-VN",
  currency = "VND"
) => {
  if (!price) {
    return "0 đ";
  }
  return (
    new Intl.NumberFormat(locales, {
      currency: currency,
    }).format(price) + " đ"
  );
};

export const dateTimeAdapter = (time) => {
  return moment(time).format("HH:mm:ss DD/MM/YYYY");
};

export const statusAdapter = (status) => {
  if (status === "pending") {
    return <Badge color="primary">Chưa xử lý</Badge>;
  } else if (status === "completed")
    return <Badge color="success">Đã xử lý</Badge>;
  else if (status === "rejected") return <Badge color="danger">Từ chối</Badge>;
  else
    return (
      <Badge className="badge badge-secondary badge-pill">Chờ duyệt</Badge>
    );
};
