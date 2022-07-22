import { type WithColors, type ShareContent } from "~/types";
import { type FC } from "react";
import Share from "../ShareComponent";
import { useLocation } from "@remix-run/react";

const ShareSection: FC<WithColors<Pick<ShareContent, "shareData">>> = ({
  shareData,
  colors,
}) => {
  const location = useLocation();

  console.log(location);

  if (!shareData) return null;
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 p-1 sm:p-4">
      <Share shareData={shareData} colors={colors}>
        <span>Share</span>
      </Share>
    </div>
  );
};

export default ShareSection;
