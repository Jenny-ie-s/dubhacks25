import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Gift, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

type BadgeTier = "bronze" | "silver" | "gold" | "special";
type BadgeCategory = "project" | "funding" | "community";
type CompanionTheme = "forest" | "ocean" | "air" | "sun" | "earth";

interface BadgeAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  category: BadgeCategory;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  required?: number;
  theme?: CompanionTheme; // For linking badges to companion themes
}

interface Companion {
  id: string;
  name: string;
  theme: CompanionTheme;
  emoji: string;
  stage: "baby" | "teen" | "adult";
  collectedDate?: string;
  evolutionProgress: number; // Number of badges earned in this theme
  unlocked: boolean;
}

export function CollectionPage() {
  const [badges, setBadges] = useState<BadgeAchievement[]>([
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first project',
      icon: '🌱',
      tier: 'bronze',
      category: 'project',
      earned: true,
      earnedDate: 'Oct 15, 2025'
    },
    {
      id: '2',
      name: 'Tree Hugger',
      description: 'Plant 3 trees',
      icon: '🌳',
      tier: 'silver',
      category: 'project',
      earned: true,
      earnedDate: 'Oct 17, 2025'
    },
    {
      id: '3',
      name: 'Forest Guardian',
      description: 'Plant 10 trees',
      icon: '🌲',
      tier: 'gold',
      category: 'project',
      earned: false,
      progress: 5,
      required: 10
    },
    {
      id: '4',
      name: 'Generous Soul',
      description: 'Fund your first project',
      icon: '💝',
      tier: 'bronze',
      category: 'funding',
      earned: true,
      earnedDate: 'Oct 16, 2025'
    },
    {
      id: '5',
      name: 'Philanthropist',
      description: 'Fund 5 projects',
      icon: '🎁',
      tier: 'silver',
      category: 'funding',
      earned: true,
      earnedDate: 'Oct 18, 2025'
    },
    {
      id: '6',
      name: 'Angel Investor',
      description: 'Fund 20 projects',
      icon: '👼',
      tier: 'gold',
      category: 'funding',
      earned: false,
      progress: 8,
      required: 20
    },
    {
      id: '7',
      name: 'Community Builder',
      description: 'Help 3 community projects',
      icon: '🏘️',
      tier: 'silver',
      category: 'community',
      earned: true,
      earnedDate: 'Oct 19, 2025'
    },
    {
      id: '8',
      name: 'Clean Streets',
      description: 'Participate in cleanup events',
      icon: '🧹',
      tier: 'bronze',
      category: 'project',
      earned: true,
      earnedDate: 'Oct 12, 2025'
    },
    {
      id: '9',
      name: 'Eco Warrior',
      description: 'Complete 5 environmental projects',
      icon: '♻️',
      tier: 'gold',
      category: 'project',
      earned: false,
      progress: 3,
      required: 5
    },
    {
      id: '10',
      name: 'Early Supporter',
      description: 'Join the community',
      icon: '⭐',
      tier: 'special',
      category: 'community',
      earned: true,
      earnedDate: 'Oct 10, 2025'
    },
    {
      id: '11',
      name: 'Helping Hand',
      description: 'Volunteer 10 hours',
      icon: '🤝',
      tier: 'bronze',
      category: 'community',
      earned: false,
      progress: 6,
      required: 10
    },
    {
      id: '12',
      name: 'Water Guardian',
      description: 'Support water conservation',
      icon: '💧',
      tier: 'silver',
      category: 'project',
      earned: false,
      progress: 1,
      required: 3
    }
  ]);

  const [companions, setCompanions] = useState<Companion[]>([
    {
      id: 'c1',
      name: 'Sprouty',
      theme: 'forest',
      emoji: '🌱',
      stage: 'baby',
      collectedDate: 'Oct 10, 2025',
      evolutionProgress: 2, // Already has some progress
      unlocked: true
    },
    {
      id: 'c2',
      name: 'Bubbly',
      theme: 'ocean',
      emoji: '💧',
      stage: 'baby',
      collectedDate: 'Oct 12, 2025',
      evolutionProgress: 4, // Ready to evolve!
      unlocked: true
    },
    {
      id: 'c3',
      name: 'Gusty',
      theme: 'air',
      emoji: '☁️',
      stage: 'teen',
      collectedDate: 'Oct 15, 2025',
      evolutionProgress: 1,
      unlocked: true
    },
    {
      id: 'c4',
      name: 'Sunny',
      theme: 'sun',
      emoji: '☀️',
      stage: 'baby',
      evolutionProgress: 0,
      unlocked: false
    },
    {
      id: 'c5',
      name: 'Rocky',
      theme: 'earth',
      emoji: '🪨',
      stage: 'baby',
      evolutionProgress: 0,
      unlocked: false
    }
  ]);

  const [gachaTokens, setGachaTokens] = useState(2);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [showCompanionModal, setShowCompanionModal] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;
  const progressToNextToken = 65; // Mock progress percentage

  const getBadgeIcon = (icon: string, earned: boolean) => {
    const iconClass = `h-8 w-8 ${earned ? "text-green-600" : "text-[#78350f]/30"}`;
    
    switch (icon) {
      case "🌱": return <Award className={iconClass} />;
      case "🌳": return <Target className={iconClass} />;
      case "🌲": return <TrendingUp className={iconClass} />;
      case "💝": return <Users className={iconClass} />;
      case "sparkles": return <Sparkles className={iconClass} />;
      case "🎁": return <Trophy className={iconClass} />;
      case "star": return <Star className={iconClass} />;
      case "zap": return <Zap className={iconClass} />;
      case "heart": return <Heart className={iconClass} />;
      case "leaf": return <Leaf className={iconClass} />;
      default: return <Award className={iconClass} />;
    }
  };

  const getTierColor = (tier: BadgeTier) => {
    switch (tier) {
      case "bronze": return "bg-amber-100 text-amber-700 border-amber-300";
      case "silver": return "bg-gray-100 text-gray-700 border-gray-300";
      case "gold": return "bg-yellow-100 text-yellow-700 border-yellow-400";
      case "special": return "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-300";
    }
  };

  const getStageEmoji = (stage: "baby" | "teen" | "adult") => {
    switch (stage) {
      case "baby": return "🌱";
      case "teen": return "🌿";
      case "adult": return "🌳";
    }
  };

  const handleCompanionClick = (companion: Companion) => {
    if (companion.unlocked) {
      setSelectedCompanion(companion);
      setShowCompanionModal(true);
    }
  };

  const handleEvolve = () => {
    if (selectedCompanion && selectedCompanion.stage !== "adult") {
      const requiredBadges = selectedCompanion.stage === "baby" ? 4 : 8;
      
      if (selectedCompanion.evolutionProgress >= requiredBadges) {
        const newStage = selectedCompanion.stage === "baby" ? "teen" : "adult";
        setCompanions(companions.map(c => 
          c.id === selectedCompanion.id 
            ? { ...c, stage: newStage, evolutionProgress: 0 }
            : c
        ));
        toast.success(`${selectedCompanion.name} evolved to ${newStage} stage! 🎉`);
        setShowCompanionModal(false);
      }
    }
  };

  const handlePullGacha = () => {
    if (gachaTokens > 0) {
      setIsPulling(true);
      setGachaTokens(gachaTokens - 1);
      
      setTimeout(() => {
        // Unlock a random locked companion
        const lockedCompanions = companions.filter(c => !c.unlocked);
        if (lockedCompanions.length > 0) {
          const randomIndex = Math.floor(Math.random() * lockedCompanions.length);
          const unlockedCompanion = lockedCompanions[randomIndex];
          
          setCompanions(companions.map(c => 
            c.id === unlockedCompanion.id ? { ...c, unlocked: true } : c
          ));
          toast.success(`You unlocked ${unlockedCompanion.name}!`);
        } else {
          toast.success("You received bonus progress on your companions!");
        }
        setIsPulling(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#78350f] mb-4">My Collection</h1>
          
          {/* Progress Card */}
          <Card className="p-6 border-2 border-green-500/30 bg-gradient-to-r from-green-50 to-yellow-50">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Badge Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#78350f]">Badge Progress</h3>
                  <div className="text-green-600">{earnedCount}/{totalCount}</div>
                </div>
                <Progress value={(earnedCount / totalCount) * 100} className="h-3 mb-2" />
                <p className="text-sm text-[#78350f]/70">{earnedCount} badges earned</p>
              </div>
              
              {/* Gacha Token Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#78350f]">Next Gacha Token</h3>
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-green-600" />
                    <span className="text-green-600">{gachaTokens}</span>
                  </div>
                </div>
                <Progress value={progressToNextToken} className="h-3 mb-2" />
                <p className="text-sm text-[#78350f]/70">
                  {100 - progressToNextToken}% until next token
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Badge Gallery */}
        <div className="mb-8">
          <h3 className="text-[#78350f] mb-4">Badge Gallery</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={badge.earned ? { scale: 1.05 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card
                  className={`p-5 border-2 transition-all cursor-pointer ${
                    badge.earned
                      ? "border-green-500 bg-gradient-to-br from-green-50 to-yellow-50 hover:shadow-lg"
                      : "border-[#78350f]/20 bg-gray-50 opacity-70"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`mb-3 text-6xl ${!badge.earned && "opacity-30 grayscale"}`}>
                      {badge.icon}
                    </div>
                    
                    <h4 className={`mb-2 ${
                      badge.earned ? "text-[#78350f]" : "text-[#78350f]/40"
                    }`}>
                      {badge.name}
                    </h4>
                    
                    <p className={`text-sm mb-3 ${
                      badge.earned ? "text-[#78350f]/70" : "text-[#78350f]/40"
                    }`}>
                      {badge.description}
                    </p>

                    <div className="flex flex-col gap-2 w-full">
                      <Badge className={getTierColor(badge.tier)}>
                        {badge.tier.charAt(0).toUpperCase() + badge.tier.slice(1)}
                      </Badge>
                      
                      {badge.earned ? (
                        <Badge className="bg-green-500 text-white">
                          Earned {badge.earnedDate}
                        </Badge>
                      ) : badge.progress !== undefined && badge.required !== undefined ? (
                        <Badge variant="outline" className="border-[#78350f]/30 text-[#78350f]/60">
                          Progress: {badge.progress}/{badge.required}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-[#78350f]/30 text-[#78350f]/60">
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gacha Section */}
        <div>
          <h3 className="text-[#78350f] mb-4">Gacha Rewards</h3>
          <Card className="p-6 border-2 border-[#78350f]/20 bg-white">
            <div className="mb-6">
              <p className="text-[#78350f]/70 mb-4">
                Collect companions and help them evolve as you complete projects! Use gacha tokens to unlock new companions.
              </p>
              
              {/* Companion Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {companions.map((companion) => (
                  <motion.div
                    key={companion.id}
                    whileHover={companion.unlocked ? { scale: 1.1 } : {}}
                    whileTap={companion.unlocked ? { scale: 0.95 } : {}}
                  >
                    <Card
                      onClick={() => handleCompanionClick(companion)}
                      className={`p-4 border-2 transition-all cursor-pointer ${
                        companion.unlocked
                          ? "border-green-500 bg-gradient-to-br from-green-50 to-yellow-50 hover:shadow-md"
                          : "border-[#78350f]/20 bg-gray-100"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`text-5xl mb-2 ${!companion.unlocked && "opacity-30 blur-sm"}`}>
                          {companion.unlocked ? companion.emoji : "❓"}
                        </div>
                        <p className={`text-sm ${
                          companion.unlocked ? "text-[#78350f]" : "text-[#78350f]/40"
                        }`}>
                          {companion.unlocked ? companion.name : "Locked"}
                        </p>
                        {companion.unlocked && (
                          <Badge variant="outline" className="mt-2 border-green-500 text-green-600 text-xs">
                            {getStageEmoji(companion.stage)} {companion.stage}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pull Gacha Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handlePullGacha}
                  disabled={gachaTokens === 0 || isPulling}
                  className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white px-8 py-6"
                >
                  {isPulling ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                    </motion.div>
                  ) : (
                    <Gift className="mr-2 h-5 w-5" />
                  )}
                  {isPulling ? "Opening..." : `Pull Gacha (${gachaTokens} tokens)`}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Companion Detail Modal */}
        <Dialog open={showCompanionModal} onOpenChange={setShowCompanionModal}>
          <DialogContent className="border-2 border-green-500/30 bg-gradient-to-br from-green-50 to-yellow-50">
            <DialogHeader>
              <DialogTitle className="text-[#78350f] text-center">
                {selectedCompanion?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedCompanion && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl"
                  >
                    {selectedCompanion.emoji}
                  </motion.div>
                </div>

                <div className="text-center">
                  <Badge className="bg-green-500 text-white mb-2">
                    {getStageEmoji(selectedCompanion.stage)} {selectedCompanion.stage.toUpperCase()} Stage
                  </Badge>
                  <Badge variant="outline" className="ml-2 border-[#78350f]/30 text-[#78350f]">
                    {selectedCompanion.theme} theme
                  </Badge>
                  {selectedCompanion.collectedDate && (
                    <p className="text-[#78350f]/70 text-xs mt-2">
                      Collected on {selectedCompanion.collectedDate}
                    </p>
                  )}
                </div>

                {/* Evolution Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-[#78350f]">Evolution Progress</p>
                    <p className="text-sm text-green-600">
                      {selectedCompanion.evolutionProgress}/{selectedCompanion.stage === "baby" ? "4" : selectedCompanion.stage === "teen" ? "8" : "Max"} badges
                    </p>
                  </div>
                  <Progress 
                    value={
                      selectedCompanion.stage === "adult" 
                        ? 100 
                        : (selectedCompanion.evolutionProgress / (selectedCompanion.stage === "baby" ? 4 : 8)) * 100
                    } 
                    className="h-3" 
                  />
                  <p className="text-xs text-[#78350f]/60 mt-1">
                    Earn {selectedCompanion.theme}-themed badges to evolve your companion
                  </p>
                </div>

                {/* Evolution Path */}
                <div className="flex justify-center items-center gap-3 py-4">
                  <div className="text-center">
                    <div className={`text-3xl mb-1 ${selectedCompanion.stage === "baby" ? "" : "opacity-40"}`}>
                      🌱
                    </div>
                    <p className="text-xs text-[#78350f]/70">Baby</p>
                    <p className="text-xs text-[#78350f]/50">0-4 badges</p>
                  </div>
                  <div className="text-[#78350f]/40">→</div>
                  <div className="text-center">
                    <div className={`text-3xl mb-1 ${selectedCompanion.stage === "teen" ? "" : "opacity-40"}`}>
                      🌿
                    </div>
                    <p className="text-xs text-[#78350f]/70">Teen</p>
                    <p className="text-xs text-[#78350f]/50">4-8 badges</p>
                  </div>
                  <div className="text-[#78350f]/40">→</div>
                  <div className="text-center">
                    <div className={`text-3xl mb-1 ${selectedCompanion.stage === "adult" ? "" : "opacity-40"}`}>
                      🌳
                    </div>
                    <p className="text-xs text-[#78350f]/70">Adult</p>
                    <p className="text-xs text-[#78350f]/50">8+ badges</p>
                  </div>
                </div>

                {/* Evolve Button */}
                {((selectedCompanion.stage === "baby" && selectedCompanion.evolutionProgress >= 4) ||
                  (selectedCompanion.stage === "teen" && selectedCompanion.evolutionProgress >= 8)) && 
                  selectedCompanion.stage !== "adult" && (
                  <Button
                    onClick={handleEvolve}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Evolve to {selectedCompanion.stage === "baby" ? "Teen" : "Adult"}!
                  </Button>
                )}

                {selectedCompanion.stage !== "adult" && 
                  ((selectedCompanion.stage === "baby" && selectedCompanion.evolutionProgress < 4) ||
                  (selectedCompanion.stage === "teen" && selectedCompanion.evolutionProgress < 8)) && (
                  <div className="text-center p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                    <p className="text-sm text-[#78350f]">
                      Earn {(selectedCompanion.stage === "baby" ? 4 : 8) - selectedCompanion.evolutionProgress} more {selectedCompanion.theme}-themed badge{(selectedCompanion.stage === "baby" ? 4 : 8) - selectedCompanion.evolutionProgress > 1 ? "s" : ""} to evolve!
                    </p>
                  </div>
                )}

                {selectedCompanion.stage === "adult" && (
                  <div className="text-center p-3 bg-gradient-to-r from-green-100 to-yellow-100 rounded-lg border-2 border-green-500">
                    <p className="text-sm text-[#78350f]">
                      ✨ Fully evolved! Keep earning badges to strengthen your companion.
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}