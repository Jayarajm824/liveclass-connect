import { motion } from "framer-motion";
import { User, Mic, Video } from "lucide-react";
import type { Student } from "@/types";

interface StudentTileProps {
  student: Student;
  index?: number;
}

export const StudentTile = ({ student, index = 0 }: StudentTileProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        duration: 0.4, 
        type: "spring",
        delay: index * 0.1 
      }}
      className="relative bg-classroom border border-border rounded-lg overflow-hidden aspect-video shadow-card"
    >
      {/* Video placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
        </div>
      </div>

      {/* Student info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium text-sm">{student.name}</p>
            <p className="text-white/70 text-xs">Joined at {student.joinedAt}</p>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-success/80 rounded-full flex items-center justify-center">
              <Mic className="w-3 h-3 text-white" />
            </div>
            <div className="w-6 h-6 bg-success/80 rounded-full flex items-center justify-center">
              <Video className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Join animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 0] }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute inset-0 bg-success/20 rounded-lg flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-success text-2xl font-bold"
        >
          ✓
        </motion.div>
      </motion.div>
    </motion.div>
  );
};