import React, { useState } from 'react';
import { Bell, User, Home, Heart, Settings, ArrowLeft, Search, Info, DollarSign, Gift, Trophy, Calendar, ChevronRight, Medal, Star, Crown } from 'lucide-react';

// Main App Component
const ShareACareApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [newPublisherWallet, setNewPublisherWallet] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isExplainerCollapsed, setIsExplainerCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // To track admin status
  
  // Primary admin wallet (CARES wallet) that can manage other publishers
  const primaryAdminWallet = "0x8aB0c174F40C5E22b00065C4Cc7b561c299Cad1C";
  
  // List of authorized publisher wallets (managed by the admin)
  const [authorizedPublishers, setAuthorizedPublishers] = useState([
    "0x8aB0c174F40C5E22b00065C4Cc7b561c299Cad1C" // CARES wallet is always a publisher
  ]);
  
  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Community Garden",
      description: "Help us build a community garden for local families",
      fundingGoal: 500,
      currentFunding: 325,
      supporters: 14,
      image: "https://via.placeholder.com/150",
      topDonor: "alex.eth"
    },
    {
      id: 2,
      title: "Tech Workshop",
      description: "Free coding classes for underserved communities",
      fundingGoal: 1000,
      currentFunding: 780,
      supporters: 27,
      image: "https://via.placeholder.com/150",
      topDonor: "taylor.eth"
    },
    {
      id: 3,
      title: "Mental Health Support",
      description: "Resources for those struggling with mental health",
      fundingGoal: 2000,
      currentFunding: 950,
      supporters: 32,
      image: "https://via.placeholder.com/150",
      topDonor: "jamie.eth"
    }
  ];
  
  // Top donors leaderboard
  const topDonors = [
    { name: "alex.eth", amount: 250, projects: 3 },
    { name: "taylor.eth", amount: 180, projects: 2 },
    { name: "jamie.eth", amount: 150, projects: 4 },
    { name: "morgan.eth", amount: 100, projects: 1 },
    { name: "casey.eth", amount: 75, projects: 2 }
  ];
  
  // Simulating wallet connection
  const connectWallet = () => {
    const mockAddress = "0x8aB0c174F40C5E22b00065C4Cc7b561c299Cad1C"; // Simulate connecting with admin wallet
    setIsConnected(true);
    setWalletAddress(mockAddress);
    
    // Check if connected wallet is the primary admin
    if (mockAddress === primaryAdminWallet) {
      setIsAdmin(true);
    }
  };
  
  // Add a new authorized publisher
  const addPublisher = (publisherWallet) => {
    if (!authorizedPublishers.includes(publisherWallet)) {
      setAuthorizedPublishers([...authorizedPublishers, publisherWallet]);
    }
  };
  
  // Remove a publisher
  const removePublisher = (publisherWallet) => {
    // Cannot remove the primary admin wallet
    if (publisherWallet !== primaryAdminWallet) {
      setAuthorizedPublishers(authorizedPublishers.filter(wallet => wallet !== publisherWallet));
    }
  };

  // Render different pages based on state
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
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
                    <span className="text-sm font-medium">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
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
            <div className={`mx-4 mt-2 p-4 bg-white rounded-lg shadow ${isExplainerCollapsed ? 'h-12 overflow-hidden' : ''}`}>
              <div className="flex justify-between items-center" onClick={() => setIsExplainerCollapsed(!isExplainerCollapsed)}>
                <h2 className="font-bold text-lg text-center w-full">Share-a-Care</h2>
                <button className="text-gray-500">
                  {isExplainerCollapsed ? '↓' : '↑'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Share-a-Care is a crowdfunding platform that connects the CARES community to impactful projects. 
                We channel resources to build programs, support onchain communities, and create IRL activations. 
                30% of all funds go directly into supporting artists, brands, and philanthropic initiatives in the 
                Web3 ecosystem. Join us in funding innovation and driving positive change within our community!
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
              
              <div className="space-y-4">
                {projects.map(project => (
                  <div 
                    key={project.id} 
                    className="bg-white rounded-lg shadow p-4"
                    onClick={() => setShowProjectDetails(true)}
                  >
                    <div className="flex">
                      <div className="w-1/3">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-24 object-cover rounded" 
                        />
                      </div>
                      <div className="w-2/3 pl-4">
                        <h3 className="font-bold">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{width: `${(project.currentFunding/project.fundingGoal) * 100}%`}}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span>{project.currentFunding} CARES</span>
                            <span>Goal: {project.fundingGoal} CARES</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">{project.supporters} supporters</span>
                          <span className="text-xs text-red-600">Top donor: {project.topDonor}</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-red-600 text-white py-2 rounded-full mt-3">
                      Support Project
                    </button>
                  </div>
                ))}
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-3">Top Supporters</h2>
              <div className="bg-white rounded-lg shadow p-4">
                {topDonors.map((donor, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span>{donor.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{donor.amount} CARES</div>
                      <div className="text-xs text-gray-500">{donor.projects} projects</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="w-full h-full bg-white">
            <div className="bg-red-600 p-6 text-white">
              <div className="flex items-center mb-4">
                <ArrowLeft size={24} onClick={() => setCurrentPage('home')} />
                <h1 className="ml-4 text-xl font-bold">My Profile</h1>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <User size={48} className="text-red-600" />
                </div>
              </div>
              <div className="text-center mt-2">
                <h2 className="text-xl font-bold">user.eth</h2>
                <p className="text-sm">Connected to Warpcast</p>
              </div>
            </div>
            
            <div className="p-4">
              {isAdmin && (
                <div className="bg-white rounded-lg shadow mb-4 p-4 border-l-4 border-red-600">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Admin Controls</h3>
                    <button 
                      className="text-red-600 underline text-sm"
                      onClick={() => setCurrentPage('admin')}
                    >
                      Manage Publishers
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    As the CARES wallet, you can manage authorized publishers and create projects.
                  </p>
                </div>
              )}
            
              <div className="bg-white rounded-lg shadow mb-4">
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <span>Total Donated</span>
                    <span className="font-bold">120 CARES</span>
                  </div>
                </div>
                <div className="p-4 border-b">
                  <div className="flex justify-between">
                    <span>Projects Supported</span>
                    <span className="font-bold">4</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <span>Leaderboard Position</span>
                    <span className="font-bold">#8</span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-lg font-semibold mt-6 mb-3">My Supported Projects</h2>
              <div className="space-y-4">
                {projects.slice(0, 2).map(project => (
                  <div key={project.id} className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-bold">{project.title}</h3>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Your contribution: 60 CARES</span>
                      <span className="text-red-600">Thank you!</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <button className="w-full bg-red-600 text-white py-3 rounded-full">
                  Connect Wallet
                </button>
                <button className="w-full bg-white border border-red-600 text-red-600 py-3 rounded-full mt-3">
                  Disconnect Warpcast
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'admin':
        return (
          <div className="w-full h-full bg-white">
            <div className="bg-red-600 p-4 text-white">
              <div className="flex items-center">
                <ArrowLeft size={24} onClick={() => setCurrentPage('profile')} />
                <h1 className="ml-4 text-xl font-bold">Publisher Management</h1>
              </div>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h2 className="font-bold mb-2">Add New Publisher</h2>
                <p className="text-sm text-gray-600 mb-3">
                  Add wallet addresses that are authorized to create projects. Only the CARES wallet can manage publishers.
                </p>
                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-1 p-2 border rounded-l-lg"
                    placeholder="Wallet address (0x...)"
                    value={newPublisherWallet}
                    onChange={(e) => setNewPublisherWallet(e.target.value)}
                  />
                  <button 
                    className="bg-red-600 text-white px-4 py-2 rounded-r-lg"
                    onClick={() => {
                      if (newPublisherWallet) {
                        addPublisher(newPublisherWallet);
                        setNewPublisherWallet("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <h2 className="font-bold mb-2">Authorized Publishers</h2>
              <div className="bg-white rounded-lg shadow">
                {authorizedPublishers.map((wallet, index) => (
                  <div key={index} className="p-3 border-b flex justify-between items-center">
                    <div>
                      <span className="font-medium">{wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}</span>
                      {wallet === primaryAdminWallet && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                          CARES Wallet
                        </span>
                      )}
                    </div>
                    {wallet !== primaryAdminWallet && (
                      <button 
                        className="text-red-600 text-sm"
                        onClick={() => removePublisher(wallet)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {authorizedPublishers.length === 1 && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No additional publishers added yet.
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button 
                  className="w-full bg-red-600 text-white py-3 rounded-full"
                  onClick={() => setCurrentPage('create-project')}
                >
                  Create New Project
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'create-project':
        return (
          <div className="w-full h-full bg-white">
            <div className="bg-red-600 p-4 text-white">
              <div className="flex items-center">
                <ArrowLeft size={24} onClick={() => setCurrentPage('admin')} />
                <h1 className="ml-4 text-xl font-bold">Create New Project</h1>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg"
                    placeholder="Give your project a name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg"
                    placeholder="Brief description (1-2 sentences)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description
                  </label>
                  <textarea 
                    className="w-full p-2 border rounded-lg h-24"
                    placeholder="Detailed description of the project, its goals, and impact"
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funding Goal (CARES)
                  </label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g. 1000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-2">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">
                      Click or drag to upload an image
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perks for Top Supporters
                  </label>
                  <textarea 
                    className="w-full p-2 border rounded-lg h-24"
                    placeholder="List rewards for top donors (e.g., custom shirt design, signage, mentions)"
                  ></textarea>
                </div>
                
                <div className="pt-4">
                  <button className="w-full bg-red-600 text-white py-3 rounded-full">
                    Publish Project
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-full mt-3">
                    Save Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'donate':
        return (
          <div className="bg-gray-100 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-red-600 text-white p-4">
              <h1 className="text-xl font-bold">Care Packages</h1>
              <p className="text-sm opacity-90">Monthly rewards for top supporters</p>
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
                    style={{width: `${(35 / 40) * 100}%`}}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  5 CARES more to rank up
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b bg-white">
              <button 
                className="flex-1 py-3 px-4 border-b-2 border-red-600 text-red-600 font-medium"
              >
                Monthly Rewards
              </button>
              <button 
                className="flex-1 py-3 px-4 text-gray-600"
              >
                Milestones
              </button>
              <button 
                className="flex-1 py-3 px-4 text-gray-600"
              >
                Leaderboard
              </button>
            </div>
            
            {/* Monthly rewards content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="text-red-600 mr-2" size={20} />
                  <h2 className="font-bold">April 2025</h2>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <span className="mr-1">5 days left</span>
                  <ChevronRight size={16} />
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Care Packages are 1-of-1 NFTs awarded to top supporters each month. Up to 10 unique Care Packages are released monthly.
              </p>
              
              <div className="space-y-4">
                {/* Care Package #1 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-red-500 opacity-60 animate-pulse"></div>
                        <Gift className="absolute inset-0 m-auto text-white" size={32} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold">Care Package #1</h3>
                        <div className="flex items-center">
                          <Trophy size={16} className="text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">Top Donor</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Exclusive 1-of-1 NFT artwork by community artist</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center mr-1">
                            <span className="text-white text-xs">C</span>
                          </div>
                          <span className="text-sm font-medium">100 CARES min</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Care Package #2 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                      <Gift size={32} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold">Care Package #2</h3>
                        <div className="flex items-center">
                          <Trophy size={16} className="text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">Top 3 Donors</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Limited edition physical merch with your name featured</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center mr-1">
                            <span className="text-white text-xs">C</span>
                          </div>
                          <span className="text-sm font-medium">75 CARES min</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Care Package #3 */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                      <Gift size={32} className="text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold">Care Package #3</h3>
                        <div className="flex items-center">
                          <Trophy size={16} className="text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">Top 10 Donors</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Digital collectible with on-chain recognition</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center mr-1">
                            <span className="text-white text-xs">C</span>
                          </div>
                          <span className="text-sm font-medium">50 CARES min</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-red-600 text-white py-3 rounded-full font-medium">
                View All Care Packages
              </button>
            </div>
            
            {/* About Care Packages */}
            <div className="mx-4 mt-6">
              <h2 className="font-bold mb-2">About Care Packages</h2>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-600">
                  Care Packages are exclusive 1-of-1 NFT artworks created by our community artists. Each month, up to 10 unique Care Packages are awarded to our top supporters, featuring special digital art, physical merchandise, event access, and more.
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-center text-sm">
                    <Star size={16} className="text-yellow-500 mr-2 flex-shrink-0" />
                    <Star size={16} className="text-yellow-500 mr-2 flex-shrink-0" />
                    <span>Top supporter receives the most exclusive Care Package</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Star size={16} className="text-yellow-500 mr-2 flex-shrink-0" />
                    <span>Top 3 supporters receive limited edition physical merch</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <Star size={16} className="text-yellow-500 mr-2 flex-shrink-0" />
                    <span>Top 10 supporters receive digital collectibles with on-chain recognition</span>
                  </li>
                </ul>
                <button className="mt-4 text-red-600 text-sm font-medium flex items-center">
                  Learn more about Care Packages
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Project Details Modal
  const ProjectDetails = () => {
    const project = projects[0]; // Just using first project for demo
    
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <ArrowLeft size={24} onClick={() => setShowProjectDetails(false)} />
            <h1 className="ml-4 text-xl font-bold">Project Details</h1>
          </div>
          
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-48 object-cover rounded-lg mb-4" 
          />
          
          <h2 className="text-xl font-bold">{project.title}</h2>
          <p className="text-gray-600 my-2">{project.description}</p>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full" 
                style={{width: `${(project.currentFunding/project.fundingGoal) * 100}%`}}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span>{project.currentFunding} CARES</span>
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
            <p className="text-sm">This project aims to bring together our community through shared resources and knowledge. Your contribution will directly fund materials, space rental, and educational resources.</p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Top Supporters</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              {topDonors.slice(0, 3).map((donor, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span>{donor.name}</span>
                  <span className="font-bold">{donor.amount} CARES</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Donate Amount</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="p-3 border rounded-lg text-center">10 CARES</button>
              <button className="p-3 border rounded-lg text-center">25 CARES</button>
              <button className="p-3 border rounded-lg text-center">50 CARES</button>
              <button className="p-3 border rounded-lg text-center">100 CARES</button>
              <button className="p-3 border rounded-lg text-center">250 CARES</button>
              <button className="p-3 border rounded-lg text-center">Custom</button>
            </div>
            
            <button className="w-full bg-red-600 text-white py-3 rounded-full mt-2">
              Donate Now
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
          className={`flex flex-col items-center ${currentPage === 'home' ? 'text-red-600' : 'text-gray-500'}`}
          onClick={() => setCurrentPage('home')}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </div>
        <div 
          className={`flex flex-col items-center ${currentPage === 'projects' ? 'text-red-600' : 'text-gray-500'}`}
          onClick={() => setCurrentPage('projects')}
        >
          <Heart size={20} />
          <span className="text-xs mt-1">Projects</span>
        </div>
        <div 
          className={`flex flex-col items-center ${currentPage === 'donate' ? 'text-red-600' : 'text-gray-500'}`}
          onClick={() => setCurrentPage('donate')}
        >
          <Gift size={20} />
          <span className="text-xs mt-1">Rewards</span>
        </div>
        <div 
          className={`flex flex-col items-center ${currentPage === 'profile' ? 'text-red-600' : 'text-gray-500'}`}
          onClick={() => setCurrentPage('profile')}
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