import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, Users, Video, Copy } from "lucide-react";
import { CreateClassModal } from "@/components/CreateClassModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Class, User } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface TeacherDashboardProps {
  user: User;
  onJoinClass: (classId: string) => void;
}

export const TeacherDashboard = ({ user, onJoinClass }: TeacherDashboardProps) => {
  const [classes, setClasses] = useLocalStorage<Class[]>("classes", []);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  const teacherClasses = classes.filter(cls => cls.teacher === user.id);

  const handleCreateClass = (classData: Omit<Class, 'id' | 'teacher' | 'active' | 'students'>) => {
    const newClass: Class = {
      ...classData,
      id: Math.random().toString(36).substring(2, 8).toUpperCase(),
      teacher: user.id,
      active: false,
      students: []
    };

    setClasses([...classes, newClass]);
    setIsCreateModalOpen(false);
    
    toast({
      title: "Class Created Successfully!",
      description: `Class code: ${newClass.id}`,
    });
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Class code copied!",
      description: "Share this code with your students",
    });
  };

  const startClass = (classId: string) => {
    const updatedClasses = classes.map(cls =>
      cls.id === classId ? { ...cls, active: true } : cls
    );
    setClasses(updatedClasses);
    onJoinClass(classId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">Manage your classes and connect with students</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Card className="bg-gradient-primary text-white border-0 shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Total Classes</p>
                    <p className="text-2xl font-bold">{teacherClasses.length}</p>
                  </div>
                  <Video className="w-8 h-8 text-white/80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Card className="bg-gradient-success text-white border-0 shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Active Classes</p>
                    <p className="text-2xl font-bold">
                      {teacherClasses.filter(cls => cls.active).length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-white/80" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Students</p>
                    <p className="text-2xl font-bold text-foreground">
                      {teacherClasses.reduce((acc, cls) => acc + cls.students.length, 0)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Classes Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Classes</h2>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="hero"
              size="lg"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Class
            </Button>
          </motion.div>
        </div>

        {/* Classes Grid */}
        {teacherClasses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No classes yet</h3>
            <p className="text-muted-foreground mb-6">Create your first class to get started</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="default"
              size="lg"
            >
              Create Your First Class
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {teacherClasses.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="shadow-card border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-1">{classItem.subject}</CardTitle>
                        <CardDescription>Class Code: {classItem.id}</CardDescription>
                      </div>
                      <Badge
                        variant={classItem.active ? "default" : "secondary"}
                        className={classItem.active ? "bg-live text-live-foreground animate-pulse" : ""}
                      >
                        {classItem.active ? "Live" : "Scheduled"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {classItem.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {classItem.time}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">
                        {classItem.students.length} students joined
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyClassCode(classItem.id)}
                        className="flex-1"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Code
                      </Button>
                      <Button
                        variant={classItem.active ? "live" : "success"}
                        size="sm"
                        onClick={() => startClass(classItem.id)}
                        className="flex-1"
                      >
                        {classItem.active ? "Join Live" : "Start Class"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Create Class Modal */}
        <CreateClassModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateClass={handleCreateClass}
        />
      </div>
    </div>
  );
};