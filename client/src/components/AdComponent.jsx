import React, { useEffect, useRef } from "react";

const AdComponent = () => {
  const adInitialized = useRef(false);

  useEffect(() => {
    if (!adInitialized.current) {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        try {
          window.adsbygoogle.push({});
          adInitialized.current = true;
          console.log("add pushed");
        } catch (e) {
          console.error("Adsbygoogle push error:", e);
        }
      }
    }
  }, []);

  return (
    <div>
      <h1>Ad here</h1>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8478657719247644"
        data-ad-slot="6837378921"
        data-ad-format={"block"}
        data-ad-test="on"
        loading="lazy"
      ></ins>
    </div>
  );
};

export default AdComponent;
