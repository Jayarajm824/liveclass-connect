import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  Users, 
  Clock, 
  CheckCircle,
  PlayCircle,
  StopCircle,
  Calendar,
  Book
} from "lucide-react";
import { StudentTile } from "@/components/StudentTile";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Class, User } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ClassroomProps {
  user: User;
  classId: string;
  onLeaveClass: () => void;
}

export const Classroom = ({ user, classId, onLeaveClass }: ClassroomProps) => {
  const [classes, setClasses] = useLocalStorage<Class[]>("classes", []);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [attendanceStarted, setAttendanceStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  const currentClass = classes.find(cls => cls.id === classId);
  const isTeacher = user.role === 'teacher';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentClass?.active && !attendanceStarted) {
      setAttendanceStarted(true);
      if (!isTeacher) {
        toast({
          title: "✅ Attendance Marked!",
          description: `You joined at ${new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}`,
        });
      }
    }
  }, [currentClass?.active, attendanceStarted, isTeacher, toast]);

  const toggleAttendance = () => {
    if (!currentClass) return;

    const updatedClasses = classes.map(cls =>
      cls.id === classId ? { ...cls, active: !cls.active } : cls
    );
    setClasses(updatedClasses);

    if (!currentClass.active) {
      toast({
        title: "Attendance Started!",
        description: "Students can now join and attendance will be tracked",
      });
    } else {
      toast({
        title: "Attendance Ended",
        description: "Class session has been closed",
      });
    }
  };

  if (!currentClass) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Class not found</h1>
          <p className="text-muted-foreground mb-4">The class you're looking for doesn't exist.</p>
          <Button onClick={onLeaveClass}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-classroom">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border-b border-border p-4 shadow-card"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Book className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                {currentClass.subject}
                {currentClass.active && (
                  <Badge variant="default" className="bg-live text-live-foreground animate-pulse">
                    Live
                  </Badge>
                )}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {currentClass.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {currentClass.time}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {currentClass.students.length} students
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <p className="text-sm font-medium text-foreground">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
              <p className="text-xs text-muted-foreground">Current Time</p>
            </div>
            
            {isTeacher && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={toggleAttendance}
                  variant={currentClass.active ? "destructive" : "live"}
                  className="gap-2"
                >
                  {currentClass.active ? (
                    <>
                      <StopCircle className="w-4 h-4" />
                      End Class
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      Start Class
                    </>
                  )}
                </Button>
              </motion.div>
            )}
            
            <Button variant="outline" onClick={onLeaveClass}>
              Leave
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-3">
            {/* Teacher's View or Main Student */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Card className="overflow-hidden shadow-card">
                <div className="relative bg-gradient-to-br from-muted to-muted/50 aspect-video flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  
                  {/* User info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-white font-medium">{user.name} (You)</span>
                      {isTeacher && <Badge className="bg-success text-success-foreground">Teacher</Badge>}
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isMuted 
                            ? 'bg-destructive text-destructive-foreground' 
                            : 'bg-success text-success-foreground'
                        }`}
                      >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsVideoOff(!isVideoOff)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isVideoOff 
                            ? 'bg-destructive text-destructive-foreground' 
                            : 'bg-success text-success-foreground'
                        }`}
                      >
                        {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Students Grid */}
            {currentClass.students.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Students ({currentClass.students.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {currentClass.students.map((student, index) => (
                    <StudentTile 
                      key={student.id} 
                      student={student} 
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {currentClass.students.length === 0 && currentClass.active && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Waiting for students...</h3>
                <p className="text-muted-foreground">Share the class code: <strong>{classId}</strong></p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Class Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Class Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Class Code</p>
                    <p className="font-mono text-lg font-bold text-foreground">{classId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={currentClass.active ? "default" : "secondary"}>
                      {currentClass.active ? "Live Session" : "Scheduled"}
                    </Badge>
                  </div>
                  {currentClass.active && !isTeacher && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                      className="flex items-center gap-2 p-3 bg-success/10 rounded-lg border border-success/20"
                    >
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-success font-medium">Attendance Marked</span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Attendance Summary (Teacher only) */}
            {isTeacher && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {currentClass.students.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No students have joined yet</p>
                      ) : (
                        currentClass.students.map((student) => (
                          <div key={student.id} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-muted-foreground">{student.joinedAt}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};