import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useRef } from 'react';
import { GetAppState } from '../../AppContext';
import { IProduct } from '../../models/productModel';
import ProductCard from './ProductCard';

interface IProp{
    name: string,
}

function ProductScroll(prop: IProp) {
    const ref = useRef<HTMLDivElement>(null);
    const AppState = GetAppState();

    const renderLatestProducts = () => {
        return AppState?.initialProducts?.latestProduct.map((product: IProduct) => {
            return <ProductCard key={product._id} product={product}/>;
        });
    };

    const handleScrollForLatestProducts = () => {
        if (ref.current) {
            ref.current.scrollLeft += 320;
        }
    }

    return (
        <>
            {AppState?.initialProducts?.latestProduct && <><Box>
                <Typography className="section-head" sx={{ fontSize: "25px" }}>
                    {`${prop.name} Products`}
                </Typography>
            </Box>
            
            <IconButton disableFocusRipple disableRipple onClick={handleScrollForLatestProducts} sx={{ backgroundColor: "#BA68C8", color: "white", alignSelf: "flex-end", marginX: "16px" }}>
                <NavigateNextIcon />
            </IconButton>
            <Box ref={ref}
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    width: "96vw",
                    margin: "10px 10px",
                    overflowX: "scroll",
                    overflowY:"clip"
                }}
            >
                {renderLatestProducts()}
            </Box></>}
        </>
    )
}

export default ProductScroll;