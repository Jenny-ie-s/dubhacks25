import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { PlusCircle, ChevronDown, ChevronUp } from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: "proposal" | "in-progress" | "done";
  fundingStatus: "funded" | "waiting";
  currentStage: string;
  update: string;
}

export function HomePage({ onCreateProposal }: { onCreateProposal: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Community Garden Project",
      status: "in-progress",
      fundingStatus: "funded",
      currentStage: "Stage 2: Planting Phase",
      update: "We've successfully prepared the soil and are ready to begin planting next week."
    },
    {
      id: "2",
      title: "Community Garden Project",
      status: "in-progress",
      fundingStatus: "waiting",
      currentStage: "Stage 3: Development",
      update: "We've successfully prepared the soil and are ready to begin planting next week."
    },
    {
      id: "3",
      title: "Community Garden Project",
      status: "proposal",
      fundingStatus: "waiting",
      currentStage: "Proposal Review",
      update: "We've successfully prepared the soil and are ready to begin planting next week."
    }
  ]);

  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState<string>("");

  const handleUpdateSubmit = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, update: updateText } : task
    ));
    setEditingTask(null);
    setUpdateText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[#78350f]">My Tasks</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                onClick={onCreateProposal}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Submit for Funding
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className="p-5 border-2 border-[#78350f]/20 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-[#78350f] mb-2">{task.title}</h3>
                  <div className="flex gap-2 mb-2">
                    <Badge 
                      className={
                        task.fundingStatus === "funded" 
                          ? "bg-green-500 text-white" 
                          : "bg-yellow-100 text-[#78350f] border border-[#78350f]/30"
                      }
                    >
                      {task.fundingStatus === "funded" ? "Funded" : "Waiting for Fund"}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className="border-[#78350f]/30 text-[#78350f]"
                    >
                      {task.status === "proposal" ? "Proposal" : task.status === "in-progress" ? "In Progress" : "Done"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#78350f]/70">{task.currentStage}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className="text-[#78350f]"
                >
                  {expandedTask === task.id ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </div>

              {expandedTask === task.id && (
                <div className="mt-4 pt-4 border-t border-[#78350f]/10">
                  {editingTask === task.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        placeholder="Write your status update here..."
                        className="min-h-[100px] border-[#78350f]/30 focus:border-green-500"
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleUpdateSubmit(task.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          Save Update
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setEditingTask(null);
                            setUpdateText("");
                          }}
                          className="border-[#78350f]/30 text-[#78350f]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-[#78350f]/80">Latest Update:</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTask(task.id);
                            setUpdateText(task.update);
                          }}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Update Status
                        </Button>
                      </div>
                      <p className="text-[#78350f] bg-yellow-50 p-3 rounded-lg">{task.update}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#78350f]/60 mb-4">You don't have any tasks yet</p>
            <Button 
              onClick={onCreateProposal}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Create Your First Proposal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
