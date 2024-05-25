const Profile = require('../../models/profile');

async function getAllProfiles(req, res) {
  try {
    const profiles = await Profile.findAll();
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function addProfile(req, res) {
  const { name, role } = req.body;
  try {
    await Profile.create({ name, role });
    res.status(201).json({ message: 'Profile added successfully' });
  } catch (error) {
    console.error('Error adding profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updateProfile(req, res) {
  const { id } = req.params;
  const { name, role } = req.body;
  try {
    await Profile.update({ name, role }, { where: { id } });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function removeProfile(req, res) {
  const { id } = req.params;
  try {
    await Profile.destroy({ where: { id } });
    res.json({ message: 'Profile removed successfully' });
  } catch (error) {
    console.error('Error removing profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getAllProfiles,
  addProfile,
  updateProfile,
  removeProfile,
};
