import Button from "../components/Button";

export const Register: React.FC = () => {
  return (
    <div>
      <div className="text-6xl text-center mt-8">Register - Clickdummy</div>
      <div className="w-64 mx-auto mt-8">
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div>
            <label>Username</label>
            <input type="text" className="tb-input" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" className="tb-input" />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              className="tb-input"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" className="tb-input" />
          </div>
          <Button title="Register" />
        </form>
      </div>
    </div>
  );
};

export default Register;
