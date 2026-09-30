import Board from '../models/Board.js';
import User from '../models/User.js';

export const seedBoards = async () => {
  try {
    const owner = await User.findOne({ email: 'meena.owner@example.com' });
    if (!owner) return;

    const existingBoards = await Board.countDocuments();
    if (existingBoards > 0) return;

    const boardsToSeed = [
      {
        ownerId: owner._id,
        title: 'Hinjewadi Phase 1 IT Park Ultra HD LED Screen',
        description: 'Prime outdoor digital billboard facing the main Infosys Circle with over 180,000 daily IT professionals and tech commuters. Full motion video supported.',
        boardType: 'LED digital screen',
        city: 'Pune',
        area: 'Hinjewadi',
        address: 'Near Infosys Circle, Phase 1, Hinjewadi, Pune 411057',
        latitude: 18.5912,
        longitude: 73.7389,
        width: 30,
        height: 15,
        trafficLevel: 'very high',
        visibility: 'Front Facing - Lit at Night',
        images: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
        ],
        pricePerDay: 4500,
        pricePerWeek: 27000,
        pricePerMonth: 95000,
        status: 'approved',
      },
      {
        ownerId: owner._id,
        title: 'FC Road High Street Commercial Unipole',
        description: 'Iconic double-sided unipole billboard directly opposite Ferguson College Main Gate. Excellent youth and student demographic exposure with illuminated night lights.',
        boardType: 'unipole',
        city: 'Pune',
        area: 'FC Road (Shivajinagar)',
        address: 'Opposite Ferguson College Main Gate, FC Road, Pune 411004',
        latitude: 18.5246,
        longitude: 73.8415,
        width: 40,
        height: 20,
        trafficLevel: 'very high',
        visibility: 'Double Sided • Frontlit',
        images: [
          'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        ],
        pricePerDay: 3800,
        pricePerWeek: 22000,
        pricePerMonth: 80000,
        status: 'approved',
      },
      {
        ownerId: owner._id,
        title: 'Viman Nagar Airport Road Mega Hoarding',
        description: 'Large-scale arterial hoarding right at Symbiosis Junction on Pune Airport Road. Maximum corporate and transit reach.',
        boardType: 'hoarding',
        city: 'Pune',
        area: 'Viman Nagar',
        address: 'Symbiosis Junction, Airport Road, Viman Nagar, Pune 411014',
        latitude: 18.5679,
        longitude: 73.9143,
        width: 60,
        height: 30,
        trafficLevel: 'high',
        visibility: 'Eye-level Highway Clear Line-of-sight',
        images: [
          'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
        ],
        pricePerDay: 5000,
        pricePerWeek: 30000,
        pricePerMonth: 110000,
        status: 'approved',
      },
      {
        ownerId: owner._id,
        title: 'Wakad Bridge Flyover Double Sided Hoarding',
        description: 'Newly constructed high-elevation hoarding facing Wakad flyover and Mumbai-Pune expressway connector.',
        boardType: 'hoarding',
        city: 'Pune',
        area: 'Wakad',
        address: 'Wakad Bridge Junction, Pune 411057',
        latitude: 18.5987,
        longitude: 73.7654,
        width: 45,
        height: 20,
        trafficLevel: 'high',
        visibility: 'Highway Elevated Sightline',
        images: [
          'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
        ],
        pricePerDay: 4000,
        pricePerWeek: 24000,
        pricePerMonth: 88000,
        status: 'pending', // Starts as pending to test Admin approval flow
      },
    ];

    await Board.insertMany(boardsToSeed);
    console.log(`[Seed] Seeded ${boardsToSeed.length} initial boards in Pune`);
  } catch (error) {
    console.error('[Seed] Error seeding boards:', error.message);
  }
};

export default seedBoards;
