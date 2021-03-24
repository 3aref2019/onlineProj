import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Result
      status="404"
      title="The page you are looking for is not found"
      extra={
        <Button type="primary">
          <Link to="/">HOMEPAGE</Link>
        </Button>
      }
    />
  );
};

export default NotFound;
