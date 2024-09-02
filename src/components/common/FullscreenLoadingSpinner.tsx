import LoadingSpinner from "./LoadingSpinner";
import "./LoadingSpinner.css";

export default function FullscreenLoadingSpinner() {
  return (
    <div className="fullscreenBlurWithLoading">
      <LoadingSpinner />
    </div>
  );
}
