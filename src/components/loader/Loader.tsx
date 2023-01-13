import { Box } from "@mui/system";
import React from "react";
import { ColorRing } from "react-loader-spinner";

type IProp = {
  isVisible: boolean;
};

function Loader(prop: IProp) {
  return (
    <>
    {prop.isVisible && <Box sx={{width:"100vw",height:"100vh",position:"fixed",zIndex:"99999",top:0,left:0}}>
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
    </Box>}
    </>
  );
}

export default Loader;
