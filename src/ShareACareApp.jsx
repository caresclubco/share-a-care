// src/ShareACareApp.jsx
import React, { useState, useEffect } from "react";
import { Bell, User, Home, Heart, Gift, ArrowLeft, Search } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { getProjects, getCarePackages, getUserDonations } from "./firebase-db";
import { initializeOnchainKit } from "@coinbase/onchainkit";

// Initialize OnchainKit for Base Wallet integration
initializeOnchainKit();

// Main App Component
const ShareACareApp = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { isAdmin } = useAdminAuth();

  const [currentPage, setCurrentPage] = useState("home");
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [projects, setProjects] = useState([]);
  const [carePackages, setCarePackages] = useState([]);
  const [userDonations, setUserDonations] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [isExplainerCollapsed, setIsExplainerCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch user-specific data when connected
  useEffect(() => {
    if (isConnected && address) {
      fetchUserData();
    } else {
      setUserDonations([]);
    }
  }, [isConnected, address]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch projects and care packages
      const [projectsData, packagesData, donorsData] = await Promise.all([
        getProjects(),
        getCarePackages(),
        getTopDonors(5), // Assuming you have this function
      ]);

      setProjects(projectsData);
      setCarePackages(packagesData);
      setTopDonors(donorsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    if (!isConnected || !address) return;

    try {
      const donations = await getUserDonations(address);
      setUserDonations(donations);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // Connect wallet function using wagmi
  const connectWallet = async () => {
    try {
      // Find the first available connector (usually injected - MetaMask)
      const connector = connectors[0];
      if (connector && connector.ready) {
        await connect({ connector });
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
    }
  };

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Render different pages based on state
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return renderHomePage();
      case "projects":
        return renderProjectsPage();
      case "rewards":
        return renderRewardsPage();
      case "profile":
        return renderProfilePage();
      case "admin":
        return renderAdminPage();
      default:
        return renderHomePage();
    }
  };

  // Home Page
  const renderHomePage = () => {
    return (
      <div className="w-full h-full">
        <div className="flex justify-between items-center p-4 bg-white">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-red-600">Share-a-Care</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell size={20} />
            {isConnected ? (
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center overflow-hidden">
                  <User size={14} className="text-white" />
                </div>
                <span className="text-sm font-medium">
                  {formatAddress(address)}
                </span>
              </div>
            ) : (
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-full text-sm"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Logo centered */}
        <div className="flex justify-center my-4">
          <img
            src="https://cares.tv/cdn/shop/files/cares_mascot_trans.gif?v=1720633663&width=220"
            alt="CARES Logo"
            className="h-16"
          />
        </div>

        {/* App Explainer Section */}
        <div
          className={`mx-4 mt-2 p-4 bg-white rounded-lg shadow ${
            isExplainerCollapsed ? "h-12 overflow-hidden" : ""
          }`}
        >
          <div
            className="flex justify-between items-center"
            onClick={() => setIsExplainerCollapsed(!isExplainerCollapsed)}
          >
            <h2 className="font-bold text-lg text-center w-full">
              Share-a-Care
            </h2>
            <button className="text-gray-500">
              {isExplainerCollapsed ? "↓" : "↑"}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Share-a-Care is a crowdfunding platform that connects the CARES
            community to impactful projects. We channel resources to build
            programs, support onchain communities, and create IRL activations.
            30% of all funds go directly into supporting artists, brands, and
            philanthropic initiatives in the Web3 ecosystem. Join us in funding
            innovation and driving positive change within our community!
          </p>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="w-full p-2 pl-10 border rounded-full bg-gray-100"
              placeholder="Search projects..."
            />
          </div>

          <h2 className="text-lg font-semibold mb-3">Active Projects</h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-lg shadow p-4"
                >
                  <div className="flex">
                    <div className="w-1/3 h-24 bg-gray-200 rounded"></div>
                    <div className="w-2/3 pl-4">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                      <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No projects found.
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow p-4"
                  onClick={() => setShowProjectDetails(true)}
                >
                  <div className="flex">
                    <div className="w-1/3">
                      <img
                        src={project.image || "https://via.placeholder.com/150"}
                        alt={project.title}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                    <div className="w-2/3 pl-4">
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="text-sm text-gray-600">
                        {project.description}
                      </p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                ((project.currentAmount || 0) /
                                  project.fundingGoal) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span>{project.currentAmount || 0} CARES</span>
                          <span>Goal: {project.fundingGoal} CARES</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {project.supportersCount || 0} supporters
                        </span>
                        {project.topDonor && (
                          <span className="text-xs text-red-600">
                            Top donor: {project.topDonor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-red-600 text-white py-2 rounded-full mt-3">
                    Support Project
                  </button>
                </div>
              ))}
            </div>
          )}

          <h2 className="text-lg font-semibold mt-6 mb-3">Top Supporters</h2>
          {isLoading ? (
            <div className="animate-pulse bg-white rounded-lg shadow p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : topDonors.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
              No donors yet. Be the first to support a project!
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4">
              {topDonors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <span>
                      {donor.id.includes(".eth")
                        ? donor.id
                        : formatAddress(donor.id)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{donor.totalDonated} CARES</div>
                    <div className="text-xs text-gray-500">
                      {donor.projectsSupported?.length || 0} projects
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Profile Page
  const renderProfilePage = () => {
    // If not connected, show connect wallet prompt
    if (!isConnected) {
      return (
        <div className="w-full h-full bg-white p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <User size={36} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view your profile, donations, and rewards.
          </p>
          <button
            onClick={connectWallet}
            className="bg-red-600 text-white px-6 py-3 rounded-full"
          >
            Connect Wallet
          </button>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-white">
        <div className="bg-red-600 p-6 text-white">
          <div className="flex items-center mb-4">
            <ArrowLeft size={24} onClick={() => setCurrentPage("home")} />
            <h1 className="ml-4 text-xl font-bold">My Profile</h1>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <User size={48} className="text-red-600" />
            </div>
          </div>
          <div className="text-center mt-2">
            <h2 className="text-xl font-bold">{formatAddress(address)}</h2>
            <p className="text-sm">Connected to Wallet</p>
          </div>
        </div>

        <div className="p-4">
          {isAdmin && (
            <div className="bg-white rounded-lg shadow mb-4 p-4 border-l-4 border-red-600">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Admin Controls</h3>
                <button
                  className="text-red-600 underline text-sm"
                  onClick={() => setCurrentPage("admin")}
                >
                  Manage Projects
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                As the CARES wallet, you can manage projects, care packages, and
                publishers.
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow mb-4">
            <div className="p-4 border-b">
              <div className="flex justify-between">
                <span>Total Donated</span>
                <span className="font-bold">
                  {userDonations.reduce((sum, d) => sum + d.amount, 0)} CARES
                </span>
              </div>
            </div>
            <div className="p-4 border-b">
              <div className="flex justify-between">
                <span>Projects Supported</span>
                <span className="font-bold">
                  {new Set(userDonations.map((d) => d.projectId)).size}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <span>Leaderboard Position</span>
                <span className="font-bold">#8</span>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-6 mb-3">
            My Supported Projects
          </h2>
          {userDonations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
              You haven't supported any projects yet.
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from(new Set(userDonations.map((d) => d.projectId))).map(
                (projectId) => {
                  const project = projects.find((p) => p.id === projectId);
                  if (!project) return null;

                  const totalDonated = userDonations
                    .filter((d) => d.projectId === projectId)
                    .reduce((sum, d) => sum + d.amount, 0);

                  return (
                    <div
                      key={projectId}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <h3 className="font-bold">{project.title}</h3>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Your contribution: {totalDonated} CARES</span>
                        <span className="text-red-600">Thank you!</span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={connectWallet}
              className="w-full bg-red-600 text-white py-3 rounded-full"
            >
              Connect Wallet
            </button>
            <button
              onClick={disconnect}
              className="w-full bg-white border border-red-600 text-red-600 py-3 rounded-full mt-3"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Projects Page
  const renderProjectsPage = () => {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Support Projects</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-lg shadow p-4"
              >
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-3"></div>
                <div className="h-2 bg-gray-200 rounded-full mb-1"></div>
                <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No projects found.
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-bold">{project.title}</h2>
                <p className="text-gray-600 my-2">{project.description}</p>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((project.currentAmount || 0) / project.fundingGoal) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>
                      {project.currentAmount || 0} / {project.fundingGoal} CARES
                    </span>
                    <span>{project.supportersCount || 0} supporters</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Donation Amount (CARES)
                    </label>
                    <div className="grid grid-cols-3 gap-2 my-2">
                      <button className="p-2 border rounded-lg text-center hover:bg-gray-50">
                        10
                      </button>
                      <button className="p-2 border rounded-lg text-center hover:bg-gray-50">
                        25
                      </button>
                      <button className="p-2 border rounded-lg text-center hover:bg-gray-50">
                        50
                      </button>
                      <button className="p-2 border rounded-lg text-center hover:bg-gray-50">
                        100
                      </button>
                      <button className="p-2 border rounded-lg text-center hover:bg-gray-50">
                        250
                      </button>
                      <button className="p-2 border rounded-lg text-center hover:bg-gray-50">
                        Custom
                      </button>
                    </div>
                  </div>

                  <button className="w-full bg-red-600 text-white py-3 rounded-lg">
                    {!isConnected ? "Connect Wallet to Donate" : "Donate Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Rewards Page
  const renderRewardsPage = () => {
    return (
      <div className="bg-gray-100 min-h-screen pb-20">
        {/* Header */}
        <div className="bg-red-600 text-white p-4">
          <h1 className="text-xl font-bold">Care Packages</h1>
          <p className="text-sm opacity-90">
            Monthly rewards for top supporters
          </p>
        </div>

        {/* Your Current Status */}
        <div className="bg-white m-4 rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold">Your Current Rank</h2>
              <p className="text-sm text-gray-600">This month's contribution</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">#8</div>
              <div className="text-red-600 font-medium">35 CARES</div>
            </div>
          </div>

          {/* Progress to next rank */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Current</span>
              <span>Next Rank: #7</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${(35 / 40) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-right">
              5 CARES more to rank up
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white">
          <button className="flex-1 py-3 px-4 border-b-2 border-red-600 text-red-600 font-medium">
            Monthly Rewards
          </button>
          <button className="flex-1 py-3 px-4 text-gray-600">Milestones</button>
          <button className="flex-1 py-3 px-4 text-gray-600">
            Leaderboard
          </button>
        </div>

        {/* Monthly rewards content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="font-bold">April 2025</h2>
            </div>
            <div className="text-sm text-gray-500">
              <span className="mr-1">5 days left</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Care Packages are 1-of-1 NFTs awarded to top supporters each month.
            Up to 10 unique Care Packages are released monthly.
          </p>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-lg shadow p-4"
                >
                  <div className="flex">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : carePackages.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
              No care packages available this month.
            </div>
          ) : (
            <div className="space-y-4">
              {carePackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex">
                    <div className="w-20 h-20 rounded-lg bg-purple-200 flex items-center justify-center overflow-hidden mr-4">
                      <Gift size={32} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold">{pkg.name}</h3>
                        <div className="text-sm font-medium text-yellow-600">
                          {pkg.eligibility}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {pkg.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center mr-1">
                            <span className="text-white text-xs">C</span>
                          </div>
                          <span className="text-sm font-medium">
                            {pkg.threshold} CARES min
                          </span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-full font-medium">
            View All Care Packages
          </button>
        </div>

        {/* About Care Packages */}
        <div className="mx-4 mt-6">
          <h2 className="font-bold mb-2">About Care Packages</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">
              Care Packages are exclusive 1-of-1 NFT artworks created by our
              community artists. Each month, up to 10 unique Care Packages are
              awarded to our top supporters, featuring special digital art,
              physical merchandise, event access, and more.
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center text-sm">
                <span className="text-yellow-500 mr-2">⭐⭐</span>
                <span>
                  Top supporter receives the most exclusive Care Package
                </span>
              </li>
              <li className="flex items-center text-sm">
                <span className="text-yellow-500 mr-2">⭐</span>
                <span>
                  Top 3 supporters receive limited edition physical merch
                </span>
              </li>
              <li className="flex items-center text-sm">
                <span className="text-yellow-500 mr-2">⭐</span>
                <span>
                  Top 10 supporters receive digital collectibles with on-chain
                  recognition
                </span>
              </li>
            </ul>
            <button className="mt-4 text-red-600 text-sm font-medium flex items-center">
              Learn more about Care Packages
              <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Admin Page - This will use the AdminPanel component
  const renderAdminPage = () => {
    // Import and use the AdminPanel component here
    // For demonstration, we're showing a simplified version
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
        <p className="mb-6">Loading admin panel...</p>

        {/* In your actual implementation, you would render the AdminPanel component here */}
        {/* <AdminPanel /> */}

        <button
          onClick={() => setCurrentPage("profile")}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Back to Profile
        </button>
      </div>
    );
  };

  // Project Details Modal
  const ProjectDetails = () => {
    const project = projects[0]; // Using first project for demo
    if (!project) return null;

    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <ArrowLeft size={24} onClick={() => setShowProjectDetails(false)} />
            <h1 className="ml-4 text-xl font-bold">Project Details</h1>
          </div>

          <img
            src={project.image || "https://via.placeholder.com/150"}
            alt={project.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          <h2 className="text-xl font-bold">{project.title}</h2>
          <p className="text-gray-600 my-2">{project.description}</p>

          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: `${
                    (project.currentAmount / project.fundingGoal) * 100
                  }%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>{project.currentAmount} CARES</span>
              <span>Goal: {project.fundingGoal} CARES</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Project Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Top donor gets custom shirt design</li>
              <li>All donors above 50 CARES get mentioned on website</li>
              <li>All donors receive project updates</li>
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">About This Project</h3>
            <p className="text-sm">
              This project aims to bring together our community through shared
              resources and knowledge. Your contribution will directly fund
              materials, space rental, and educational resources.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Top Supporters</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              {topDonors.slice(0, 3).map((donor, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <span>
                    {donor.id.includes(".eth")
                      ? donor.id
                      : formatAddress(donor.id)}
                  </span>
                  <span className="font-bold">{donor.totalDonated} CARES</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-2">Donate Amount</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                10 CARES
              </button>
              <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                25 CARES
              </button>
              <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                50 CARES
              </button>
              <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                100 CARES
              </button>
              <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                250 CARES
              </button>
              <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                Custom
              </button>
            </div>

            <button className="w-full bg-red-600 text-white py-3 rounded-full mt-2">
              {!isConnected ? "Connect Wallet to Donate" : "Donate Now"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Bottom Navigation
  const BottomNav = () => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 z-10">
        <div
          className={`flex flex-col items-center ${
            currentPage === "home" ? "text-red-600" : "text-gray-500"
          }`}
          onClick={() => setCurrentPage("home")}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </div>
        <div
          className={`flex flex-col items-center ${
            currentPage === "projects" ? "text-red-600" : "text-gray-500"
          }`}
          onClick={() => setCurrentPage("projects")}
        >
          <Heart size={20} />
          <span className="text-xs mt-1">Projects</span>
        </div>
        <div
          className={`flex flex-col items-center ${
            currentPage === "rewards" ? "text-red-600" : "text-gray-500"
          }`}
          onClick={() => setCurrentPage("rewards")}
        >
          <Gift size={20} />
          <span className="text-xs mt-1">Rewards</span>
        </div>
        <div
          className={`flex flex-col items-center ${
            currentPage === "profile" ? "text-red-600" : "text-gray-500"
          }`}
          onClick={() => setCurrentPage("profile")}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {renderPage()}
      <BottomNav />
      {showProjectDetails && <ProjectDetails />}
    </div>
  );
};

export default ShareACareApp;
