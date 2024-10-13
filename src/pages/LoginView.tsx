import { useEffect, useRef } from "react";
import FullscreenLoadingSpinner from "../components/common/FullscreenLoadingSpinner";
import { useLogin } from "../hooks/auth/useLogin";
import Button from "../components/Button";

export const LoginView: React.FC<{ setIsLoggedIn: React.Dispatch<any> }> = ({
  setIsLoggedIn,
}) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleLogin,
  } = useLogin(setIsLoggedIn);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      {isSubmitting && <FullscreenLoadingSpinner />}

      <div className="flex flex-col gap-2 w-[calc(100vw-16px)] border border-lightBlue max-w-[500px] sm:max-w-[500px] md:max-w-[600px] p-2 rounded shadow-lg absolute top-1/2 sm:top-52 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <h1 className="mb-4">Login</h1>
        <div className="h-10">
          {error && (
            <div className="bg-red-300 p-1 m-1 rounded text-slate-800">
              {error}
            </div>
          )}
        </div>
        <input
          className="tb-input"
          type="text"
          placeholder="Username"
          ref={inputRef}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="tb-input mb-10"
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button title="Login" onClick={handleLogin} />
      </div>
    </div>
  );

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="text-green-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="text-green-800"
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginView;
