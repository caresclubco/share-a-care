// Add to firebase-db.js if not already there
export const getTopDonors = async (limit = 5) => {
  try {
    // Mock implementation for now
    return [
      {
        id: "0x8aB0c174F40C5E22b00065C4Cc7b561c299Cad1C",
        totalDonated: 500,
        projectsSupported: [1, 2],
      },
      { id: "donor.eth", totalDonated: 350, projectsSupported: [1] },
      {
        id: "0x1234567890abcdef1234567890abcdef12345678",
        totalDonated: 200,
        projectsSupported: [2],
      },
    ].slice(0, limit);
  } catch (error) {
    console.error("Error fetching top donors:", error);
    return [];
  }
};
