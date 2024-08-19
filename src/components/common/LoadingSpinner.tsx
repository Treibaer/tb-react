import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="fullscreenBlurWithLoading">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
