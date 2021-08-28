import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import Aplify from "aws-amplify";
import awsConfig from "./aws-exports";

Aplify.configure(awsConfig);

function App() {
  return (
    <AmplifyAuthenticator>
      <AmplifySignOut />
    </AmplifyAuthenticator>
  );
}

export default App;
