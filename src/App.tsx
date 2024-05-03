import { Provider } from "react-redux"; // Import Provider from react-redux
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate from redux-persist
import { ToastContainer } from "react-toastify"; // Import ToastContainer for displaying toast notifications
import { ApolloProvider } from "@apollo/client";
import store, { persistor } from "./utils/store";
import { client } from "./utils/config";
import AppRoute from "./routes";

// Define the root component of your application
const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={false}
          hideProgressBar={true}
        />
        <AppRoute />
      </ApolloProvider>
    </PersistGate>
  </Provider>
);

export default App;
