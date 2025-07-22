import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="bg-primary fixed inset-0 top-0 flex items-center justify-center z-50">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
