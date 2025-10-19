import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Heart, MessageCircle, Share2, DollarSign } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FundingPost {
  id: string;
  author: string;
  avatar: string;
  projectTitle: string;
  stage: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  image: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export function CommunityFeed({ onFundProject }: { onFundProject: (post: FundingPost) => void }) {
  const [posts] = useState<FundingPost[]>([
    {
      id: "1",
      author: "Sarah Chen",
      avatar: "SC",
      projectTitle: "Urban Bee Sanctuary",
      stage: "Stage 1: Land Preparation",
      description: "We're creating a safe haven for urban pollinators. This stage involves preparing the rooftop space and installing bee-friendly plants. We need community support to make this green initiative happen!",
      fundingGoal: 5000,
      currentFunding: 3200,
      image: "nature environment",
      likes: 42,
      comments: 8,
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      author: "Marcus Johnson",
      avatar: "MJ",
      projectTitle: "Youth Coding Bootcamp",
      stage: "Stage 2: Equipment Purchase",
      description: "Teaching underprivileged kids to code. We've completed the curriculum development and now need laptops and software licenses for 30 students. Your support changes lives!",
      fundingGoal: 8000,
      currentFunding: 4500,
      image: "education technology",
      likes: 67,
      comments: 15,
      timestamp: "5 hours ago"
    },
    {
      id: "3",
      author: "Elena Rodriguez",
      avatar: "ER",
      projectTitle: "Community Kitchen Initiative",
      stage: "Stage 3: Equipment Installation",
      description: "Building a space where community members can cook together and learn from each other. We're at the final stage - installing professional kitchen equipment. Almost there!",
      fundingGoal: 12000,
      currentFunding: 10800,
      image: "cooking kitchen",
      likes: 89,
      comments: 23,
      timestamp: "1 day ago"
    },
    {
      id: "4",
      author: "David Kim",
      avatar: "DK",
      projectTitle: "Solar Community Center",
      stage: "Stage 1: Design & Planning",
      description: "Bringing clean energy to our community center. This first stage covers architectural design and solar panel selection. Help us build a sustainable future!",
      fundingGoal: 15000,
      currentFunding: 8200,
      image: "solar energy",
      likes: 54,
      comments: 12,
      timestamp: "2 days ago"
    },
    {
      id: "5",
      author: "Amara Okafor",
      avatar: "AO",
      projectTitle: "Local Artists Market",
      stage: "Stage 2: Booth Construction",
      description: "Creating a permanent space for local artisans to showcase their work. We're building weather-resistant booths and setting up the infrastructure. Join us in supporting local art!",
      fundingGoal: 6500,
      currentFunding: 6100,
      image: "art market",
      likes: 78,
      comments: 19,
      timestamp: "3 days ago"
    }
  ]);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-[#78350f] mb-6">Community Feed</h1>
        
        <div className="space-y-6">
          {posts.map((post) => {
            const fundingPercentage = (post.currentFunding / post.fundingGoal) * 100;
            
            return (
              <Card key={post.id} className="overflow-hidden border-2 border-[#78350f]/20 shadow-lg">
                {/* Post Header */}
                <div className="p-4 bg-white border-b border-[#78350f]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-green-500">
                        <AvatarFallback className="bg-green-500 text-white">
                          {post.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-[#78350f]">{post.author}</h4>
                        <p className="text-sm text-[#78350f]/60">{post.timestamp}</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-[#78350f] border border-[#78350f]/30">
                      {post.stage}
                    </Badge>
                  </div>
                </div>

                {/* Post Image */}
                <div className="relative bg-[#78350f]/5">
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80`}
                    alt={post.projectTitle}
                    className="w-full h-64 object-cover"
                  />
                </div>

                {/* Post Content */}
                <div className="p-5 bg-white">
                  <h2 className="text-[#78350f] mb-3">{post.projectTitle}</h2>
                  <p className="text-[#78350f]/80 mb-4">{post.description}</p>

                  {/* Funding Progress */}
                  <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-[#78350f]/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#78350f]/70">Funding Progress</span>
                      <span className="text-[#78350f]">
                        ${post.currentFunding.toLocaleString()} / ${post.fundingGoal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={fundingPercentage} className="h-2 bg-white">
                      <div 
                        className="h-full bg-green-500 transition-all" 
                        style={{ width: `${fundingPercentage}%` }}
                      />
                    </Progress>
                    <p className="text-sm text-[#78350f]/70 mt-1">{fundingPercentage.toFixed(0)}% funded</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#78350f]/10">
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={likedPosts.has(post.id) ? "text-green-600" : "text-[#78350f]/60"}
                      >
                        <Heart className={`mr-2 h-5 w-5 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#78350f]/60">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#78350f]/60">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button 
                      onClick={() => onFundProject(post)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Fund This Stage
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}