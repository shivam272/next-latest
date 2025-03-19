// "use client";
import { usePathname } from "next/navigation";
import React from "react";

const About: React.FC = (props) => {
  //   const path = usePathname();
  console.log(props);
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page of our application.</p>
    </div>
  );
};

export default About;
