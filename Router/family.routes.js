const familyRouter = require("express").Router();
const {
    createFamily,
    updateFamilyStats,
    getFamilies,
    updateFamily,
    deleteFamily
} = require('../Controllers/familyController');

familyRouter.post('/create-family', createFamily);
familyRouter.post('/update-family', updateFamily);
familyRouter.delete('/delete-family/:id', deleteFamily);
familyRouter.get('/get-families', getFamilies);
familyRouter.put('/update-family-stats', updateFamilyStats);

module.exports = familyRouter;
