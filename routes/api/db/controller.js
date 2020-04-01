const mysql_dbc = require("../../../db_con");

exports.ticket_list = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const ticket = await connection.query("SELECT * FROM TICKET_LIST");
		res.send(ticket);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};
/************************************************************************************************************* */
exports.bus = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const bus = await connection.query("SELECT * FROM BUS_STOP");
		res.send(bus);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.bus_add = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const bus = await connection.query(
			"INSERT INTO BUS_STOP VALUES(?,?,?,?,?,?)",
			[
				req.body.BUS_STOP_ID,
				req.body.BUS_STOP_NAME,
				req.body.BOARDING_LOCATION,
				req.body.LATITUDE,
				req.body.LONGITUDE,
				req.body.PRICE
			]
		);
		res.send(bus);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.bus_update = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const bus = await connection.query(
			"UPDATE BUS_STOP SET BUS_STOP_NAME = ?,BOARDING_LOCATION = ?,LATITUDE = ?,LONGITUDE = ?, PRICE = ? WHERE BUS_STOP_ID = ?",
			[
				req.body.BUS_STOP_NAME,
				req.body.BOARDING_LOCATION,
				req.body.LATITUDE,
				req.body.LONGITUDE,
				req.body.PRICE,
				req.body.BUS_STOP_ID
			]
		);
		res.send(bus);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.bus_delete = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const bus = await connection.query(
			"DELETE FROM BUS_STOP WHERE BUS_STOP_ID = ?",
			[req.body.BUS_STOP_ID]
		);
		res.send(bus);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};
/***************************노선 관련*********************************************** */
exports.line = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const line = await connection.query("SELECT * FROM BUS_LINE");
		res.send(line);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.line_add = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const line = await connection.query(
			"INSERT INTO BUS_STOP VALUES(NULL,?,?,?,?,?,?,?,?)",
			[
				req.body.BUS_LINE_ID,
				req.body.BUS_STOP_ID,
				req.body.WAYPOINT1_ID,
				req.body.WAYPOINT2_ID,
				req.body.WAYPOINT3_ID,
				req.body.WAYPOINT4_ID,
				req.body.WAYPOINT5_ID,
				req.body.DESTINATION_ID
			]
		);
		res.send(line);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.line_update = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const line = await connection.query(
			"UPDATE BUS_LINE SET BUS_LINE_ID = ?,BUS_STOP_ID = ?,WAYPOINT1_ID = ?,WAYPOINT2_ID = ?, WAYPOINT3_ID = ?, WAYPOINT4_ID = ?, WAYPOINT5_ID = ?,DESTINATION_ID = ? WHERE IDX =?",
			[
				req.body.BUS_LINE_ID,
				req.body.BUS_STOP_ID,
				req.body.WAYPOINT1_ID,
				req.body.WAYPOINT2_ID,
				req.body.WAYPOINT3_ID,
				req.body.WAYPOINT4_ID,
				req.body.WAYPOINT5_ID,
				req.body.DESTINATION_ID,
				req.body.IDX
			]
		);
		res.send(line);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.line_delete = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const line = await connection.query("DELETE FROM BUS_LINE WHERE IDX = ?", [
			req.body.IDX
		]);
		res.send(line);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

/*********************************시간표************************************** */
exports.timetable = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		if (req.query.type == 0) {
			const timetable = await connection.query(
				"SELECT * FROM BUS_START WHERE BUS_STOP_ID !=1001 AND BUS_STOP_ID !=1002 AND NOT BUS_STOP_ID LIKE '5%' AND NOT BUS_STOP_ID LIKE '6%' "
			);
			res.send(timetable);
		} else if (req.query.type == 1) {
			const timetable = await connection.query(
				"SELECT * FROM BUS_START WHERE BUS_STOP_ID =1001 OR BUS_STOP_ID =1002"
			);
			res.send(timetable);
		}
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.timetable_add = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const timetable = await connection.query(
			"INSERT INTO BUS_START VALUES(NULL,?,?,?,?,?,?,?,?)",
			[
				req.body.BUS_ID,
				req.body.BUS_LINE_ID,
				req.body.DAY_OF_WEEK,
				req.body.TIME,
				req.body.BUS_STOP_ID,
				req.body.DESTINATION_ID
			]
		);
		res.send(timetable);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.timetable_update = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const timetable = await connection.query(
			"UPDATE BUS_START SET BUS_ID = ? ,BUS_LINE_ID = ?,DAY_OF_WEEK = ?,TIME = ? ,BUS_STOP_ID = ?,DESTINATION_ID = ? WHERE IDX =?",
			[
				req.body.BUS_ID,
				req.body.BUS_LINE_ID,
				req.body.DAY_OF_WEEK,
				req.body.TIME,
				req.body.BUS_STOP_ID,
				req.body.DESTINATION_ID,
				req.body.IDX
			]
		);
		res.send(timetable);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

exports.timetable_delete = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const timetable = await connection.query(
			"DELETE FROM BUS_START WHERE IDX = ?",
			[req.body.IDX]
		);
		res.send(timetable);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};

/*********************************************************************** */
exports.graph = async (req, res) => {
	try {
		const connection = await mysql_dbc.test_open();
		const graph = await connection.query(
			"SELECT TL.BUS_ID,COUNT(TL.BUS_ID),BS.DESTINATION_ID,BS.BUS_STOP_ID,BS.TIME,BS.DAY_OF_WEEK,B.BUS_STOP_NAME FROM TICKET_LIST TL,BUS_START BS,BUS_STOP B WHERE BS.BUS_ID = TL.BUS_ID AND BS.BUS_STOP_ID = B.BUS_STOP_ID AND TL.TICKET_DATE > date_sub(NOW(),INTERVAL 1 MONTH) GROUP BY TL.BUS_ID;"
		);
		res.json(graph);
		connection.end();
	} catch (err) {
		res.status(403).json({
			message: "조회된 값 없음"
		});
	}
};
