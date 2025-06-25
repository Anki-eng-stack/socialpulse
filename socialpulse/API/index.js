import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser/index.js"; // 💡 ES module import fix
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import postRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";
import relationshipRoutes from "./routes/relationships.js";
import storiesRoutes from "./routes/stories.js";
import multer from "multer";
import { db } from "./connect.js";

const app = express();

// 🧠 Enable CORS credentials
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());
app.use(cookieParser());

// 💾 Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/uploads/posts');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

// 📦 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/stories", storiesRoutes);

// 🧯 Error handler (optional but good)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
db.connect();
app.listen(8800, () => {
  console.log("MyDevify Social is working ...");
});


