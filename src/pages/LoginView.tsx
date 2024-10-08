import { useLogin } from "../hooks/auth/useLogin";

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
