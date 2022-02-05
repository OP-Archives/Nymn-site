import React, { useEffect } from "react";

export default function Redirect(props) {
  useEffect(() => {
    window.location.href = props.redirect;
  }, [props.redirect]);

  return <></>;
}
