import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { prisma } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { vehicleRouter } from "./routes/vehicles.js";
import { dealerRouter } from "./routes/dealers.js";
import { customerRouter } from "./routes/customers.js";
import { salesRouter } from "./routes/sales.js";
import { csvRouter } from "./routes/csv.js";
import { enquiryRouter } from "./routes/enquiries.js";
import { bookingRouter } from "./routes/bookings.js";
import { staffRouter } from "./routes/staff.js";
import { calendarBlockRouter } from "./routes/calendarBlocks.js";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: "ok", env: env.NODE_ENV });
});

app.use("/api/vehicles", vehicleRouter);
app.use("/api/dealers", dealerRouter);
app.use("/api/customers", customerRouter);
app.use("/api/sales", salesRouter);
app.use("/api/csv", csvRouter);
app.use("/api/enquiries", enquiryRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/staff", staffRouter);
app.use("/api/calendar-blocks", calendarBlockRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${env.PORT}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close();
});

export default app;
