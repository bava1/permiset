import React, { useState } from "react";
import axiosClient from "../api/axiosClient";

const TestApi: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);

  const testApiConnection = async () => {
    try {
      const token = localStorage.getItem("auth_token");
  
      // Добавляем токен в заголовок Authorization
      const res = await axiosClient.get("/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setResponse(JSON.stringify(res.data));
    } catch (err) {
      setResponse("Error: Unable to connect to the server.");
      console.error(err);
    }
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={testApiConnection}>Test API Connection</button>
      {response && <pre>{response}</pre>}
    </div>
  );
};

export default TestApi;
