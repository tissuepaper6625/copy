import { Router } from "express";
import Memathon from "../model/Memathon.js";
import { privyMiddleware } from "../middleware/privyMiddleware.js";

const router = Router();

// Add this helper at the top after imports
function transformMemathon(memathonDoc) {
  return {
    _id: memathonDoc._id,
    title: memathonDoc.name,
    description: memathonDoc.description,
    prizePool: memathonDoc.prizes || 0,
    startDate: memathonDoc.start_date,
    endDate: memathonDoc.end_date,
    status: memathonDoc.status,
    organizer: {
      username: memathonDoc.organizer,
      walletAddress: memathonDoc.organizer_wallet || '',
    },
    participants: (memathonDoc.participants || []).map(p => ({
      username: p.username,
      walletAddress: p.userId,
      enrolledAt: p.enrolled_at,
    })),
    maxParticipants: memathonDoc.max_participants,
    rules: memathonDoc.rules,
    createdAt: memathonDoc.created_at,
    updatedAt: memathonDoc.updatedAt || memathonDoc.created_at,
  };
}

// Create a new memathon
router.post("/", privyMiddleware, async (req, res) => {
  try {
    const { name, theme, description, start_date, end_date, rules, prizes, max_participants } = req.body;
    if (!name || !theme || !description || !start_date || !end_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const memathon = new Memathon({
      name,
      theme,
      description,
      start_date,
      end_date,
      rules,
      prizes,
      max_participants,
      organizer: req.user?.twitter?.username || req.user?.id || "Unknown",
      current_participants: 0,
      participants: [],
      status: "active",
      is_public: true
    });
    await memathon.save();
    res.status(201).json({ memathon: transformMemathon(memathon) });
  } catch (error) {
    console.error("Error creating memathon:", error);
    res.status(500).json({ error: "Failed to create memathon" });
  }
});

// Get all memathons with filtering options
router.get("/", async (req, res) => {
  try {
    const { status, upcoming, current, limit = 20, page = 1 } = req.query;
    let filter = { is_public: true };
    if (status) filter.status = status;
    if (upcoming === 'true') filter.start_date = { $gt: new Date() };
    if (current === 'true') {
      const now = new Date();
      filter.$or = [ { status: 'active' }, { status: 'voting' } ];
      filter.start_date = { $lte: now };
      filter.end_date = { $gte: now };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const memathons = await Memathon.find(filter)
      .sort({ start_date: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Memathon.countDocuments(filter);
    res.status(200).json({
      memathons: memathons.map(transformMemathon),
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching memathons:", error);
    res.status(500).json({ error: "Failed to fetch memathons" });
  }
});

// Get a specific memathon by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const memathon = await Memathon.findById(id);
    if (!memathon) return res.status(404).json({ error: "Memathon not found" });
    res.status(200).json({ memathon: transformMemathon(memathon) });
  } catch (error) {
    console.error("Error fetching memathon:", error);
    res.status(500).json({ error: "Failed to fetch memathon" });
  }
});

// Enroll user in a memathon
router.post("/:id/enroll", privyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    const user = req.user;
    const userId = user.id;
    const userToEnroll = {
      userId,
      username: username || user.twitter?.username || 'Unknown User'
    };
    const memathon = await Memathon.findById(id);
    if (!memathon) return res.status(404).json({ error: "Memathon not found" });
    if (memathon.status !== 'active') return res.status(400).json({ error: "Memathon is not currently accepting enrollments" });
    const now = new Date();
    if (now < memathon.start_date) return res.status(400).json({ error: "Memathon has not started yet" });
    if (now > memathon.end_date) return res.status(400).json({ error: "Memathon has already ended" });
    if (memathon.max_participants && memathon.current_participants >= memathon.max_participants) return res.status(400).json({ error: "Memathon is full" });
    if (!memathon.participants) memathon.participants = [];
    const isAlreadyEnrolled = memathon.participants.some(participant => participant.userId === userToEnroll.userId);
    if (isAlreadyEnrolled) return res.status(400).json({ error: "User is already enrolled in this memathon" });
    memathon.participants.push({
      userId: userToEnroll.userId,
      username: userToEnroll.username,
      enrolled_at: new Date()
    });
    memathon.current_participants += 1;
    await memathon.save();
    res.status(200).json({ 
      message: "Successfully enrolled in memathon",
      memathon: transformMemathon(memathon)
    });
  } catch (error) {
    console.error("Error enrolling in memathon:", error);
    res.status(500).json({ error: "Failed to enroll in memathon" });
  }
});

// Get user's enrolled memathons
router.get("/user/enrolled", privyMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = req.user;
    const userId = user.id;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const memathons = await Memathon.find({
      "participants.userId": userId
    })
    .sort({ start_date: -1 })
    .skip(skip)
    .limit(parseInt(limit));
    const total = await Memathon.countDocuments({
      "participants.userId": userId
    });
    res.status(200).json({
      memathons,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching user's enrolled memathons:", error);
    res.status(500).json({ error: "Failed to fetch enrolled memathons" });
  }
});

// Withdraw from a memathon
router.delete("/:id/enroll", privyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const userId = user.id;
    const memathon = await Memathon.findById(id);
    if (!memathon) return res.status(404).json({ error: "Memathon not found" });
    if (!memathon.participants) return res.status(400).json({ error: "User is not enrolled in this memathon" });
    const participantIndex = memathon.participants.findIndex(participant => participant.userId === userId);
    if (participantIndex === -1) return res.status(400).json({ error: "User is not enrolled in this memathon" });
    memathon.participants.splice(participantIndex, 1);
    memathon.current_participants = Math.max(0, memathon.current_participants - 1);
    await memathon.save();
    res.status(200).json({ 
      message: "Successfully withdrawn from memathon",
      memathon: transformMemathon(memathon)
    });
  } catch (error) {
    console.error("Error withdrawing from memathon:", error);
    res.status(500).json({ error: "Failed to withdraw from memathon" });
  }
});

// Edit a memathon (organizer only)
router.patch('/:id', privyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const memathon = await Memathon.findById(id);
    if (!memathon) return res.status(404).json({ error: 'Memathon not found' });
    const organizer = req.user?.twitter?.username || req.user?.id;
    if (memathon.organizer !== organizer) {
      return res.status(403).json({ error: 'Only the organizer can edit this memathon' });
    }
    const allowedFields = ['name', 'theme', 'description', 'start_date', 'end_date', 'rules', 'prizes', 'max_participants'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        memathon[field] = req.body[field];
      }
    });
    // Allow status change
    if (req.body.status) {
      const validStatuses = ['active', 'on_hold', 'cancelled'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      // Only allow re-activating if currently cancelled or on_hold
      if (req.body.status === 'active' && ['cancelled', 'on_hold'].includes(memathon.status)) {
        memathon.status = 'active';
      } else if (req.body.status !== memathon.status) {
        memathon.status = req.body.status;
      }
    }
    await memathon.save();
    res.status(200).json({ memathon: transformMemathon(memathon) });
  } catch (error) {
    console.error('Error editing memathon:', error);
    res.status(500).json({ error: 'Failed to edit memathon' });
  }
});

// Cancel a memathon (organizer only)
router.delete('/:id', privyMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const memathon = await Memathon.findById(id);
    if (!memathon) return res.status(404).json({ error: 'Memathon not found' });
    const organizer = req.user?.twitter?.username || req.user?.id;
    if (memathon.organizer !== organizer) {
      return res.status(403).json({ error: 'Only the organizer can cancel this memathon' });
    }
    memathon.status = 'cancelled';
    await memathon.save();
    res.status(200).json({ message: 'Memathon cancelled', memathon });
  } catch (error) {
    console.error('Error cancelling memathon:', error);
    res.status(500).json({ error: 'Failed to cancel memathon' });
  }
});

export default router; 