import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { PlusCircle, Trash2, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ProjectStage {
  id: string;
  name: string;
  description: string;
  fundingAmount: number;
  status: "pending" | "in-progress" | "completed";
}

interface Project {
  id: string;
  title: string;
  overview: string;
  stages: ProjectStage[];
}

interface EditProjectPageProps {
  project: Project;
  onBack: () => void;
  onSave: (project: Project) => void;
}

export function EditProjectPage({ project, onBack, onSave }: EditProjectPageProps) {
  const [editedProject, setEditedProject] = useState<Project>(project);
  const [stageToComplete, setStageToComplete] = useState<string | null>(null);

  const updateProjectField = (field: "title" | "overview", value: string) => {
    setEditedProject({ ...editedProject, [field]: value });
  };

  const addStage = () => {
    const newStage: ProjectStage = {
      id: Date.now().toString(),
      name: "",
      description: "",
      fundingAmount: 0,
      status: "pending"
    };
    setEditedProject({
      ...editedProject,
      stages: [...editedProject.stages, newStage]
    });
  };

  const removeStage = (id: string) => {
    if (editedProject.stages.length > 1) {
      const stage = editedProject.stages.find(s => s.id === id);
      if (stage?.status === "completed") {
        toast.error("Cannot delete a completed stage");
        return;
      }
      setEditedProject({
        ...editedProject,
        stages: editedProject.stages.filter(stage => stage.id !== id)
      });
    }
  };

  const updateStage = (id: string, field: keyof ProjectStage, value: string | number) => {
    setEditedProject({
      ...editedProject,
      stages: editedProject.stages.map(stage =>
        stage.id === id ? { ...stage, [field]: value } : stage
      )
    });
  };

  const handleMarkAsCompleted = (stageId: string) => {
    setStageToComplete(stageId);
  };

  const confirmMarkAsCompleted = () => {
    if (stageToComplete) {
      setEditedProject({
        ...editedProject,
        stages: editedProject.stages.map(stage =>
          stage.id === stageToComplete ? { ...stage, status: "completed" } : stage
        )
      });
      toast.success("Stage marked as completed");
      setStageToComplete(null);
    }
  };

  const handleSave = () => {
    if (!editedProject.title || !editedProject.overview) {
      toast.error("Please fill in all required fields");
      return;
    }

    const invalidStage = editedProject.stages.find(
      s => !s.name || !s.description || s.fundingAmount <= 0
    );
    if (invalidStage) {
      toast.error("Please complete all stage details");
      return;
    }

    onSave(editedProject);
    toast.success("Project updated! Changes will be posted to the community feed.");
  };

  const totalFunding = editedProject.stages.reduce((sum, stage) => sum + Number(stage.fundingAmount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-2 text-[#78350f] hover:bg-yellow-100 -ml-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
            <h1 className="text-[#78350f]">Edit Project</h1>
          </div>
        </div>

        {/* Basic Information */}
        <Card className="p-6 mb-6 border-2 border-[#78350f]/20 bg-white">
          <h3 className="text-[#78350f] mb-4">Project Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-[#78350f]">Project Title *</Label>
              <Input
                id="title"
                value={editedProject.title}
                onChange={(e) => updateProjectField("title", e.target.value)}
                placeholder="Enter your project title"
                className="mt-1 border-[#78350f]/30 focus:border-green-500"
              />
            </div>
            <div>
              <Label htmlFor="overview" className="text-[#78350f]">Project Overview *</Label>
              <Textarea
                id="overview"
                value={editedProject.overview}
                onChange={(e) => updateProjectField("overview", e.target.value)}
                placeholder="Describe your project vision and goals..."
                className="mt-1 min-h-[120px] border-[#78350f]/30 focus:border-green-500"
              />
            </div>
          </div>
        </Card>

        {/* Project Stages */}
        <Card className="p-6 mb-6 border-2 border-[#78350f]/20 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#78350f]">Project Stages</h3>
            <Button
              onClick={addStage}
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Stage
            </Button>
          </div>

          <div className="space-y-4">
            {editedProject.stages.map((stage, index) => (
              <div
                key={stage.id}
                className={`p-4 rounded-lg border-2 ${
                  stage.status === "completed"
                    ? "bg-green-50 border-green-500/30"
                    : "bg-yellow-50 border-[#78350f]/10"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[#78350f]">Stage {index + 1}</h4>
                    <Badge
                      className={
                        stage.status === "completed"
                          ? "bg-green-500 text-white"
                          : stage.status === "in-progress"
                          ? "bg-yellow-100 text-[#78350f] border border-[#78350f]/30"
                          : "bg-gray-200 text-[#78350f]/70"
                      }
                    >
                      {stage.status === "completed"
                        ? "Completed"
                        : stage.status === "in-progress"
                        ? "In Progress"
                        : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {stage.status !== "completed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsCompleted(stage.id)}
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Completed
                      </Button>
                    )}
                    {editedProject.stages.length > 1 && stage.status !== "completed" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStage(stage.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-[#78350f] text-sm">Stage Name *</Label>
                    <Input
                      value={stage.name}
                      onChange={(e) => updateStage(stage.id, "name", e.target.value)}
                      placeholder="e.g., Planning & Design"
                      className="mt-1 bg-white border-[#78350f]/30"
                      disabled={stage.status === "completed"}
                    />
                  </div>
                  <div>
                    <Label className="text-[#78350f] text-sm">Description *</Label>
                    <Textarea
                      value={stage.description}
                      onChange={(e) => updateStage(stage.id, "description", e.target.value)}
                      placeholder="Describe what will be accomplished in this stage..."
                      className="mt-1 bg-white border-[#78350f]/30"
                      disabled={stage.status === "completed"}
                    />
                  </div>
                  <div>
                    <Label className="text-[#78350f] text-sm">Funding Required ($) *</Label>
                    <Input
                      type="number"
                      value={stage.fundingAmount || ""}
                      onChange={(e) => updateStage(stage.id, "fundingAmount", Number(e.target.value))}
                      placeholder="0"
                      className="mt-1 bg-white border-[#78350f]/30"
                      disabled={stage.status === "completed"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Funding */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-500/30">
            <div className="flex justify-between items-center">
              <span className="text-[#78350f]">Total Funding Required:</span>
              <span className="text-green-600">${totalFunding.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Important Note */}
        <Card className="p-6 mb-6 border-2 border-yellow-500/30 bg-yellow-50">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[#78350f] mb-2">Note</h4>
              <p className="text-sm text-[#78350f]/80">
                Any changes to your project will be automatically posted to the community feed to keep your supporters updated.
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-[#78350f]/30 text-[#78350f]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Save Changes
          </Button>
        </div>

        {/* Confirmation Dialog for Completing Stage */}
        <AlertDialog open={stageToComplete !== null} onOpenChange={(open) => !open && setStageToComplete(null)}>
          <AlertDialogContent className="border-2 border-[#78350f]/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#78350f]">Mark Stage as Completed?</AlertDialogTitle>
              <AlertDialogDescription className="text-[#78350f]/70">
                Once you mark this stage as completed, you won't be able to edit it anymore. 
                This action will also unlock funding for the next stage and notify your supporters.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[#78350f]/30 text-[#78350f]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmMarkAsCompleted}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
