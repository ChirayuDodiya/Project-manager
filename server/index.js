import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './src/app.js';

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join:project', (projectSlug) => {
    socket.join(`project:${projectSlug}`);
    console.log(`Socket ${socket.id} joined project room: project:${projectSlug}`);
  });

  socket.on('leave:project', (projectSlug) => {
    socket.leave(`project:${projectSlug}`);
    console.log(`Socket ${socket.id} left project room: project:${projectSlug}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
