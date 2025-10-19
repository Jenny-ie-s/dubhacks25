import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { PlusCircle, ChevronDown, ChevronUp, Award, Target, TrendingUp, Edit, Eye } from "lucide-react";
import React from "react";

interface Task {
  id: string;
  title: string;
  status: "proposal" | "in-progress" | "done";
  fundingStatus: "funded" | "waiting";
  currentStage: string;
  latestPostTitle: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: "award" | "target" | "trending";
  earned: boolean;
}

interface FundedProject {
  id: string;
  title: string;
  author: string;
  currentStage: string;
  fundingGoal: number;
  currentFunding: number;
  myContribution: number;
  status: "active" | "completed" | "pending";
}

export function ProfilePage({ onCreateProposal, onEditProject, onViewCommunity }: { 
  onCreateProposal: () => void;
  onEditProject: (taskId: string) => void;
  onViewCommunity: () => void;
}) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Community Garden Project",
      status: "in-progress",
      fundingStatus: "funded",
      currentStage: "Stage 2: Planting Phase",
      latestPostTitle: "We've successfully prepared the soil and are ready to begin planting next week."
    },
    {
      id: "2",
      title: "Community Garden Project",
      status: "in-progress",
      fundingStatus: "waiting",
      currentStage: "Stage 3: Development",
      latestPostTitle: "We've successfully prepared the soil and are ready to begin planting next week."
    },
    {
      id: "3",
      title: "Community Garden Project",
      status: "proposal",
      fundingStatus: "waiting",
      currentStage: "Proposal Review",
      latestPostTitle: "We've successfully prepared the soil and are ready to begin planting next week."
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Proposal",
      description: "Created your first project proposal",
      icon: "award",
      earned: true
    },
    {
      id: "2",
      title: "Funded Founder",
      description: "Successfully funded a project stage",
      icon: "trending",
      earned: true
    },
    {
      id: "3",
      title: "Goal Achiever",
      description: "Complete a project from start to finish",
      icon: "target",
      earned: false
    }
  ]);

  const [fundedProjects] = useState<FundedProject[]>([
    {
      id: "f1",
      title: "Community Garden Project",
      author: "Marcus Johnson",
      currentStage: "Stage 2: Equipment Purchase",
      fundingGoal: 8000,
      currentFunding: 4500,
      myContribution: 100,
      status: "active"
    },
    {
      id: "f2",
      title: "Community Garden Project",
      author: "Elena Rodriguez",
      currentStage: "Stage 3: Equipment Installation",
      fundingGoal: 12000,
      currentFunding: 10800,
      myContribution: 250,
      status: "active"
    },
    {
      id: "f3",
      title: "Community Garden Project",
      author: "Alex Thompson",
      currentStage: "Final Stage: Completed",
      fundingGoal: 5000,
      currentFunding: 5000,
      myContribution: 75,
      status: "completed"
    }
  ]);

  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState<string>("");

  const handleUpdateSubmit = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, latestPostTitle: updateText } : task
    ));
    setEditingTask(null);
    setUpdateText("");
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case "award":
        return <Award className="h-6 w-6" />;
      case "target":
        return <Target className="h-6 w-6" />;
      case "trending":
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Award className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="p-6 sm:p-8 mb-6 border-2 border-[#78350f]/20 bg-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-green-500">
              <AvatarFallback className="bg-green-500 text-white text-2xl sm:text-3xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left w-full">
              <h2 className="text-[#78350f] mb-2">Jane Doe</h2>
              <p className="text-[#78350f]/70 mb-4">Community Builder & Project Creator</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-green-600">3</p>
                  <p className="text-sm text-[#78350f]/60">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-green-600">$18,200</p>
                  <p className="text-sm text-[#78350f]/60">Total Funded</p>
                </div>
                <div className="text-center">
                  <p className="text-green-600">2</p>
                  <p className="text-sm text-[#78350f]/60">Achievements</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Achievements Section */}
        <div className="mb-8">
          <h3 className="text-[#78350f] mb-4">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-4 border-2 transition-all ${
                  achievement.earned
                    ? "border-green-500 bg-green-50"
                    : "border-[#78350f]/20 bg-gray-50 opacity-60"
                }`}
              >
                <div className={`flex items-center gap-3 mb-2 ${
                  achievement.earned ? "text-green-600" : "text-[#78350f]/40"
                }`}>
                  {getAchievementIcon(achievement.icon)}
                  <h4 className={achievement.earned ? "text-[#78350f]" : "text-[#78350f]/40"}>
                    {achievement.title}
                  </h4>
                </div>
                <p className={`text-sm ${
                  achievement.earned ? "text-[#78350f]/70" : "text-[#78350f]/40"
                }`}>
                  {achievement.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* My Tasks Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h3 className="text-[#78350f] text-lg font-semibold mb-3">My Tasks</h3>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className="p-5 border-2 border-[#78350f]/20 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-[#78350f] mb-2">{task.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
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
                    className="text-[#78350f] ml-2"
                  >
                    {expandedTask === task.id ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProject(task.id)}
                  className="border-green-500 text-green-600 hover:bg-green-50 w-full sm:w-auto"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </Button>
              </div>

              {expandedTask === task.id && (
                <div className="mt-4 pt-4 border-t border-[#78350f]/10">
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg border border-[#78350f]/10">
                      <p className="text-sm text-[#78350f]/70 mb-1">Current Stage:</p>
                      <p className="text-[#78350f]">{task.currentStage}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-500/20">
                      <p className="text-sm text-[#78350f]/70 mb-1">Latest Post:</p>
                      <p className="text-[#78350f]">{task.latestPostTitle}</p>
                    </div>
                  </div>
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

        {/* My Funded Projects Section */}
        <div className="flex flex-col gap-3 mb-6">
          <h3 className="text-[#78350f] text-lg font-semibold">My Funded Projects</h3>
          <div className="space-y-4">
            {fundedProjects.map((project) => {
              const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
              
              return (
                <Card 
                  key={project.id} 
                  className="p-5 border-2 border-[#78350f]/20 bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1">
                        <h4 className="text-[#78350f] mb-1">{project.title}</h4>
                        <p className="text-sm text-[#78350f]/60 mb-2">by {project.author}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge 
                            className={
                              project.status === "completed"
                                ? "bg-green-500 text-white"
                                : project.status === "active"
                                ? "bg-yellow-100 text-[#78350f] border border-[#78350f]/30"
                                : "bg-gray-100 text-[#78350f]/60"
                            }
                          >
                            {project.status === "completed" ? "✓ Completed" : project.status === "active" ? "Active" : "Pending"}
                          </Badge>
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            You contributed ${project.myContribution}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#78350f]/70">{project.currentStage}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onViewCommunity}
                        className="border-green-500 text-green-600 hover:bg-green-50 w-auto"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        See Posts
                      </Button>
                    </div>

                    {/* Funding Progress */}
                    <div className="bg-yellow-50 p-3 rounded-lg border border-[#78350f]/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-[#78350f]/70">Funding Progress</span>
                        <span className="text-sm text-[#78350f]">
                          ${project.currentFunding.toLocaleString()} / ${project.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={fundingPercentage} className="h-2 bg-white">
                        <div 
                          className="h-full bg-green-500 transition-all" 
                          style={{ width: `${fundingPercentage}%` }}
                        />
                      </Progress>
                      <p className="text-xs text-[#78350f]/70 mt-1">{fundingPercentage.toFixed(0)}% funded</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {fundedProjects.length === 0 && (
            <div className="text-center py-12 bg-white border-2 border-dashed border-[#78350f]/20 rounded-lg">
              <div className="mb-4 text-6xl opacity-30">💰</div>
              <p className="text-[#78350f]/60 mb-4">You haven't funded any projects yet</p>
              <Button 
                onClick={onViewCommunity}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Explore Projects to Fund
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}