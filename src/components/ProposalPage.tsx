import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PlusCircle, Trash2, CheckCircle, Upload, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ProjectStage {
  id: string;
  name: string;
  description: string;
  fundingAmount: number;
}

interface UserProject {
  id: string;
  title: string;
  currentStage: string;
}

export function ProposalPage({ onBack }: { onBack: () => void }) {
  // Form type selection
  const [formType, setFormType] = useState<"propose" | "post">("propose");

  // Propose a project states
  const [proposalStatus, setProposalStatus] = useState<"proposal" | "in-progress" | "done">("proposal");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectOverview, setProjectOverview] = useState("");
  const [stages, setStages] = useState<ProjectStage[]>([
    { id: "1", name: "", description: "", fundingAmount: 0 }
  ]);

  // New post states
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [postStatus, setPostStatus] = useState<"need-fund" | "in-progress" | "completed">("need-fund");
  const [postContent, setPostContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Mock user projects
  const userProjects: UserProject[] = [
    { id: "1", title: "Community Garden Project", currentStage: "Stage 2: Planting Phase" },
    { id: "2", title: "Mobile App for Local Artisans", currentStage: "Stage 3: Development" },
    { id: "3", title: "Solar Panel Installation", currentStage: "Proposal Review" }
  ];

  const addStage = () => {
    const newStage: ProjectStage = {
      id: Date.now().toString(),
      name: "",
      description: "",
      fundingAmount: 0
    };
    setStages([...stages, newStage]);
  };

  const removeStage = (id: string) => {
    if (stages.length > 1) {
      setStages(stages.filter(stage => stage.id !== id));
    }
  };

  const updateStage = (id: string, field: keyof ProjectStage, value: string | number) => {
    setStages(stages.map(stage => 
      stage.id === id ? { ...stage, [field]: value } : stage
    ));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmitProposal = () => {
    if (!projectTitle || !projectOverview) {
      toast.error("Please fill in all required fields");
      return;
    }

    const invalidStage = stages.find(s => !s.name || !s.description || s.fundingAmount <= 0);
    if (invalidStage) {
      toast.error("Please complete all stage details");
      return;
    }

    toast.success("Proposal submitted successfully!");
    setProposalStatus("in-progress");
  };

  const handleSubmitPost = () => {
    if (!selectedProject) {
      toast.error("Please select a project");
      return;
    }

    if (!postContent) {
      toast.error("Please write your post content");
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least 1 image or video");
      return;
    }

    toast.success("Post submitted successfully!");
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const totalFunding = stages.reduce((sum, stage) => sum + Number(stage.fundingAmount), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#78350f]">Create New</h1>
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-[#78350f]/30 text-[#78350f]"
          >
            Back
          </Button>
        </div>

        {/* Form Type Selection */}
        <Card className="p-6 mb-6 border-2 border-[#78350f]/20 bg-white">
          <Label className="text-[#78350f] mb-2">What would you like to do?</Label>
          <Select value={formType} onValueChange={(value: "propose" | "post") => setFormType(value)}>
            <SelectTrigger className="border-[#78350f]/30 focus:border-green-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="propose">Propose a project</SelectItem>
              <SelectItem value="post">New Post</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Propose a Project Form */}
        {formType === "propose" && (
          <>
            {/* Basic Information */}
            <Card className="p-6 mb-6 border-2 border-[#78350f]/20 bg-white">
              <h3 className="text-[#78350f] mb-4">Project Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-[#78350f]">Project Title *</Label>
                  <Input
                    id="title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter your project title"
                    className="mt-1 border-[#78350f]/30 focus:border-green-500"
                    disabled={proposalStatus !== "proposal"}
                  />
                </div>
                <div>
                  <Label htmlFor="overview" className="text-[#78350f]">Project Overview *</Label>
                  <Textarea
                    id="overview"
                    value={projectOverview}
                    onChange={(e) => setProjectOverview(e.target.value)}
                    placeholder="Describe your project vision and goals..."
                    className="mt-1 min-h-[120px] border-[#78350f]/30 focus:border-green-500"
                    disabled={proposalStatus !== "proposal"}
                  />
                </div>
              </div>
            </Card>

            {/* Project Stages */}
            <Card className="p-6 mb-6 border-2 border-[#78350f]/20 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#78350f]">Project Stages</h3>
                {proposalStatus === "proposal" && (
                  <Button 
                    onClick={addStage}
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Stage
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div 
                    key={stage.id} 
                    className="p-4 bg-yellow-50 rounded-lg border border-[#78350f]/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-[#78350f]">Stage {index + 1}</h4>
                      {proposalStatus === "proposal" && stages.length > 1 && (
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
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-[#78350f] text-sm">Stage Name *</Label>
                        <Input
                          value={stage.name}
                          onChange={(e) => updateStage(stage.id, "name", e.target.value)}
                          placeholder="e.g., Planning & Design"
                          className="mt-1 bg-white border-[#78350f]/30"
                          disabled={proposalStatus !== "proposal"}
                        />
                      </div>
                      <div>
                        <Label className="text-[#78350f] text-sm">Description *</Label>
                        <Textarea
                          value={stage.description}
                          onChange={(e) => updateStage(stage.id, "description", e.target.value)}
                          placeholder="Describe what will be accomplished in this stage..."
                          className="mt-1 bg-white border-[#78350f]/30"
                          disabled={proposalStatus !== "proposal"}
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
                          disabled={proposalStatus !== "proposal"}
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

            {/* Submission Info */}
            <Card className="p-6 mb-6 border-2 border-green-500/30 bg-green-50">
              <div className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[#78350f] mb-2">Important Information</h4>
                  <ul className="text-sm text-[#78350f]/80 space-y-1 list-disc list-inside">
                    <li>You must post an update at each stage to unlock funding for the next stage</li>
                    <li>Community members will review and fund your project stages</li>
                    <li>Keep your updates detailed and transparent to maintain trust</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            {proposalStatus === "proposal" && (
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={onBack}
                  className="border-[#78350f]/30 text-[#78350f]"
                >
                  Save as Draft
                </Button>
                <Button 
                  onClick={handleSubmitProposal}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Submit Proposal
                </Button>
              </div>
            )}

            {proposalStatus === "in-progress" && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-[#78350f] mb-2">Proposal Submitted!</h3>
                <p className="text-[#78350f]/70 mb-4">
                  Your project is now live. Post updates regularly to unlock funding.
                </p>
                <Button 
                  onClick={onBack}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  View My Profile
                </Button>
              </div>
            )}
          </>
        )}

        {/* New Post Form */}
        {formType === "post" && (
          <>
            {/* Select Project */}
            <Card className="p-6 mb-6 border-2 border-[#78350f]/20 bg-white">
              <h3 className="text-[#78350f] mb-4">Select Project</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project" className="text-[#78350f]">Project *</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="mt-1 border-[#78350f]/30 focus:border-green-500">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {userProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedProject && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-[#78350f]/10">
                      <p className="text-sm text-[#78350f]/70 mb-1">Current Stage:</p>
                      <p className="text-[#78350f]">{userProjects.find(p => p.id === selectedProject)?.currentStage}</p>
                      <p className="text-xs text-[#78350f]/60 mt-2">
                        Note: You must complete the current stage before moving to the next stage
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="status" className="text-[#78350f]">Status *</Label>
                  <Select value={postStatus} onValueChange={(value: "need-fund" | "in-progress" | "completed") => setPostStatus(value)}>
                    <SelectTrigger className="mt-1 border-[#78350f]/30 focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="need-fund">Need Fund</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  {postStatus === "completed" && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Marking this stage as completed will unlock funding for the next stage
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Post Content */}
            <Card className="p-6 mb-6 border-2 border-[#78350f]/20 bg-white">
              <h3 className="text-[#78350f] mb-4">Post Content</h3>
              <div>
                <Label htmlFor="content" className="text-[#78350f]">Write your update *</Label>
                <Textarea
                  id="content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share updates about your project progress, challenges, achievements..."
                  className="mt-1 min-h-[150px] border-[#78350f]/30 focus:border-green-500"
                />
              </div>
            </Card>

            {/* Media Upload */}
            <Card className="p-6 mb-6 border-2 border-[#78350f]/20 bg-white">
              <h3 className="text-[#78350f] mb-4">Media Upload *</h3>
              <p className="text-sm text-[#78350f]/70 mb-4">Upload at least 1 image or video</p>
              
              <div className="space-y-4">
                <div className="border-2 border-dashed border-[#78350f]/30 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-10 w-10 text-[#78350f]/40" />
                    <p className="text-[#78350f]">Click to upload images or videos</p>
                    <p className="text-sm text-[#78350f]/60">PNG, JPG, MP4, MOV up to 50MB</p>
                  </label>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-yellow-50 rounded-lg border-2 border-[#78350f]/20 flex items-center justify-center overflow-hidden">
                          {file.type.startsWith("image/") ? (
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-4">
                              <p className="text-[#78350f] text-sm truncate">{file.name}</p>
                              <p className="text-xs text-[#78350f]/60">Video</p>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={onBack}
                className="border-[#78350f]/30 text-[#78350f]"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitPost}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Publish Post
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}