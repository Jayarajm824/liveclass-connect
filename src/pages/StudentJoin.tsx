import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Video, AlertCircle } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Class, User } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface StudentJoinProps {
  user: User;
  onJoinClass: (classId: string) => void;
}

export const StudentJoin = ({ user, onJoinClass }: StudentJoinProps) => {
  const [classes, setClasses] = useLocalStorage<Class[]>("classes", []);
  const [classCode, setClassCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);
    setError("");

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const targetClass = classes.find(cls => cls.id === classCode.toUpperCase());

    if (!targetClass) {
      setError("Invalid class code. Please check and try again.");
      setIsJoining(false);
      return;
    }

    // Check if student already joined
    const isAlreadyJoined = targetClass.students.some(student => student.id === user.id);
    
    if (!isAlreadyJoined) {
      // Add student to class
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const updatedClasses = classes.map(cls =>
        cls.id === classCode.toUpperCase()
          ? {
              ...cls,
              students: [
                ...cls.students,
                {
                  id: user.id,
                  name: user.name,
                  joinedAt: currentTime
                }
              ]
            }
          : cls
      );

      setClasses(updatedClasses);
      
      toast({
        title: "Successfully joined class!",
        description: `Welcome to ${targetClass.subject}`,
      });
    }

    onJoinClass(classCode.toUpperCase());
    setIsJoining(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-button"
            whileHover={{ scale: 1.05, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Video className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Join Classroom</h1>
          <p className="text-muted-foreground mt-2">Enter your class code to join the session</p>
        </motion.div>

        {/* Join Form */}
        <Card className="shadow-modal border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>Welcome, {user.name}!</CardTitle>
            <CardDescription>Ready to join your virtual classroom?</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onSubmit={handleJoinClass}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="classCode">Class Code</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="classCode"
                    value={classCode}
                    onChange={(e) => {
                      setClassCode(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter 6-digit class code"
                    required
                    className="pl-10 text-center font-mono text-lg tracking-widest uppercase"
                    maxLength={6}
                  />
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 text-destructive text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
              </div>

              <motion.div
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isJoining || classCode.length !== 6}
                >
                  {isJoining ? "Joining..." : "Join Classroom"}
                </Button>
              </motion.div>
            </motion.form>
          </CardContent>
        </Card>

        {/* Demo Codes */}
        <motion.div
          className="mt-6 p-4 bg-muted/50 rounded-lg border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-sm font-medium text-foreground mb-2">Demo Class Codes:</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>• Try creating a class as teacher first</p>
            <p>• Then use the generated code to join</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};