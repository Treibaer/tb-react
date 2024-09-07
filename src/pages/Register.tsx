import Button from "../components/Button";

export const Register: React.FC = () => {
  return (
    <div>
      <div className="text-6xl text-center mt-8">Register</div>
      <div>
        <form>
          <div>
            <label>Username</label>
            <input type="text" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" />
          </div>
          <Button title="Register" />
        </form>
      </div>
    </div>
  );
};

export default Register;
