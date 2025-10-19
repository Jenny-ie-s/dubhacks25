import { useState } from "react";
import { ProfilePage } from "./components/ProfilePage";
import { CommunityFeed } from "./components/CommunityFeed";
import { ProposalPage } from "./components/ProposalPage";
import { PaymentPage } from "./components/PaymentPage";
import { EditProjectPage } from "./components/EditProjectPage";
import { CollectionPage } from "./components/CollectionPage";
import { Button } from "./components/ui/button";
import { Home, User, CopyPlus, Award } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

type Page = "community" | "profile" | "proposal" | "payment" | "edit-project" | "collection";

interface FundingProject {
  id: string;
  author: string;
  avatar: string;
  projectTitle: string;
  stage: string;
  fundingGoal: number;
  currentFunding: number;
}

interface Project {
  id: string;
  title: string;
  overview: string;
  stages: Array<{
    id: string;
    name: string;
    description: string;
    fundingAmount: number;
    status: "pending" | "in-progress" | "completed";
  }>;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("community");
  const [selectedProject, setSelectedProject] = useState<FundingProject | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Mock project data
  const mockProjects: Record<string, Project> = {
    "1": {
      id: "1",
      title: "Community Garden Project",
      overview: "Creating a sustainable community garden to promote local food production and environmental awareness.",
      stages: [
        { id: "s1", name: "Site Preparation", description: "Clear and prepare the land", fundingAmount: 3000, status: "completed" },
        { id: "s2", name: "Planting Phase", description: "Plant initial crops and trees", fundingAmount: 2500, status: "in-progress" },
        { id: "s3", name: "Maintenance Setup", description: "Set up irrigation and maintenance schedule", fundingAmount: 2000, status: "pending" }
      ]
    },
    "2": {
      id: "2",
      title: "Mobile App for Local Artisans",
      overview: "Building a mobile marketplace to connect local artisans with customers.",
      stages: [
        { id: "s1", name: "Design & Planning", description: "UI/UX design and technical planning", fundingAmount: 4000, status: "completed" },
        { id: "s2", name: "Development", description: "Build the mobile application", fundingAmount: 8000, status: "in-progress" },
        { id: "s3", name: "Testing & Launch", description: "Beta testing and official launch", fundingAmount: 3000, status: "pending" }
      ]
    }
  };

  const handleFundProject = (project: FundingProject) => {
    setSelectedProject(project);
    setCurrentPage("payment");
  };

  const handlePaymentComplete = () => {
    setCurrentPage("community");
    setSelectedProject(null);
  };

  const handleEditProject = (taskId: string) => {
    const project = mockProjects[taskId];
    if (project) {
      setEditingProject(project);
      setCurrentPage("edit-project");
    }
  };

  const handleSaveProject = (project: Project) => {
    // In a real app, this would save to a database
    console.log("Saving project:", project);
    setCurrentPage("profile");
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      {currentPage !== "payment" && currentPage !== "edit-project" && (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b-2 border-[#78350f]/20 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[#78350f]">FundFlow</h2>
              <div className="flex gap-2">
                <Button
                  variant={currentPage === "community" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("community")}
                  className={
                    currentPage === "community" 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "text-[#78350f]/70 hover:text-[#78350f] hover:bg-yellow-50"
                  }
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button
                  variant={currentPage === "profile" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("profile")}
                  className={
                    currentPage === "profile" 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "text-[#78350f]/70 hover:text-[#78350f] hover:bg-yellow-50"
                  }
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
                <Button
                  variant={currentPage === "collection" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("collection")}
                  className={
                    currentPage === "collection" 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "text-[#78350f]/70 hover:text-[#78350f] hover:bg-yellow-50"
                  }
                >
                  <Award className="mr-2 h-4 w-4" />
                  Collection
                </Button>
                <Button
                  variant={currentPage === "proposal" ? "default" : "ghost"}
                  onClick={() => setCurrentPage("proposal")}
                  className={
                    currentPage === "proposal" 
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "text-[#78350f]/70 hover:text-[#78350f] hover:bg-yellow-50"
                  }
                >
                  <CopyPlus className="mr-2 h-5 w-5" />
                  Create
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className={currentPage !== "payment" && currentPage !== "edit-project" ? "pt-16" : ""}>
        {currentPage === "community" && (
          <CommunityFeed onFundProject={handleFundProject} />
        )}
        {currentPage === "profile" && (
          <ProfilePage 
            onCreateProposal={() => setCurrentPage("proposal")}
            onEditProject={handleEditProject}
          />
        )}
        {currentPage === "collection" && <CollectionPage />}
        {currentPage === "proposal" && (
          <ProposalPage onBack={() => setCurrentPage("profile")} />
        )}
        {currentPage === "payment" && selectedProject && (
          <PaymentPage 
            project={selectedProject}
            onBack={() => setCurrentPage("community")}
            onComplete={handlePaymentComplete}
          />
        )}
        {currentPage === "edit-project" && editingProject && (
          <EditProjectPage
            project={editingProject}
            onBack={() => setCurrentPage("profile")}
            onSave={handleSaveProject}
          />
        )}
      </div>

      <Toaster position="top-center" />
    </div>
  );
}