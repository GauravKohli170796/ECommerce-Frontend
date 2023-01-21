import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';


const prodHeaderList = [
    {icon:<CurrencyRupeeIcon sx={{fontSize:"60px",backgroundColor: "#9c27b0", color: "white",marginY:"16px"}}/>,title:"Affordable Price" },
    {icon:<FactCheckIcon sx={{fontSize:"60px",backgroundColor: "#9c27b0", color: "white",marginY:"16px"}}/>,title:"Best Quality" },
    {icon:<VolunteerActivismIcon sx={{fontSize:"60px",backgroundColor: "#9c27b0", color: "white",marginY:"16px"}}/>,title:"Handpicked" },
]

function ProdHeader() {
  return (
    <Box className="mixBackground my-4 py-2" sx={{display:"flex",color:"white",width:"100vw",justifyContent:"space-around"}}>
           {prodHeaderList.map((item)=>{
           return <Stack key={item.title} sx={{display:"flex",justifyContent:"center",alignItems:"center"}}>
               {item.icon}
               <Typography sx={{textAlign:"center"}}>{item.title}</Typography>
           </Stack>


           })}
      

    </Box>
  )
}

export default ProdHeader;