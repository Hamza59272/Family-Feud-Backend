const adminRouter = require("./admin.routes.js");
const surveyRouter = require("./survey.routes.js")
const familyRouter = require("./family.routes.js")

const routes = [
    {
        path: "/api/admin",
        handler: adminRouter,
    },
    {
        path: "/api/survey",
        handler: surveyRouter,
    },
    {
        path: "/api/family",
        handler: familyRouter,
    },
];

exports.connectRoute = (app) => {
    routes.forEach((route) => {
        app.use(route.path, route.handler);
    });

    app.get("/", (req, res) => {
        res.send("Server is Running");
      });
      
    app.use('*', (req, res) => {
        res.status(404).send({ message: 'No such URL found' });
    });
};
