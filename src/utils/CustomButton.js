import { styled, Button } from "@mui/material";
import { forwardRef } from "react";

const CustomButton = styled(forwardRef(({ ...props }, ref) => <Button {...props} ref={ref} />))`
  &:hover {
    opacity: 85%;
  }
`;

export default CustomButton;
