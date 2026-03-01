import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("schedform.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    slug TEXT UNIQUE,
    title TEXT,
    description TEXT,
    type TEXT CHECK(type IN ('booking', 'form', 'combined')),
    flow_mode TEXT CHECK(flow_mode IN ('book_then_form', 'form_then_book', 'form_only', 'booking_only')),
    settings JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER,
    day_of_week INTEGER, -- 0-6
    start_time TEXT, -- HH:mm
    end_time TEXT, -- HH:mm
    FOREIGN KEY(link_id) REFERENCES links(id)
  );

  CREATE TABLE IF NOT EXISTS forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER,
    fields JSON,
    FOREIGN KEY(link_id) REFERENCES links(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER,
    start_time DATETIME,
    end_time DATETIME,
    user_name TEXT,
    user_email TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(link_id) REFERENCES links(id)
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER,
    booking_id INTEGER,
    data JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(link_id) REFERENCES links(id),
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );
`);

// Seed a default user if none exists
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (email, name) VALUES (?, ?)").run("demo@schedform.com", "Demo User");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Get all links for the demo user
  app.get("/api/my-links", (req, res) => {
    const links = db.prepare("SELECT * FROM links WHERE user_id = 1 ORDER BY created_at DESC").all();
    res.json(links);
  });

  // Get link details by slug (public)
  app.get("/api/links/:slug", (req, res) => {
    const link = db.prepare("SELECT * FROM links WHERE slug = ?").get(req.params.slug) as any;
    if (!link) return res.status(404).json({ error: "Link not found" });

    const availability = db.prepare("SELECT * FROM availability WHERE link_id = ?").all(link.id);
    const form = db.prepare("SELECT * FROM forms WHERE link_id = ?").get(link.id) as any;
    const bookings = db.prepare("SELECT start_time, end_time FROM bookings WHERE link_id = ? AND status = 'confirmed'").all(link.id);

    res.json({
      ...link,
      availability,
      form: form ? JSON.parse(form.fields) : null,
      bookings
    });
  });

  // Create a new link
  app.post("/api/links", (req, res) => {
    const { title, slug, type, flow_mode, description, availability, formFields } = req.body;
    
    try {
      const result = db.transaction(() => {
        const linkInsert = db.prepare(`
          INSERT INTO links (user_id, slug, title, description, type, flow_mode, settings)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(1, slug, title, description, type, flow_mode, JSON.stringify({}));

        const linkId = linkInsert.lastInsertRowid;

        if (availability && Array.isArray(availability)) {
          const availStmt = db.prepare("INSERT INTO availability (link_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)");
          for (const avail of availability) {
            availStmt.run(linkId, avail.day_of_week, avail.start_time, avail.end_time);
          }
        }

        if (formFields) {
          db.prepare("INSERT INTO forms (link_id, fields) VALUES (?, ?)").run(linkId, JSON.stringify(formFields));
        }

        return linkId;
      })();

      res.json({ id: result, slug });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Create a booking and/or form submission
  app.post("/api/links/:slug/submit", (req, res) => {
    const { booking, formData } = req.body;
    const link = db.prepare("SELECT id FROM links WHERE slug = ?").get(req.params.slug) as any;
    if (!link) return res.status(404).json({ error: "Link not found" });

    try {
      const result = db.transaction(() => {
        let bookingId = null;
        if (booking) {
          const bookingInsert = db.prepare(`
            INSERT INTO bookings (link_id, start_time, end_time, user_name, user_email)
            VALUES (?, ?, ?, ?, ?)
          `).run(link.id, booking.start_time, booking.end_time, booking.user_name, booking.user_email);
          bookingId = bookingInsert.lastInsertRowid;
        }

        if (formData) {
          db.prepare(`
            INSERT INTO submissions (link_id, booking_id, data)
            VALUES (?, ?, ?)
          `).run(link.id, bookingId, JSON.stringify(formData));
        }

        return { bookingId };
      })();

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Get submissions for a link
  app.get("/api/links/:id/submissions", (req, res) => {
    const submissions = db.prepare(`
      SELECT s.*, b.user_name, b.user_email, b.start_time as booking_time
      FROM submissions s
      LEFT JOIN bookings b ON s.booking_id = b.id
      WHERE s.link_id = ?
      ORDER BY s.created_at DESC
    `).all(req.params.id);
    res.json(submissions);
  });

  // Stats for dashboard
  app.get("/api/stats", (req, res) => {
    const totalLinks = db.prepare("SELECT COUNT(*) as count FROM links WHERE user_id = 1").get() as any;
    const totalBookings = db.prepare(`
      SELECT COUNT(*) as count FROM bookings b
      JOIN links l ON b.link_id = l.id
      WHERE l.user_id = 1
    `).get() as any;
    const totalSubmissions = db.prepare(`
      SELECT COUNT(*) as count FROM submissions s
      JOIN links l ON s.link_id = l.id
      WHERE l.user_id = 1
    `).get() as any;

    res.json({
      links: totalLinks.count,
      bookings: totalBookings.count,
      submissions: totalSubmissions.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
