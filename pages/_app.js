import "../styles/globals.css";
import { Provider } from "react-redux";
import store from "../store/index";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import React from "react";
import { useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/////////////////////////////////////////
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 20000,
      refetchOnWindowFocus: false,
      // staleTime: 20000, // 20sec
      retry: 2,
    },
  },
});
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       cacheTime: 20000,
//       refetchOnWindowFocus: false,
//       staleTime: 20000, // 20sec
//       retry: 2,
//     },
//   },
// });

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const isUserOnline = globalThis.window?.navigator?.onLine;
  // timer for logging out user
  // setTimeout(() => {
  //   window.sessionStorage.clear();
  //   window.location.replace('/')
  //   alert("Your session expired. Please log in again")
  // }, 600000)

  useEffect(() => {
    // checking if user is online
    if (!isUserOnline) {
      notify("No Internet Connection detected!");
      // logging out user
      // if (globalThis.window?.location.pathname === "/")
      // globalThis.window?.location?.replace("/");
    }
  }, [isUserOnline]);

  const notify = useCallback((msg) => toast(msg));

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <React.StrictMode>
            <Component {...pageProps} />
            <ToastContainer
              autoClose={2000}
              hideProgressBar={true}
              rtl={false}
              newestOnTop={true}
              theme="light"
            />
          </React.StrictMode>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </SessionProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
