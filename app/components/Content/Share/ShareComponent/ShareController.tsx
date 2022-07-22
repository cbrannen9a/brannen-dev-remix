import { type FC } from "react";

const Share: FC<Props> = ({
  shareData,
  children,
  onInteraction,
  onSuccess,
  onError,
  onNonNativeShare,
  disabled,
}) => {
  const handleOnClick = async () => {
    onInteraction && onInteraction();
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onSuccess && onSuccess();
      } catch (err) {
        onError && onError(err);
      }
    } else {
      onNonNativeShare && onNonNativeShare();
    }
  };
  return (
    <button
      className="appearance-none"
      onClick={handleOnClick}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface Props {
  shareData: ShareData;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error?: unknown) => void;
  onNonNativeShare?: () => void;
  onInteraction?: () => void;
  disabled?: boolean;
}

export default Share;
