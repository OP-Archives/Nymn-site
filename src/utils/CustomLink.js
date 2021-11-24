import { styled, Link } from "@mui/material";
import { forwardRef } from "react";

const CustomLink = styled(forwardRef(({ ...props }, ref) => <Link {...props} ref={ref} />))`
  &:hover {
    opacity: 50%;
  }
`;

export default CustomLink;
