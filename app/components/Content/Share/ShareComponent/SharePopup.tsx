import { type FC, useState, useEffect, useRef } from "react";
import { type WithColors } from "~/types";

const SharePopup: FC<WithColors<Props>> = ({
  shareData,
  onClose,
  onError,
  colors,
}) => {
  const [state, setState] = useState<ShareState>("pending");
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state === "success") {
      timer.current = setInterval(() => setState("pending"), 3000);
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [state]);

  const copyClicked = async () => {
    try {
      await navigator.clipboard.writeText(shareData?.url || "");
      setState("success");
    } catch (err) {
      onError && onError(err);
      setState("error");
    }
  };

  const getButtonText = (state: ShareState) => {
    switch (state) {
      case "success":
        return "Link copied";
      case "pending":
      default:
        return "Copy link";
    }
  };

  return (
    <div
      className="fixed z-10 inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      onClick={onClose}
    >
      <div className="fixed z-20 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="mt-3  inline-flex text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {shareData.title}
                </h3>
                <button className="ml-4" onClick={onClose}>
                  <span className="sr-only">Close menu</span>
                  <div className="h-6 w-6" aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g id="close">
                        <path
                          id="x"
                          d="M18.717 6.697l-1.414-1.414-5.303 5.303-5.303-5.303-1.414 1.414 5.303 5.303-5.303 5.303 1.414 1.414 5.303-5.303 5.303 5.303 1.414-1.414-5.303-5.303z"
                        />
                      </g>
                    </svg>
                  </div>
                </button>
              </div>
              <div className="mt-2">
                {state === "error" ? (
                  // <Alert
                  //   glyph="infoRoundNoFill"
                  //   glyphColor={Color.ROOF_TERRACOTTA}
                  //   backgroundStyles={[errorStyles.background]}
                  //   borderStyles={[errorStyles.border]}
                  //   containerStyles={[errorStyles.container]}
                  //   textStyles={[errorStyles.text]}
                  //   textBlocks={[
                  //     {
                  //       text: "Unable to copy BuildABet to clipboard, ",
                  //       styles: [textStyles.bold],
                  //     },
                  //     {
                  //       text: "please manually copy the url to share.",
                  //     },
                  //   ]}
                  // />
                  <div />
                ) : null}
                <input
                  className="w-full mr-8 overflow-hidden"
                  value={shareData.url}
                  readOnly
                />
                <button
                  style={{
                    backgroundColor: colors.primary.hex,
                    color: colors.primaryText.hex,
                  }}
                  className="w-full mx-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={copyClicked}
                >
                  {getButtonText(state)}
                  {/* {state === "success" ? (
              <Glyph
                src={Glyph.icons.tick}
                className={css(styles.tickIcon)}
                size={12}
                color={Color.WHITE}
              />
            ) : null} */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type ShareState = "pending" | "success" | "error";

interface Props {
  shareData: ShareData;
  onClose: () => void;
  onError?: (error?: unknown) => void;
}
// const {
//   BREAKPOINTS: { MEDIUM },
// } = Size;

// const styles = StyleSheet.create({
//   blackOverlay: {
//     position: "fixed",
//     width: "100%",
//     opacity: "0.5",
//     margin: "0",
//     height: "200vh",
//     zIndex: 92,
//     backgroundColor: Color.TUNDORA,
//   },
//   container: {
//     backgroundColor: Color.WHITE,
//     borderRadius: "16px 16px 0 0",
//     overflow: "hidden",
//     position: "fixed",
//     width: "100%",
//     pointerEvents: "none",
//     bottom: "0",
//     zIndex: 100,
//     [`@media (min-width: ${MEDIUM.minWidth}px)`]: {
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       width: "375px",
//       bottom: "auto",
//       borderRadius: "16px",
//     },
//   },
//   header: {
//     display: "flex",
//     backgroundColor: Color.WHITE,
//     boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.08)",
//     overflow: "hidden",
//     marginBottom: "16px",
//   },
//   headerText: {
//     fontFamily: Font.SKY_MEDIUM,
//     lineHeight: "24px",
//     fontSize: "16px",
//     color: Color.COD_GRAY,
//     width: "100%",
//     textAlign: "center",
//     whiteSpace: "nowrap",
//     textOverflow: "ellipsis",
//     padding: "20px 0px 20px 42px",
//     overflow: "hidden",
//   },
//   closeButton: {
//     display: "inline-flex",
//     alignItems: "center",
//     padding: "20px 16px",
//     ":hover": {
//       background: "none",
//     },
//   },
//   content: {
//     display: "flex",
//     backgroundColor: Color.WHITE,
//     flexDirection: "column",
//     paddingLeft: "16px",
//     paddingRight: "16px",
//   },
//   genericButtonOverrides: {
//     border: "none",
//     alignItems: "center",
//     margin: "0",
//     padding: "0",
//     pointerEvents: "auto",
//     ":hover": {
//       background: "none",
//     },
//   },
//   copyLinkButton: {
//     color: Color.WHITE,
//     background: Color.BARTHEZ,
//     height: "48px",
//     width: "100%",
//     marginBottom: "16px",
//     borderRadius: "4px",
//     fontSize: "16px",
//     lineHeight: "24px",
//     fontFamily: Font.SKY_MEDIUM,
//     ":hover": {
//       background: Color.BARTHEZ,
//     },
//   },
//   url: {
//     color: Color.DAVYS_GREY,
//     cursor: "text",
//     border: `1px solid ${Color.GALLERY}`,
//     padding: "12px 16px 12px 16px",
//     marginBottom: "8px",
//     pointerEvents: "auto",
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//   },
//   icon: {
//     display: "flex",
//   },
//   tickIcon: {
//     marginLeft: "5px",
//   },
// });

// const errorStyles = StyleSheet.create({
//   container: {
//     margin: "0 0 12px 0",
//   },
//   background: {
//     backgroundColor: Color.CAROUSEL_PINK,
//   },
//   border: { border: `1px solid ${Color.ROOF_TERRACOTTA}` },
//   text: {
//     color: Color.ROOF_TERRACOTTA,
//   },
// });

// const textStyles = StyleSheet.create({
//   bold: {
//     fontFamily: Font.SKY_MEDIUM,
//   },
// });

export default SharePopup;
