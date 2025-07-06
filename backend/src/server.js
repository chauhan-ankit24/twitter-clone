import express from "express";

const app = express();

const startServer = async () => {
//   try {
    
    // listen for local development
    // if (ENV.NODE_ENV !== "production") {
      app.listen(5000, () =>
        console.log("Server is up and running on PORT:", 5000)
      );
    // }x
  
};

startServer();

// export for vercel
export default app;
