import React from "react";
import { ThreeDots } from "react-loader-spinner";

const threeDots = () => {
  return (
    <>
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#6366f1"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </>
  );
};

export default threeDots;
