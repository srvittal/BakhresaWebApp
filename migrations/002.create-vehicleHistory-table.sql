CREATE TABLE vehicle_history (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	VisitGroup TEXT NOT NULL,
    DateEntry TEXT NOT NULL,
	TimeEntry TEXT NOT NULL,
	VehicleReg TEXT NOT NULL,
    DateExit TEXT NOT NULL,
	TimeExit TEXT NOT NULL,
	VehicleType Text NOT NULL,
	Purpose Text NOT NULL
);