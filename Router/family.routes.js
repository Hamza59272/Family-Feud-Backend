const familyRouter = require("express").Router();
const {
    createFamily,
    updateFamilyStats,
    getFamilies
} = require('../Controllers/familyController');

familyRouter.post('/create-family', createFamily);
familyRouter.get('/get-families', getFamilies);
familyRouter.put('/update-family-stats', updateFamilyStats);

module.exports = familyRouter;
