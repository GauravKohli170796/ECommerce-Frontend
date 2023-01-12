import React from "react";
import { ColorRing } from "react-loader-spinner";

type IProp = {
  isVisible: boolean;
};

function Loader(prop: IProp) {
  return (
    <ColorRing
      visible={prop.isVisible}
      height="180"
      width="180"
      ariaLabel="blocks-loading"
      wrapperStyle={{
        position: "fixed",
        top: "0",
        left: "0",
        transform: "translate(calc(50vw - 50%), calc(50vh - 50%))",
        zIndex:"9999"
      }}
      wrapperClass="blocks-wrapper"
      colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
    />
  );
}

export default Loader;
