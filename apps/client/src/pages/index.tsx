
import AuthTest from "../components/AuthTest";
import TestApi from "../components/TestApi";

  export default function Home() {
    return (
      <div>
        <h1>Welcome to Permiset!</h1>
        <AuthTest />
        <TestApi />
      </div>
    );
  }