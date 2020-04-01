const router = require("express").Router();
const controller = require("./controller");

router.get("/ticket_list", controller.ticket_list);
router.get("/bus", controller.bus);
router.post("/bus_add", controller.bus_add);
router.put("/bus_update", controller.bus_update);
router.delete("/bus_delete", controller.bus_delete);
router.get("/line", controller.line);
router.post("/line_add", controller.line_add);
router.put("/line_update", controller.line_update);
router.delete("/line_delete", controller.line_delete);
router.get("/timetable", controller.timetable);
router.post("/timetable_add", controller.timetable_add);
router.put("/timetable_update", controller.timetable_update);
router.delete("/timetable_delete", controller.timetable_delete);

module.exports = router;
