import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface IProp{
  numberoFSkeleton : number
}

function SkeletonUI(prop : IProp) {
  let numberoFSkeleton = prop.numberoFSkeleton;
  const returnUI = [];

  while(numberoFSkeleton--){
    returnUI.push(renderSkeleton())
  }
  return (
    <>
    {returnUI}
    </>
  )

  function renderSkeleton(){
    return <Box className='my-4'>
    <Skeleton />
    <Skeleton animation="wave" />
    <Skeleton animation={false} />
    <Skeleton animation="wave" />
    <Skeleton animation={false} />
  </Box>
  }
}

export default SkeletonUI;